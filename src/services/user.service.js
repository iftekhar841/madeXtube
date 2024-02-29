import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getUserObjectId } from "../utils/helperFunctions.js";

//Generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong, while generating refresh and access token"
    );
  }
};

//Register User
const registerUser = async (
  userDetails,
  avatarLocalPath,
  coverImageLocalPath
) => {
  const { username, fullName, email, password } = userDetails;

  if (
    [username, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log("existingUser", existingUser);
  if (existingUser) {
    if (existingUser.username === username) {
      throw new ApiError(409, "Username already exists.");
    } else if (existingUser.email === email) {
      throw new ApiError(409, "Email already exists.");
    }
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return createdUser;
};

//Login User
const loginUser = async (loginDetails) => {
  //TODO
  // req.body - data
  //username or email exists
  //find the user
  //check password
  //access & refresh token generation
  //send tokens in secure cookies

  const { emailAndUserName, password } = loginDetails;

  if (!emailAndUserName) {
    throw new ApiError(400, "Username or email is required.");
  }

  const user = await User.findOne({
    $or: [{ username: emailAndUserName }, { email: emailAndUserName }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return {
    loggedInUser,
    accessToken,
    refreshToken,
  };
};

//Logout User
const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  return { message: "User logout was successful" };
};

const getUserChannelProfile = async (paramsData, requestUserId) => {
  const { username } = paramsData;
  console.log("user", username);

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const userAggregate = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo", //to whom subscribe
      },
    },
    {
      $lookup: {
        from: "channels",
        localField: "_id",
        foreignField: "owner",
        as: "channelData",
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "channelData._id",
        foreignField: "channel",
        as: "videosData",
      }
    },
    // {
    //   $lookup: {
    //     from: "playlists",
    //     localField: "channelData.owner",
    //     foreignField: "owner",
    //     as: "playlistsData",
    //   }
    // },
    // {
    //     $lookup: {
    //       from: "videos",
    //       localField: "playlistsData.videos",
    //       foreignField: "_id",
    //       as: "playlistsVideos",
    //     }
    // },
    {
      $unwind: "$channelData",
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelIsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [requestUserId, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        fullName: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        channelData: {
          _id: 1,
          channelName: 1,
          description: 1,
        },
        // videosData: 1,
        videosData: {
          _id: 1,
          videoFile: 1,
          thumbnail: 1,
          title: 1,
          description: 1,
          duration: 1,
          views: 1,
          isPublished: 1,
          createdAt: 1,
        },
        // playlistsData: 1,
        // playlistsVideos: 1,
        isSubscribed: 1,
        subscribersCount: 1,
        channelIsSubscribedToCount: 1,
      },
    },
  ]);

  if (!userAggregate?.length) {
    throw new ApiError(404, "Channel does not exists");
  }

  return userAggregate[0];
};

const getAllUsers = async () => {
  const totalUsers = await User.countDocuments();

  if (!totalUsers) {
    throw new ApiError(404, "No users found");
  }

  return totalUsers;
};

const getUserProfile = async (paramsData) => {
  const { userId } = paramsData;

  if (!userId?.trim()) {
    throw new ApiError(400, "userId is missing");
  }

  const user = await getUserObjectId(userId);
  console.log("user", user);

}

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUserChannelProfile,
  getAllUsers,
  getUserProfile
};

import userService from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const userDetails = req.body;
    const files = req.files;

    // Extract avatarLocalPath and coverImageLocalPath more clearly
    const avatarLocalPath = files?.avatar[0]?.path;
    const coverImageLocalPath = files?.coverImage?.[0]?.path;

    // Register the user with the provided data
    const userResponse = await userService.registerUser(
      userDetails,
      avatarLocalPath,
      coverImageLocalPath
    );
    return res
      .status(201)
      .json(
        new ApiResponse(201, userResponse, "User registered Successfully.")
      );
  } catch (error) {
    // Check if the error is due to undefined properties and handle it accordingly
    if (error.message.includes("Cannot read properties of undefined")) {
      return res
        .status(400)
        .json(
          new ApiError({ message: "Invalid request. Please provide files." })
        );
    }
    // Handle errors and return an appropriate error response
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { loggedInUser, accessToken, refreshToken } =
      await userService.loginUser(req.body);

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in Successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    await userService.logoutUser(req.user._id);

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: true,
    };
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return res.status(200).json(new ApiResponse(200, {}, "User logged Out"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  try {
    console.log("requesting ", req.user._id);
    const response = await userService.getUserChannelProfile(
      req.params,
      req.user._id
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          response,
          "User Channel Profile fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUserChannelProfile,
};

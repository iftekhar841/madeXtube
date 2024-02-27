import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/videos.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  getCategoryObjectId,
  formatDuration,
  isValidObjectId,
  getUserObjectId,
} from "../utils/helperFunctions.js";
import { Channel } from "../models/channel.model.js";
import { VideoLikeAndDislike } from "../models/videoLikeAndDislike.model.js";
import { Category } from "../models/categories.model.js";

//Created videos
const createVideos = async (
  videoDetails,
  videoFileLocalPath,
  thumbnailLocalPath
) => {
  const { title, description, views, channelId, categoryIds } = videoDetails;

  if (!channelId || !categoryIds || categoryIds.length === 0) {
    throw new ApiError(
      404,
      "channelId and categoryId are required and cannot be empty"
    );
  }

  // Fetch channel and categories in parallel
  const [channels, categories] = await Promise.all([
    Channel.findById({ _id: channelId }).select("_id"),
    Category.find({ _id: { $in: categoryIds } }),
  ]);

  if (!channels) {
    throw new ApiError(404, "channels does not exist");
  }

  // Check if video file and thumbnail are provided
  if (!videoFileLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "video file and thumbnail are required");
  }

  // Upload video file and thumbnail to cloudinary in parallel
  const [video, thumbnailImage] = await Promise.all([
    await uploadOnCloudinary(videoFileLocalPath),
    await uploadOnCloudinary(thumbnailLocalPath),
  ]);

  if (!video || !video.duration) {
    throw new ApiError(400, "Video upload failed or duration not available");
  }

  const formattedDuration = formatDuration(video.duration); // Convert duration seconds into this format HH:MM:SS.

  if (!thumbnailImage) {
    throw new ApiError(400, "Thumbnail upload failed");
  }

  // Extract category IDs
  const categoryIdsArray = categories.map((category) => category._id);

  // Create video document
  const videoData = await Video.create({
    title,
    videoFile: video.url || "",
    thumbnail: thumbnailImage.url || "",
    description,
    duration: formattedDuration,
    views,
    channel: channels._id,
    videoCategory: categoryIdsArray,
  });

  const dataToFetch = await Video.findById(videoData._id);

  if (!dataToFetch) {
    throw new ApiError(500, "Error fetching the video");
  }
  return dataToFetch;
};

// Get all videos
const getAllVideos = async (queryParams) => {
  const { page = 1, limit = 12 } = queryParams || {}; // Set default values if queryData is undefined;
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  const videoAggregate = await Video.aggregate([
    {
      $lookup: {
        from: "channels",
        localField: "channel",
        foreignField: "_id",
        as: "channelData",
      },
    },
    {
      $unwind: "$channelData",
    },
    {
      $lookup: {
        from: "users",
        localField: "channelData.owner",
        foreignField: "_id",
        as: "ownerData",
      },
    },
    {
      $unwind: "$ownerData",
    },
    {
      $addFields: {
        "channelData.owner": {
          _id: "$ownerData._id",
          avatar: "$ownerData.avatar",
        },
      },
    },
    {
      $project: {
        _id: 1,
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        videoCategory: 1,
        createdAt: 1,
        channelData: {
          _id: 1,
          channelName: 1,
          owner: 1,
        },
      },
    },
    {
      $facet: {
        videos: [
          { $skip: (parsedPage - 1) * parsedLimit },
          { $limit: parsedLimit },
        ],
        metadata: [{ $count: "totalVideos" }],
      },
    },
    {
      $addFields: {
        pagination: {
          fetchNoOfDocs: { $size: "$videos" },
          totalRecords: { $arrayElemAt: ["$metadata.totalVideos", 0] },
          totalPages: {
            $ceil: {
              $divide: [
                { $arrayElemAt: ["$metadata.totalVideos", 0] },
                parsedLimit,
              ],
            },
          },
          currentPage: parsedPage,
          perPage: parsedLimit,
        },
      },
    },
    {
      $project: {
        videos: 1,
        pagination: 1,
      },
    },
  ]);

  if (
    !videoAggregate ||
    !videoAggregate[0] ||
    videoAggregate[0].videos.length === 0
  ) {
    throw new ApiError(404, "No video found");
  }

  return videoAggregate[0];
};

// Get single video by using its Id
const getSingleVideoById = async (paramsData) => {
  const { videoId } = paramsData;

  // Validate and create ObjectId instances for videoId
  const validIds = isValidObjectId([videoId]);
  if (!validIds[videoId]) {
    throw new ApiError(400, "Invalid ObjectId Format");
  }

  // Fetch no of like count
  const videoLike = await VideoLikeAndDislike.find({ videoId: videoId });
  const likesCount = videoLike.reduce((sum, video) => sum + video.likes, 0);

  const singleVideoAggregate = await Video.aggregate([
    {
      $match: {
        _id: validIds[videoId],
      },
    },
    {
      $lookup: {
        from: "channels",
        localField: "channel",
        foreignField: "_id",
        as: "channelData",
      },
    },
    {
      $unwind: "$channelData",
    },
    {
      $lookup: {
        from: "users",
        localField: "channelData.owner",
        foreignField: "_id",
        as: "ownerData",
      },
    },
    {
      $unwind: "$ownerData",
    },
    {
      $addFields: {
        "channelData.owner": {
          _id: "$ownerData._id",
          avatar: "$ownerData.avatar",
        },
      },
    },
    {
      $project: {
        _id: 1,
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        videoCategory: 1,
        createdAt: 1,
        channelData: {
          _id: 1,
          channelName: 1,
          owner: 1,
        },
      },
    },
  ]);

  if (!singleVideoAggregate || singleVideoAggregate.length === 0) {
    throw new ApiError(404, "Video not found");
  }

  const singleVideo = singleVideoAggregate[0];

  // Attach likesCount to singleVideo
  singleVideo.likesCount = likesCount;

  return singleVideo;
};

// Update the view of video
const updateViewVideo = async (paramsData) => {
  const { videoId } = paramsData;

  // Validate and create ObjectId instance for videoId
  const validIds = isValidObjectId([videoId]);
  if (!validIds[videoId]) {
    throw new ApiError(400, "Invalid ObjectId Format");
  }

  const viewToUpdate = await Video.findByIdAndUpdate(
    videoId,
    {
      $inc: { views: 1 },
    },
    { new: true }
  );

  if (!viewToUpdate) {
    throw new ApiError(404, "Video not found or view is not updated.");
  }

  return viewToUpdate;
};

// Update the visibility of the video
const togglePublishVideo = async (paramsData, loggedInUser) => {
  const { videoId, userId } = paramsData;
  console.log("videoId: " + videoId);

  const validIds = isValidObjectId([videoId, userId]);

  if (!validIds[videoId] || !validIds[userId]) {
    throw new ApiError(400, "Invalid VideoId or UserId Format");
  }

  if (validIds[userId].toString() !== loggedInUser.toString()) {
    throw new ApiError(
      400,
      "Only authorize users can change the visibility of the video"
    );
  }

  const videoToFetch = await Video.findOne({ _id: validIds[videoId] });
  console.log("videoToFetch", videoToFetch);

  if (!videoToFetch) {
    throw new ApiError(404, "Video not found");
  }

  const togglePublishVideoUpdate = await Video.updateOne(
    { _id: validIds[videoId] },
    {
      $set: { isPublished: !videoToFetch.isPublished },
    },
    {
      new: true,
    }
  );

  return togglePublishVideoUpdate;
};

//  Get all the video by using of channelId
const getAllVideoByChannelId = async (paramsData) => {
  const { channelId } = paramsData;
  console.log("channelId", channelId);

  //Validate and create ObjectId instances for channelId
  const validIds = isValidObjectId([channelId]);

  if (!validIds[channelId]) {
    throw new ApiError(400, "Invalid ObjectId Format");
  }

  // Check existing channel
  const existingChannel = await Channel.findById(validIds[channelId]);

  if (!existingChannel) {
    throw new ApiError(404, "Channel does not exist");
  }

  // Find all the videos on the basis of the channel
  const videos = await Video.find({ channel: validIds[channelId] });

  if (videos && videos.length === 0) {
    throw new ApiError(404, "No Video Found");
  }

  return videos;
};

//  Get all the video by using of categoryId
const getAllVideoByCategoryId = async (paramsData) => {
  const { categoryId } = paramsData;

  //Validate and create ObjectId instances for categoryId
  const validIds = isValidObjectId([categoryId]);
  if (!validIds[categoryId]) {
    throw new ApiError(400, "Invalid ObjectId Format");
  }

  // Check existing category
  const existingCategory = await getCategoryObjectId(validIds[categoryId]);

  if (!existingCategory) {
    throw new ApiError(404, "Category does not exist");
  }

  // Find all the videos on the basis of the category

  const categoryVideoAggregate = await Video.aggregate([
    {
      $match: {
        videoCategory: validIds[categoryId],
      },
    },
    {
      $lookup: {
        from: "channels",
        localField: "channel",
        foreignField: "_id",
        as: "channelData",
      },
    },
    {
      $unwind: "$channelData",
    },
    {
      $lookup: {
        from: "users",
        localField: "channelData.owner",
        foreignField: "_id",
        as: "ownerData",
      },
    },
    {
      $unwind: "$ownerData",
    },
    {
      $addFields: {
        "channelData.owner": {
          _id: "$ownerData._id",
          avatar: "$ownerData.avatar",
        },
      },
    },
    {
      $project: {
        _id: 1,
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        videoCategory: 1,
        createdAt: 1,
        channelData: {
          _id: 1,
          channelName: 1,
          owner: 1,
        },
      },
    },
  ]);

  if (categoryVideoAggregate && categoryVideoAggregate.length === 0) {
    throw new ApiError(404, "No Video Found");
  }

  return categoryVideoAggregate;
};

//  Get all the video by using of shortsId
const getAllVideoByShortsId = async (queryData) => {
  const { page = 1, limit = 12 } = queryData;

  const shortsExists = await Category.findOne({ categoryName: "Shorts" });

  if (!shortsExists) {
    throw new ApiError(400, "Shorts does not exist");
  }

  const shortsVideoAggregate = await Video.aggregate([
    {
      $match: { videoCategory: shortsExists._id },
    },
    {
      $lookup: {
        from: "channels",
        localField: "channel",
        foreignField: "_id",
        as: "channelData",
      },
    },
    { $unwind: "$channelData" },
    {
      $lookup: {
        from: "users",
        localField: "channelData.owner",
        foreignField: "_id",
        as: "ownerData",
      },
    },
    { $unwind: "$ownerData" },
    {
      $lookup: {
        from: "categories",
        localField: "videoCategory",
        foreignField: "_id",
        as: "videoCategoryData",
      },
    },
    { $unwind: "$videoCategoryData" },
    {
      $addFields: {
        "channelData.owner": {
          _id: "$ownerData._id",
          avatar: "$ownerData.avatar",
        },
      },
    },
    {
      $project: {
        _id: 1,
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        channel: 1,
        createdAt: 1,
        updatedAt: 1,
        videoCategoryData: {
          _id: "$videoCategoryData._id",
          categoryName: "$videoCategoryData.categoryName",
        },
        channelData: {
          _id: 1,
          channelName: 1,
          owner: 1,
        },
      },
    },
    {
      $facet: {
        metadata: [{ $count: "totalShortsVideos" }],
        shortsVideos: [{ $skip: (page - 1) * limit }, { $limit: limit }],
      },
    },
  ]);

  if (!shortsVideoAggregate[0].shortsVideos.length) {
    throw new ApiError(404, "No Shorts Video Found");
  }

  return shortsVideoAggregate[0];
};

//  Get all the Liked Videos by using of userId
const getAllLikedVideos = async (paramsData, loggedInUser) => {
  const { userId } = paramsData;

  //Validate and create ObjectId instances for userId
  const validIds = isValidObjectId([userId]);

  if (!validIds[userId]) {
    throw new ApiError(400, "Invalid userId Format");
  }

  // Check existing user
  const existingUser = await getUserObjectId(validIds[userId]);

  if (existingUser !== loggedInUser) {
    throw new ApiError(
      400,
      "You are not authorized to view liked videos of another user"
    );
  }

  // Find all video IDs liked by the user
  const likedVideoIds = await VideoLikeAndDislike.find({
    likedBy: existingUser,
  }).distinct("videoId");

  if (!likedVideoIds.length) {
    throw new ApiError(404, "This user has not liked any video");
  }

  // Find details of liked videos from the Video model
  const fetchLikedVideos = await Video.find({ _id: { $in: likedVideoIds } });

  if (!fetchLikedVideos.length) {
    throw new ApiError(404, "There are no liked videos");
  }

  return fetchLikedVideos;
};

export default {
  createVideos,
  getAllVideos,
  getSingleVideoById,
  updateViewVideo,
  togglePublishVideo,
  getAllVideoByChannelId,
  getAllVideoByCategoryId,
  getAllVideoByShortsId,
  getAllLikedVideos,
};

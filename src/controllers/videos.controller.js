import videosService from "../services/videos.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createVideos = asyncHandler(async (req, res) => {
  try {
    const videoDetails = req.body;
    const files = req.files;

    // Extract videoFileLocalPath and thumbnailLocalPath more clearly
    const videoFileLocalPath = files?.videoFile[0]?.path;
    const thumbnailLocalPath = files?.thumbnail?.[0]?.path;

    // User Upload the video with the provided data
    const videoResponse = await videosService.createVideos(
      videoDetails,
      videoFileLocalPath,
      thumbnailLocalPath
    );
    return res
      .status(201)
      .json(new ApiResponse(201, videoResponse, "Video created Successfully."));
  } catch (error) {
    console.log("controller error: " , error);
    // Check if the error is due to undefined properties and handle it accordingly
    if (error.message.includes("Cannot read properties of undefined")) {
      return res.status(400).json(
        new ApiError({
          message: "Invalid request. Please provide video files.",
        })
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

const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const allVideosResponse = await videosService.getAllVideos(req.query);
    return res
      .status(200)
      .json(
        new ApiResponse(200, allVideosResponse, "Videos fetch successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

const getSingleVideoById = asyncHandler(async (req, res) => {
  try {
    const singleVideoResponse = await videosService.getSingleVideoById(
      req.params
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          singleVideoResponse,
          "Video retrieved successfully"
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

const updateViewVideo = asyncHandler(async (req, res) => {
  try {
    const viewResponse = await videosService.updateViewVideo(req.params);
    return res
      .status(200)
      .json(new ApiResponse(200, viewResponse, "The view has been increased."));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

const togglePublishVideo = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const publishVideoResponse = await videosService.togglePublishVideo(
      req.params,
      loggedInUser  
    );
    return res
      .status(200)
      .json(new ApiResponse(200, publishVideoResponse, "Video publish toggled successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

const getAllVideoByChannelId = asyncHandler(async (req, res) => {
  try {
    const channelVideoRespoonse = await videosService.getAllVideoByChannelId(
      req.params
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelVideoRespoonse,
          "Video retrieved successfully"
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

const getAllVideoByCategoryId = asyncHandler(async (req, res) => {
  try {
    const categoryVideoRespoonse = await videosService.getAllVideoByCategoryId(
      req.params
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categoryVideoRespoonse,
          "Video retrieved successfully"
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

const getAllVideoByShortsId = asyncHandler(async (req, res) => {
  try {
    const shortsVideoRespoonse = await videosService.getAllVideoByShortsId(
      req.query
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          shortsVideoRespoonse,
          "Shorts video retrieved successfully"
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

const getAllLikedVideos = asyncHandler(async (req, res) =>{
  try {
    const loggedInUser = req.user?._id;
    const likedVideosResponse = await videosService.getAllLikedVideos(req.params, loggedInUser);
    return res
     .status(200)
     .json(
        new ApiResponse(
          200,
          likedVideosResponse,
          "Liked videos retrieved successfully"
        )
      );
  } catch (error) {
    return res
     .status(500)
     .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
})

export default {
  createVideos,
  getAllVideos,
  getSingleVideoById,
  updateViewVideo,
  togglePublishVideo,
  getAllVideoByChannelId,
  getAllVideoByCategoryId,
  getAllVideoByShortsId,
  getAllLikedVideos
};

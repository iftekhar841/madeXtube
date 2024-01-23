import videoLikeAndDislikeService from "../services/videoLikeAndDislike.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Video Like Controller to handle the API request and response
const createLikeVideo = asyncHandler(async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.params.userId;
    const videoLikeResponse = await videoLikeAndDislikeService.createLikeVideo(
      videoId,
      userId
    );
    return res
      .status(201)
      .json(
        new ApiResponse(201, videoLikeResponse, "Video liked successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

// Create Video DisLike Controller to handle the API request and response
const createdisLikeVideo = asyncHandler(async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.params.userId;
    const videodisLikeResponse =
      await videoLikeAndDislikeService.createdisLikeVideo(videoId, userId);
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          videodisLikeResponse,
          "Video disliked successfully"
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
  createLikeVideo,
  createdisLikeVideo,
};

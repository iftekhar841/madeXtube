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
        .json(
          new ApiResponse(201, videoResponse, "Video created Successfully.")
        );
    } catch (error) {
      // Handle errors and return an appropriate error response
      return res
        .status(500)
        .json(
          new ApiError({ statusCode: error.statusCode, message: error.message })
        );
    }
  });



  export default {
    createVideos
  }
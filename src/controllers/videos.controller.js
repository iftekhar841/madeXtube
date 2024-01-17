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
      console.log("error inside catch block", error);
      // Handle errors and return an appropriate error response
      return res
        .status(500)
        .json(
          new ApiError({ statusCode: error.statusCode, message: error.message })
        );
    }
});

const getAllVideos = asyncHandler(async (req, res) =>{
    try {
        const allVideosResponse = await videosService.getAllVideos(req.query);
        return res
        .status(200)
        .json( new ApiResponse(200, allVideosResponse, "Videos fetch successfully") );
    } catch (error) {
        return res
        .status(500)
        .json(new ApiError({ statusCode: error.statusCode, message: error.message }));
    }
});

const getSingleVideoById = asyncHandler(async (req, res) =>{
  try {
    const { videoId } = req.params;
    const singleVideoResponse = await videosService.getSingleVideoById(videoId);
    return res
    .status(200)
    .json( new ApiResponse(200, singleVideoResponse, "Video retrieved successfully") );
  } catch (error) {
    return res
    .status(500)
    .json(new ApiError({ statusCode: error.statusCode, message: error.message}));
  }
});

const getAllVideoByChannelId = asyncHandler(async (req, res) => {
  try {
    console.log("PARAMS GET", req.params);
    const channelVideoRespoonse = await videosService.getAllVideoByChannelId(req.params);
    return res
    .status(200)
    .json( new ApiResponse(200, channelVideoRespoonse, "Video retrieved successfully retrieved") );
    
  } catch (error) {
      return res
      .status(500)
      .json( new ApiError({ statusCode: error.statusCode, message: error.message}));
  }
})

  export default {
    createVideos,
    getAllVideos,
    getSingleVideoById,
    getAllVideoByChannelId
  }
import searchVideoService from "../services/searchVideo.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


// Search Video Controller
const searchVideo = asyncHandler (async (req, res) => {
    try {
        // Handle the search video response
        const searchVideoResponse = await searchVideoService.searchVideo(
            req.body
        );
        return res.status(200).json ( new ApiResponse(200, searchVideoResponse, "Video fetched successfully"));
    } catch (error) {
        return res
        .status(500)
        .json(
            new ApiError({ statusCode: error.statusCode, message: error.message })
          );
      }
    }
)


export default {
    searchVideo
};
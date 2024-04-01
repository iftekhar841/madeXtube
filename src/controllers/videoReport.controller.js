import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import videoReportService from "../services/videoReport.service.js";


// Create Video Report Controller
const CreateReportOnVideo = asyncHandler(async (req, res) => {
    try {
        // Handle the report on the video reponse 
        const loggedInUser = req.user._id;
        const videoReportResponse = await videoReportService.CreateReportOnVideo(
            loggedInUser,
            req.body
        );
        return res
        .status(201)
        .json( new ApiResponse(201, videoReportResponse, "Video report created successfully"))
        
    } catch (error) {
        return res
        .status(500)
        .json(
            new ApiError({ statusCode: error.statusCode, message: error.message })
        );
        
    }
})

export default {
    CreateReportOnVideo,
}
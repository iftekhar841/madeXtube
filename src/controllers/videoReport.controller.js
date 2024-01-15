import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import videoReportService from "../services/videoReport.service.js";


// Create Video Report Controller
const CreateVideoReport = asyncHandler(async (req, res) => {
    try {
        const createVideoReportResponse = await videoReportService.CreateVideoReport(
            req.body
        );
        return res
        .status(201)
        .json( new ApiResponse(201, createVideoReportResponse, "Video report created successfully"))
        
    } catch (error) {
        return res
        .status(500)
        .json(
            new ApiError({ statusCode: error.statusCode, message: error.message })
        );
        
    }
})

export default {
    CreateVideoReport,
}
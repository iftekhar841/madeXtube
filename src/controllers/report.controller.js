import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import reportService from "../services/report.service.js";

//Create Reports Controller
const createReport = asyncHandler(async (req, res) => {
    try {
        const reportResponse = await reportService.createReport(req.body);
        return res
            .status(201)
            .json(new ApiResponse(201, reportResponse, "Report created successfully"));

    } catch (error) {
        // Handle errors and return an appropriate error response
    return res
    .status(500)
    .json(
      new ApiError({ statusCode: error.statusCode, message: error.message })
    );

    }
});


//Read Reports Controller
const getReports = asyncHandler(async (req, res) => {
    try {
        const getReportResponse = await reportService.getReports();
        return res
            .status(200)
            .json(new ApiResponse(201, getReportResponse, "Fetch all reports successfully"));

    } catch (error) {
        // Handle errors and return an appropriate error response
    return res
    .status(500)
    .json(
      new ApiError({ statusCode: error.statusCode, message: error.message })
    );

    }
});


//Update Reports Controller
const updateReport = asyncHandler(async (req, res) => {
    try {
        const updateReportResponse = await reportService.updateReport(req.body);

        return res
            .status(200)
            .json(new ApiResponse(200, updateReportResponse, "Report details updated successfully"));
    }
    catch (error) {
        // Handle errors and return an appropriate error response
    return res
    .status(500)
    .json(
      new ApiError({ statusCode: error.statusCode, message: error.message })
    );
    }
});

//Delete Report Controller
const deleteReport = asyncHandler(async (req, res) => {
    //Todo: delete Report
    try {

        const deleteReportResponse = await reportService.deleteReport(req.params);

        return res
            .status(200)
            .json(new ApiResponse(200, deleteReportResponse, "Report deleted successfully"));

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
    createReport,
    getReports,
    updateReport,
    deleteReport
}
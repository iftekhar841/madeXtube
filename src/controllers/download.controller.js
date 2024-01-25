import  downloadService  from "../services/download.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addDownloadVideo = asyncHandler( async (req, res) => {
    try {
        // Fetch logged in user id
        const loggedInUser = req.user._id;
        const downloadResponse = await downloadService.addDownloadVideo(
            req.params,
            loggedInUser
        );
        return res
        .status(200)
        .json( new ApiResponse( 201, downloadResponse, "Downloaded Successfully "));
        
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError( { statusCode: error.statusCode, message: error.message } ) );
    }
})


const deleteDownloadVideo = asyncHandler( async (req, res) => {
    try {
        // Fetch logged in user id
        const loggedInUser = req.user._id;
        const deleteDownloadResponse = await downloadService.deleteDownloadVideo(
            req.params,
            loggedInUser
        );
        return res
        .status(200)
        .json( new ApiResponse( 200, deleteDownloadResponse, "Video removed from Download Successfully."));
        
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError( { statusCode: error.statusCode, message: error.message } ) );
    }
})


const deleteAllDownloadVideo = asyncHandler( async (req, res) => {
    try {
        // Fetch logged in user id
        const loggedInUser = req.user._id;
        const deleteAllDownloadResponse = await downloadService.deleteAllDownloadVideo(
            loggedInUser
        );
        return res
        .status(200)
        .json( new ApiResponse( 200, deleteAllDownloadResponse, "All Download list removed Successfully."));
        
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError( { statusCode: error.statusCode, message: error.message } ) );
    }
})


const getAllDownloadVideo = asyncHandler( async (req, res) => {
    try {
        // Fetch logged in user id
        const loggedInUser = req.user._id;
        const getAllDownloadResponse = await downloadService.getAllDownloadVideo(
            loggedInUser,
            req.query
        );
        return res
        .status(200)
        .json( new ApiResponse( 200, getAllDownloadResponse, "All Download reterived Successfully."));
        
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError( { statusCode: error.statusCode, message: error.message } ) );
    }
})

export default {
    addDownloadVideo,
    deleteDownloadVideo,
    deleteAllDownloadVideo,
    getAllDownloadVideo
}
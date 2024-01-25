import historyService from "../services/history.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addHistory = asyncHandler( async (req, res) => {
    try {
        // Fetch logged in user id
        const loggedInUser = req.user._id;
        const historyResponse = await historyService.addHistory(
            req.params,
            loggedInUser
        );
        return res
        .status(200)
        .json( new ApiResponse( 201, historyResponse, "Video added in History Successfully."));
        
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError( { statusCode: error.statusCode, message: error.message } ) );
    }
});

const removedSingleHistory = asyncHandler( async (req, res) => {
    try {
        // Fetch logged in user id
        const loggedInUser = req.user._id;
        const historyRemoveResponse = await historyService.removedSingleHistory(
            req.params,
            loggedInUser
        );
        return res
        .status(200)
        .json( new ApiResponse( 201, historyRemoveResponse, "History removed Successfully."));
        
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError( { statusCode: error.statusCode, message: error.message } ) );
    }
});

const removedAllHistory = asyncHandler( async (req, res) => {
    try {
        // Fetch logged in user id
        const loggedInUser = req.user._id;
        const removedAllHistoryResponse = await historyService.removedAllHistory(
            loggedInUser
        );
        return res
        .status(200)
        .json( new ApiResponse( 200, removedAllHistoryResponse, "All History removed Successfully."));
        
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError( { statusCode: error.statusCode, message: error.message } ) );
    }
});

const getAllHistory = asyncHandler( async (req, res) => {
    try {
        // Fetch logged in user id
        const loggedInUser = req.user._id;
        const removedAllHistoryResponse = await historyService.getAllHistory(
            loggedInUser,
            req.query
        );
        return res
        .status(200)
        .json( new ApiResponse( 200, removedAllHistoryResponse, "All History reterived Successfully."));
        
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError( { statusCode: error.statusCode, message: error.message } ) );
    }
});


export default {
    addHistory,
    removedSingleHistory,
    removedAllHistory,
    getAllHistory
}
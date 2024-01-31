import addWatchLaterService from "../services/watchLater.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add watch later Controller to handle the API request and response
const addWatchLater = asyncHandler(async(req, res) => {
    try {
        const loggedInUser = req.user?._id;
        const watchLaterResponse = await addWatchLaterService.addWatchLater(
            loggedInUser,
            req.params
        );

        return res
        .status(200)
        .json( new ApiResponse(200, watchLaterResponse, "Video added in WatchLater list Successfully."))
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError( { statucode: error.statucode, message: error.message }))
    }
})

// Remove Single watch later Controller to handle the API request and response
const removeWatchLater = asyncHandler(async(req, res) => {
    try {
        const loggedInUser = req.user?._id;
        const removeWatchLaterResponse = await addWatchLaterService.removeWatchLater(
            loggedInUser,
            req.params
        );

        return res
        .status(200)
        .json( new ApiResponse(200, removeWatchLaterResponse, "Video removed from Watch Later Successfully."))
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError( { statucode: error.statucode, message: error.message }))
    }
})

// Remove All watch later Controller to handle the API request and response
const removeAllWatchLater = asyncHandler(async(req, res) => {
    try {
        const loggedInUser = req.user?._id;
        const removeWatchLaterResponse = await addWatchLaterService.removeAllWatchLater(
            loggedInUser,
            req.params
        );

        return res
        .status(200)
        .json( new ApiResponse(200, removeWatchLaterResponse, "All Watch Later list removed Successfully."))
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError( { statucode: error.statucode, message: error.message }))
    }
})


// Get All watch later Controller to handle the API request and response
const getAllWatchLater = asyncHandler(async(req, res) => {
    try {
        const loggedInUser = req.user?._id;
        const removeWatchLaterResponse = await addWatchLaterService.getAllWatchLater(
            loggedInUser
        );

        return res
        .status(200)
        .json( new ApiResponse(200, removeWatchLaterResponse, "All Watch Later list removed Successfully."))
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError( { statucode: error.statucode, message: error.message }))
    }
})


export default {
    addWatchLater,
    removeWatchLater,
    removeAllWatchLater,
    getAllWatchLater
}
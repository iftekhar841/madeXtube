import playlistService from "../services/playlist.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlayList = asyncHandler(async(req, res) => {
    try {
        const loggedInUser = req.user._id;
        const playlistResponse = await playlistService.createPlayList(
            req.body,
            req.params,
            loggedInUser
        );
        return res
        .status(200)
        .json( new ApiResponse(200, playlistResponse, "Playlist created successfully"));
    } catch (error) {
        return res
        .status(500)
        .json(new ApiError( { statusCode: error.statusCode, message: error.message }))
    }
});


const updatePlayList = asyncHandler(async(req, res) => {
    try {
        const loggedInUser = req.user._id;
        const playlistResponse = await playlistService.updatePlayList(
            req.body,
            req.params,
            loggedInUser
        );
        return res
        .status(200)
        .json( new ApiResponse(200, playlistResponse, "Playlist updated successfully"));
    } catch (error) {
        return res
        .status(500)
        .json(new ApiError( { statusCode: error.statusCode, message: error.message }))
    }
})


const deletePlayList = asyncHandler(async(req, res) => {
    try {
        const loggedInUser = req.user._id;
        const playlistResponse = await playlistService.deletePlayList(
            req.params,
            loggedInUser
        );
        return res
        .status(200)
        .json( new ApiResponse(200, playlistResponse, "Playlist deleted successfully"));
    } catch (error) {
        return res
        .status(500)
        .json(new ApiError( { statusCode: error.statusCode, message: error.message }))
    }
})

export default {
    createPlayList,
    updatePlayList,
    deletePlayList
}
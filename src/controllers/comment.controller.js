import commentService from "../services/comment.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// Comment Controllers
const createComment = asyncHandler(async (req, res) => {
    try {
        // Fetch logged in user id
        const loggedInUser = req.user._id;
        const commentResponse = await commentService.createComment(
            req.body,
            req.params,
            loggedInUser
        );
       
        return res
        .status(201)
        .json( new ApiResponse(201, commentResponse, "Comment created") );
    } catch (error) {
        return res
      .status(500)
      .json( new ApiError( { statusCode: error.statusCode, message: error.message } ) );
    }
});


const updateComment = asyncHandler(async (req, res) => {
    try {
        // Fetch logged in user id
        const loggedInUser = req.user._id;
        const commentResponse = await commentService.updateComment(
            req.body,
            req.params,
            loggedInUser
        );
       
        return res
        .status(200)
        .json( new ApiResponse(200, commentResponse, "Comment Updated") );
    } catch (error) {
        return res
      .status(500)
      .json( new ApiError( { statusCode: error.statusCode, message: error.message } ) );
    }
})


const deleteComment = asyncHandler(async (req, res) => {
    try {
        // Fetch logged in user id
        const loggedInUser = req.user._id;
        const commentResponse = await commentService.deleteComment(
            req.params,
            loggedInUser
        );
       
        return res
        .status(200)
        .json( new ApiResponse(200, commentResponse, "Comment deleted successfully",) );
    } catch (error) {
        return res
      .status(500)
      .json( new ApiError( { statusCode: error.statusCode, message: error.message } ) );
    }
})


const getAllCommentsBySingleVideo = asyncHandler(async (req, res) => {
    try {
        const commentResponse = await commentService.getAllCommentsBySingleVideo(req.params);
        return res
        .status(200)
        .json( new ApiResponse(200, commentResponse, "Comment Fetched successfully" ) );
    } catch (error) {
        return res
      .status(500)
      .json( new ApiError( { statusCode: error.statusCode, message: error.message } ) );
    }
})



export default {
    createComment,
    updateComment,
    deleteComment,
    getAllCommentsBySingleVideo
}
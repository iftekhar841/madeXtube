import feedbackService from "../services/feedback.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createFeedback = asyncHandler(async (req, res) => {
  try {
    // Fetch logged in user id
    const loggedInUser = req.user._id;
    const { feedBackDescription } = req.body;
    const feedbackResponse = await feedbackService.createFeedback(
      loggedInUser,
      feedBackDescription
    );
    return res.status(201).json(new ApiResponse(201, feedbackResponse, "FeedBack Send Successfully!"));
    
  } catch (error) {
    return res.
    status(500).
    json(new ApiError({ statusCode: error.statusCode, message: error.message }));
  }
})


const getFeedbackByUserId = asyncHandler(async (req, res) => {
    try {
      // Handle feedback response
      const { userId } = req.query;
      console.log("User Id: " + userId);
      const feedbackResponse = await feedbackService.getFeedbackByUserId(userId);
      return res.status(200).json(new ApiResponse(200, feedbackResponse, "FeedBack Send Successfully!"));
      
    } catch (error) {
      return res.
      status(500).
      json(new ApiError({ statusCode: error.statusCode, message: error.message }));
    }
})


export default {
  createFeedback,
  getFeedbackByUserId
};
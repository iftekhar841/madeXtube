import SendFeedBack from "../models/feedback.model.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId } from "../utils/helperFunctions.js";


const createFeedback = async(loggedInUser,feedBackDescription) => {

    if(!feedBackDescription) {
        throw new ApiError(400, "Description is required");
    }

    const feedbackToCreate = await SendFeedBack.create({
        feedBackDescription: feedBackDescription,
        userId: loggedInUser
    });

    if(!feedbackToCreate) {
        throw new ApiError(400, "Failed to send a feedback, try again");
    }
    
    return feedbackToCreate;
}


const getFeedbackByUserId = async (userId) => {
    console.log("userId", userId);

    const isvalid = isValidObjectId([userId]);
    if(!isvalid[userId]) {
        throw new ApiError(400, "Invalid userId format");
    }
    
    const feedback = await SendFeedBack.findById(userId);
    console.log('Feedback', feedback);

    if(!feedback) {
        throw new ApiError(404, "Feedback not found");
    }
    
    return feedback;

}


export default {
  createFeedback,
  getFeedbackByUserId
};
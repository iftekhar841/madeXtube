import notificationService from "../services/notification.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getNotifications = asyncHandler( async(req, res)=> {
    try {
        const notificationResponse = await notificationService.getNotifications(
            req.query,
            req.user._id
        );
        return res.status(200).json(new ApiResponse(200, notificationResponse, "Notifications fetched successfully"));
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError({ statusCode: error.statusCode, message: error.message }))
        
    }
})

const updateNotification = asyncHandler(async(req, res) => {
    try {
        const notificationResponse = await notificationService.updateNotification(
            req.params
        );
        return res.status(200).json(new ApiResponse(200, notificationResponse, "Notification updated successfully"));
    } catch (error) {
        return res
       .status(500)
       .json(
            new ApiError({ statusCode: error.statusCode, message: error.message })
        );
    }
})

export default {
    getNotifications,
    updateNotification
}
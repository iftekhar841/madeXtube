import notificationService from "../services/notification.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getNotifications = asyncHandler(async (req, res) => {
  try {
    const notificationResponse = await notificationService.getNotifications(
      req.query,
      req.user._id
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          notificationResponse,
          "Notifications fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});



const readNotification = asyncHandler(async (req, res) => {
  try {
    const notificationResponse = await notificationService.readNotification(
      req.user._id
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          notificationResponse,
          "Notification read successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});



const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const notificationResponse = await notificationService.deleteNotification(
      req.query,
      req.user._id
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          notificationResponse,
          "Notification delete successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});


export default {
  getNotifications,
  readNotification,
  deleteNotification,
};

import { isValidObjectId } from "mongoose";
import Notification from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";

// Get all notifications
const getNotifications = async (queryParams, loggedInUser) => {
  const { type } = queryParams;

  // Define the condition to find notifications
  const condition = {
    type: { $regex: new RegExp(type, "i") },
    user: loggedInUser,
  };

  // Query to find notifications
  const notificationsQuery = Notification.find(condition)
    .sort({ createdAt: -1 })
    .lean(); // Use lean() to return plain JavaScript objects

  // Query to count the total number of unread notifications
  const countQuery = Notification.countDocuments({
    ...condition,
    isRead: false,
  });

  // Execute both queries in parallel
  const [notifications, countNotification] = await Promise.all([
    notificationsQuery,
    countQuery,
  ]);

  // Return both notifications and count
  return { notifications, countNotification };
};


// Update a notification and return the updated notification
const readNotification = async (loggedInUser) => {
  const isValid = isValidObjectId(loggedInUser);
  if (!isValid) {
    throw new ApiError(400, "Invalid loggedInUser Format");
  }
  const result = await Notification.updateMany(
    { user: loggedInUser, isRead: false, type: "subscribe" },
    { $set: { isRead: true } }
  );
  // Return the number of modified documents

  if (result.acknowledged === true && result.modifiedCount) {
    return result.modifiedCount;
  }
};


// Delete a notification
const deleteNotification = async (queryParams, loggedInUser) => {
  const { notificationId } = queryParams;

  if (!isValidObjectId(notificationId)) {
    throw new ApiError(400, "Invalid NotificationId Format");
  }

  // Find the notification by ID
  const fetchedNotification = await Notification.findById(notificationId);

  // Check if the notification exists
  if (!fetchedNotification) {
    throw new ApiError(404, "Notification not found");
  }

  // Check if the logged-in user is the owner of the notification
  if (fetchedNotification.user.toString() !== loggedInUser.toString()) {
    throw new ApiError(400, "Only authorize owner can delete the notification");
  }

  // Delete the notification
  const deletedNotification =
    await Notification.findByIdAndDelete(notificationId);

  // If the notification was not deleted, throw an error
  if (!deletedNotification) {
    throw new ApiError(400, "Error deleting the notification");
  }
  return deletedNotification;
};

export default {
  getNotifications,
  readNotification,
  deleteNotification,
};

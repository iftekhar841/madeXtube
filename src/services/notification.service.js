import { isValidObjectId } from "mongoose";
import Notification from "../models/notification.model.js";

  const getNotifications = async (queryParams, loggedInUser) => {
    const { type } = queryParams;
    console.log("type", type);
    const condition = {
      type: {
        $options: "i",
        $regex: type,
      },
      // isRead: false,
      user: loggedInUser,
    };
    console.log("condition", condition);

    // Query to find notifications
    const notificationsQuery = Notification.find(condition).sort({
      createdAt: -1,
    });
    const countCondition = {
      type: {
        $options: "i",
        $regex: type,
      },
      isRead: false,
      user: loggedInUser,
    };
    // Query to count the total number of notifications
    const countQuery = Notification.countDocuments(countCondition);

    // Execute both queries in parallel
    const [notifications, countNotification] = await Promise.all([
      notificationsQuery,
      countQuery,
    ]);

    console.log("Notifications", notifications);
    console.log("Total count of notifications", countNotification);

    // Return both notifications and count
    return { notifications, countNotification };
  };

const updateNotification = async (paramsData) => {
  const { notificationId } = paramsData;
  const isValid = isValidObjectId(notificationId);
  if (!isValid) {
    throw new ApiError(400, "Invalid NotificationId Format");
  }
  console.log("notificationId", notificationId);
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );
  console.log("notification", notification);
  return notification;
};


const readNotification = async (loggedInUser) => {
  const isValid = isValidObjectId(loggedInUser);
  if (!isValid) {
    throw new ApiError(400, "Invalid loggedInUser Format");
  }
  console.log("loggedInUser", loggedInUser);
  const result  = await Notification.updateMany(
    { user: loggedInUser, isRead: false, type:"subscribe" },
    { $set: { isRead: true },}
  );
  console.log("Update result:", result);
  // Return the number of modified documents

  if((result.acknowledged === true) && (result.modifiedCount)) {
      return result.modifiedCount;
  }
};

export default {
  getNotifications,
  updateNotification,
  readNotification
};

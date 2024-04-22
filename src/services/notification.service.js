import { isValidObjectId } from "mongoose";
import Notification from "../models/notification.model.js";



const getNotifications = async(queryParams, loggedInUser) => {
  const { type } = queryParams;
  console.log("type", type);
  const condition = {
       type: {
         $options: 'i',
         $regex: type
       },
       isRead: false,
       user: loggedInUser 
  }
  console.log("condition", condition);  

  const notifications = await Notification.find(condition).sort({ createdAt: -1 });
   console.log("Notifications", notifications);
  return notifications;
}


const updateNotification = async (paramsData) => {
    const { notificationId } = paramsData;
    const isValid = isValidObjectId(notificationId);
    if (!isValid) {
      throw new ApiError(400, "Invalid NotificationId Format");
    }
    console.log("notificationId", notificationId);
    const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    console.log("notification", notification);
    return notification;
}


export default {
    getNotifications,
    updateNotification
}
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import notificationController from "../controllers/notification.controller.js";

const notification_route = Router();

notification_route.get(
  "/notifications",
  verifyJWT,
  notificationController.getNotifications
);

notification_route.put(
  "/notifications/read-notification",
  verifyJWT,
  notificationController.readNotification
);

notification_route.delete(
  "/notifications/delete-notification",
  verifyJWT,
  notificationController.deleteNotification
);

export default notification_route;

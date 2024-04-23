import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const notification_route = Router();

import notificationController from "../controllers/notification.controller.js";

// notification_route.post('/create-notification', verifyJWT, notificationController.createNotification);

notification_route.get('/notifications', verifyJWT, notificationController.getNotifications);

notification_route.put('/notifications/update-notification/:notificatiId', verifyJWT, notificationController.updateNotification);

notification_route.put('/notifications/read-notification', verifyJWT, notificationController.readNotification)



export default notification_route;

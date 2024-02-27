import { Router } from "express";

const subscription_route = Router();

import subscriptionController from "../controllers/subscription.controller.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

subscription_route.post(
  "/add-subscription/:userId/:channelId",
  verifyJWT,
  mongoIdPathVariableValidator("userId"),
  mongoIdPathVariableValidator("channelId"),
  subscriptionController.createSubscription
);

subscription_route.delete(
  "/unsubscribe/:userId/:channelId",
  verifyJWT,
  mongoIdPathVariableValidator("userId"),
  subscriptionController.unsubcribeSubscription
);

subscription_route.get('/subscribed-videos', verifyJWT, subscriptionController.getUserSubscribedVideos);

subscription_route.get("/check-subscribe/:userId/:channelId", subscriptionController.checkIsSubcribe);
export default subscription_route;

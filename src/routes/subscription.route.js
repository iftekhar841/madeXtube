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
  "/unsubscribe/:userId",
  verifyJWT,
  mongoIdPathVariableValidator("userId"),
  subscriptionController.unsubcribeChannel
);

export default subscription_route;

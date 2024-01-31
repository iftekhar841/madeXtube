import { Router } from "express";

const watchLater_route = Router();

import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";
import watchLaterController from "../controllers/watchLater.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

watchLater_route.use(verifyJWT); //Apply verifyJWT middleware to all routes in this file

watchLater_route.post(
  "/add-watchLater/:videoId",
  mongoIdPathVariableValidator("videoId"),
  watchLaterController.addWatchLater
);

watchLater_route.delete(
  "/:videoId",
  mongoIdPathVariableValidator("videoId"),
  watchLaterController.removeWatchLater
);

watchLater_route.delete(
  "/delete-all/:owner",
  watchLaterController.removeAllWatchLater
);

export default watchLater_route;

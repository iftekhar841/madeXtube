import { Router } from "express";

const watchLater_route = Router();

import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";
import watchLaterController from "../controllers/watchLater.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


watchLater_route.post(
  "/add-watchLater/:videoId",
  verifyJWT,
  mongoIdPathVariableValidator("videoId"),
  watchLaterController.addWatchLater
);

watchLater_route.delete(
  "/:videoId",
  verifyJWT,
  mongoIdPathVariableValidator("videoId"),
  watchLaterController.removeWatchLater
);

watchLater_route.delete(
  "/delete-all/:owner",
  verifyJWT,
  watchLaterController.removeAllWatchLater
);

watchLater_route.get("/all-watchLater", verifyJWT, watchLaterController.getAllWatchLater);

export default watchLater_route;

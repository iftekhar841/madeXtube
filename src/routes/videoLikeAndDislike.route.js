import { Router } from "express";

const likeAndDislikeRoute = Router();

import videoLikeAndDislikeController from "../controllers/videoLikeAndDislike.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";

likeAndDislikeRoute.get(
  "/getAllLike/:videoId",
  mongoIdPathVariableValidator("videoId"),
  videoLikeAndDislikeController.getAllLikeVideo
);

likeAndDislikeRoute.post(
  "/like/:videoId/:userId",
  verifyJWT,
  videoLikeAndDislikeController.createLikeVideo
);

likeAndDislikeRoute.post(
  "/dislike/:videoId/:userId",
  verifyJWT,
  videoLikeAndDislikeController.createdisLikeVideo
);


export default likeAndDislikeRoute;

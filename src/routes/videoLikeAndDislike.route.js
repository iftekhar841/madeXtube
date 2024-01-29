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

likeAndDislikeRoute.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

likeAndDislikeRoute.post(
  "/like/:videoId/:userId",
  videoLikeAndDislikeController.createLikeVideo
);

likeAndDislikeRoute.post(
  "/dislike/:videoId/:userId",
  videoLikeAndDislikeController.createdisLikeVideo
);


export default likeAndDislikeRoute;

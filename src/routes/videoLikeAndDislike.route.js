import { Router } from "express";

const like_and_dislike_route = Router();

import videoLikeAndDislikeController from "../controllers/videoLikeAndDislike.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

like_and_dislike_route.post(
  "/like/:videoId/:userId",
  verifyJWT,
  videoLikeAndDislikeController.createLikeVideo
);

like_and_dislike_route.post(
  "/dislike/:videoId/:userId",
  verifyJWT,
  videoLikeAndDislikeController.createdisLikeVideo
);

export default like_and_dislike_route;

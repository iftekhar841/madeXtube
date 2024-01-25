import { Router } from "express";

const likeAndDislikeRoute = Router();

import videoLikeAndDislikeController from "../controllers/videoLikeAndDislike.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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

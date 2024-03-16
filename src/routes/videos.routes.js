import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";

const video_route = Router();

import videosController from "../controllers/videos.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

video_route.post(
  "/add-video",
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  videosController.createVideos
);

video_route.get("/all-videos", videosController.getAllVideos);

video_route.get(
  "/get-single-video/:videoId",
  mongoIdPathVariableValidator("videoId"),
  videosController.getSingleVideoById
);

video_route.patch(
  "/update-single-video/:videoId",  
  verifyJWT,
  mongoIdPathVariableValidator("videoId"), 
  videosController.updateSingleVideoById
);

video_route.delete(
  "/delete-single-video/:videoId",  
  verifyJWT,
  mongoIdPathVariableValidator("videoId"), 
  videosController.deleteSingleVideoById
);

video_route.patch(
  "/view/:videoId",
  mongoIdPathVariableValidator("videoId"),
  videosController.updateViewVideo
);

video_route.put("/toggle/publish/:videoId/users/:userId", verifyJWT, videosController.togglePublishVideo);

video_route.get(
  "/getByChannelId/:channelId",
  mongoIdPathVariableValidator("channelId"),
  videosController.getAllVideoByChannelId
);

video_route.get(
  "/getByCategoryId/:categoryId",
  mongoIdPathVariableValidator("categoryId"),
  videosController.getAllVideoByCategoryId
);

video_route.get("/shorts", videosController.getAllVideoByShortsId);

video_route.get("/liked-videos/users/:userId", verifyJWT, videosController.getAllLikedVideos);

export default video_route;

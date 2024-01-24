import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";

const video_route = Router();

import videosController from "../controllers/videos.controller.js";

video_route.post("/add-video",
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    videosController.createVideos
);

video_route.get('/all-videos', videosController.getAllVideos);

video_route.get('/get-single-video/:videoId', mongoIdPathVariableValidator('videoId'), videosController.getSingleVideoById);

video_route.get('/getByChannelId/:channelId', mongoIdPathVariableValidator('channelId'), videosController.getAllVideoByChannelId);

video_route.get('/getByCategoryId/:categoryId', mongoIdPathVariableValidator('categoryId'), videosController.getAllVideoByCategoryId);

video_route.get('/shorts/:shortsId', mongoIdPathVariableValidator('shortsId'), videosController.getAllVideoByShortsId);

export default video_route;

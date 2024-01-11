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

export default video_route;

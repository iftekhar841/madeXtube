import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

const video_route = Router();

import videosController from "../controllers/videos.controller.js";

video_route.post("/add-video",
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    videosController.createVideos
);

export default video_route;

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";

import  downloadController  from "../controllers/download.controller.js";

const download_route = Router();

download_route.post('/:videoId', verifyJWT, mongoIdPathVariableValidator('videoId'), downloadController.addDownloadVideo);

download_route.delete('/delete-single-video/:videoId', verifyJWT, mongoIdPathVariableValidator('videoId'), downloadController.deleteDownloadVideo);

download_route.delete('/delete-all', verifyJWT, downloadController.deleteAllDownloadVideo);

download_route.get('/all-download-video', verifyJWT, downloadController.getAllDownloadVideo);

export default download_route;

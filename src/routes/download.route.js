import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";

import  downloadController  from "../controllers/download.controller.js";

const download_route = Router();

download_route.use(verifyJWT); //Apply verifyJWT middleware to all routes in this file

download_route.post('/:videoId', mongoIdPathVariableValidator('videoId'), downloadController.addDownloadVideo);

download_route.delete('/delete-single-video/:videoId', mongoIdPathVariableValidator('videoId'), downloadController.deleteDownloadVideo);

download_route.delete('/delete-all', downloadController.deleteAllDownloadVideo);

download_route.get('/all-download-video', downloadController.getAllDownloadVideo);

export default download_route;

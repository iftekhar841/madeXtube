import { Router } from "express";

const searchVideo_route = Router();

import searchVideoController from "../controllers/searchVideo.controller.js";

searchVideo_route.post(
  "/video/search-video",
  searchVideoController.searchVideo
);

export default searchVideo_route;
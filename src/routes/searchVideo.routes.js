import { Router } from "express";

const searchVideo_route = Router();

import searchVideoController from "../controllers/searchVideo.controller.js";

searchVideo_route.get(
  "/video/search-video",
  searchVideoController.searchVideo
);

export default searchVideo_route;
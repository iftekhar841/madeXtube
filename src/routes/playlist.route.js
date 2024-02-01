import { Router } from "express";

const playlist_route = Router();

import playlistController from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";

playlist_route.post(
  "/add-playlist/:videoId",
  mongoIdPathVariableValidator("videoId"),
  verifyJWT,
  playlistController.createPlayList
);


playlist_route.patch(
    "/edit-playlist/:playListId",
    mongoIdPathVariableValidator("playListId"),
    verifyJWT,
    playlistController.updatePlayList
);

playlist_route.delete(
    "/delete-playlist/:playListId",
    mongoIdPathVariableValidator("playListId"),
    verifyJWT,
    playlistController.deletePlayList
  );

export default playlist_route;

import { Router } from "express";

const playlist_route = Router();

import playlistController from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";

playlist_route.get(
  "/playlists/users/:userId",
  mongoIdPathVariableValidator("userId"),
  playlistController.getUserPlayLists
);

playlist_route.use(verifyJWT); //Apply verifyJWT middleware to all routes in this file

playlist_route.post(
  "/playlists/videos/:videoId",
  mongoIdPathVariableValidator("videoId"),
  playlistController.createPlayList
);

playlist_route.post(
  "/playlists/:playListId/videos",
  mongoIdPathVariableValidator("playListId"),
  playlistController.addVideoToPlayList
);

playlist_route.patch(
  "/playlists/:playListId",
  mongoIdPathVariableValidator("playListId"),
  playlistController.updatePlayList
);

playlist_route.delete(
  "/playlists/:playListId",
  mongoIdPathVariableValidator("playListId"),
  playlistController.deleteSinglePlayList
);

playlist_route.delete(
  "/playlists/:playListId/videos/:videoId",
  mongoIdPathVariableValidator("playListId"),
  mongoIdPathVariableValidator("videoId"),
  playlistController.removeSingleVideoFromPlayList
);

export default playlist_route;

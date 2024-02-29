import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const user_route = Router();

import userController from "../controllers/user.controller.js";

user_route.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userController.registerUser
);

user_route.post("/login", userController.loginUser);

// secured routes
user_route.post("/logout", verifyJWT, userController.logoutUser);

user_route.get(
  "/channel/:username",
  verifyJWT,
  userController.getUserChannelProfile
);

user_route.get("/total-users", userController.getAllUsers);


user_route.get("/userProfile/:userId", userController.getUserProfile);

export default user_route;


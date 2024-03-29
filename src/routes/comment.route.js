import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import commentController from "../controllers/comment.controller.js";

const comment_route = Router();

// Apply verifyJWT middleware only to routes where authentication is required
comment_route.post(
  '/comments/users/:ownerId/videos/:videoId',
  verifyJWT,
  commentController.createComment
);

comment_route.patch(
  '/comments/:commentId', 
  verifyJWT,
  commentController.updateComment
);

comment_route.delete(
  '/comments/:commentId',
  verifyJWT,
  commentController.deleteComment
);

// Exclude verifyJWT middleware for this route
comment_route.get(
  '/comments/videos/:videoId',
  commentController.getAllCommentsBySingleVideo
);

export default comment_route;

import { isValidObjectId, getUserObjectId } from "../utils/helperFunctions.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/videos.models.js";
import { ApiError } from "../utils/ApiError.js";

const createComment = async (bodyData, paramsData, loggedInUser) => {
  const { content } = bodyData;
  const { ownerId, videoId } = paramsData;

  const validIds = isValidObjectId([videoId, ownerId]);

  if (!validIds[ownerId] || !validIds[videoId]) {
    throw new ApiError(400, "Invalid VideoId or OwnerId Format");
  }

  const ownerObjectId = await getUserObjectId(validIds[ownerId]);

  const existingVideo = await Video.findById(validIds[videoId]).select("_id");
  console.log("existingVideo", existingVideo);

  if (!existingVideo) {
    throw new ApiError(404, "Video not found");
  }

  // Check if the user is logged in or not
  if (loggedInUser.toString() !== ownerObjectId.toString()) {
    throw new ApiError(400, "Only authorized User can comment the Video");
  }

  const newComment = new Comment({
    content: content,
    video: existingVideo._id,
    owner: ownerObjectId,
  });

  const commentToSave = await newComment.save();

  return commentToSave;
};

const updateComment = async (bodyData, paramsData, loggedInUser) => {
  const { commentId } = paramsData;
  const { content } = bodyData;

  const validIds = isValidObjectId([commentId]);

  if (!validIds[commentId]) {
    throw new ApiError(400, "Invalid CommentId Format");
  }

  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  // Find the comment by its ID and owner
  const fetchComment = await Comment.findOne({
    _id: commentId,
    owner: loggedInUser,
  }).select("_id owner");
  console.log("Fetching comment", fetchComment);

  if (!fetchComment) {
    throw new ApiError(404, "Neither Comment nor user is logged in");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    fetchComment._id,
    {
      $set: { content },
    },
    {
      new: true,
    }
  );

  if (!updatedComment) {
    throw new ApiError(400, "Failed to update the comment, try again");
  }

  return updatedComment.content;
};

const deleteComment = async (paramsData, loggedInUser) => {
  // TODO: delete a comment
  const { commentId } = paramsData;

  const validIds = isValidObjectId([commentId]);

  if (!validIds[commentId]) {
    throw new ApiError(400, "Invalid CommentId Format");
  }

  // Find the comment by its ID and owner
  const fetchCommentAndDelete = await Comment.findOneAndDelete({
    _id: commentId,
    owner: loggedInUser,
  }).select("_id owner");
  console.log("Fetching comment", fetchCommentAndDelete);

  if (!fetchCommentAndDelete) {
    throw new ApiError(404, "Neither Comment exists nor User logged in");
  }

  return fetchCommentAndDelete;
};

// const getAllCommentsBySingleVideo = async (paramsData) => {
//   const { videoId } = paramsData;

//   const validIds = isValidObjectId([videoId]);

//   if (!validIds[videoId]) {
//     throw new ApiError(400, "Invalid VideoId Format");
//   }

// //   const videoExists = await Video.findById(validIds[videoId]).select("_id");
// //   console.log("Video exists", videoExists);
// //   if (!videoExists) {
// //     throw new ApiError(404, "Video not found");
// //   }

//   const comments = await Comment.find({ video: validIds[videoId]} );

//   return comments;
// };

export default {
  createComment,
  updateComment,
  deleteComment,
  // getAllCommentsBySingleVideo,
};

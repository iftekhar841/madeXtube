import { isValidObjectId, getUserObjectId } from "../utils/helperFunctions.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/videos.models.js";
import { ApiError } from "../utils/ApiError.js";



// Create API's Methods For Comments
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

// Update API's Methods For Comments
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

  if (!fetchComment) {
    throw new ApiError(404, "Neither Comment Exists Nor User LoggedIn");
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

  return updatedComment;
};

// Delete API's Methods For Comments
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

  if (!fetchCommentAndDelete) {
    throw new ApiError(404, "Neither Comment exists nor User logged in");
  }

  return fetchCommentAndDelete;
};


// Get API's Methods For Comments
const getAllCommentsBySingleVideo = async (paramsData) => {
  const { videoId } = paramsData;

  const validIds = isValidObjectId([videoId]);

  if (!validIds[videoId]) {
    throw new ApiError(400, "Invalid VideoId Format");
  }

  const existingVideo = await Video.findById(videoId).select("_id");

  if (!existingVideo) {
    throw new ApiError(404, "Video doesn't exists");
  }

  const dataToFetch = await Comment.find({ video: validIds[videoId] })
    .populate("owner", "username avatar -_id")
    .select("-video");

  if (!dataToFetch && dataToFetch.length === 0) {
    throw new ApiError(404, "Comments not found");
  }

  return dataToFetch;
};

export default {
  createComment,
  updateComment,
  deleteComment,
  getAllCommentsBySingleVideo,
};

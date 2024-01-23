import { getUserObjectId, isValidObjectId } from "../utils/helperFunctions.js";
import { VideoLikeAndDislike } from "../models/videoLikeAndDislike.model.js";
import { Video } from "../models/videos.models.js";
import { ApiError } from "../utils/ApiError.js";


// Liked API's methods
const createLikeVideo = async (videoId, userId) => {
  // Validate and create ObjectId instances for videoId, userId
  const validIds = isValidObjectId([videoId, userId]);

  if (!validIds[videoId]) {
    throw new ApiError(400, "Invalid ObjectId Format");
  }

  const ownerId = await getUserObjectId(validIds[userId]);

  // Check if the video exists
  const videoExist = await Video.findById({ _id: validIds[videoId] }).select(
    "_id"
  );

  if (!videoExist) {
    throw new ApiError(400, "Video does not exist");
  }

  // Check if there is an existing like/dislike document
  let likeExists = await VideoLikeAndDislike.findOne({
    videoId: videoExist._id,
  });

  if (!likeExists) {
    // If no existing like/dislike document, create a new one
    likeExists = new VideoLikeAndDislike({
      videoId: videoExist._id,
    });
  }

  // Check if the user already liked the video
  if (likeExists.likedBy.includes(ownerId)) {
    throw new ApiError(400, "User already liked");
  }

  // If the user disliked before, remove the dislike
  if (likeExists.dislikedBy.includes(ownerId)) {
    likeExists.dislikedBy.pull(ownerId);
    likeExists.dislikes -= 1;
  }

  // Add the user to likedBy array and increment the like count
  likeExists.likedBy.push(ownerId);
  likeExists.likes += 1;

  // Save the changes to the database
  const newLike = await likeExists.save();

  return newLike;
};

// Disliked API's methods
const createdisLikeVideo = async (videoId, userId) => {
  // Validate and create ObjectId instances for videoId, userId
  const validIds = isValidObjectId([videoId, userId]);

  if (!validIds[videoId]) {
    throw new ApiError(400, "Invalid ObjectId Format");
  }

  const ownerId = await getUserObjectId(validIds[userId]);

  // Check if the video exists
  const videoExist = await Video.findById({ _id: validIds[videoId] }).select(
    "_id"
  );

  if (!videoExist) {
    throw new ApiError(400, "Video does not exist");
  }

  // Check if there is an existing like/dislike document
  let dislikeExists = await VideoLikeAndDislike.findOne({
    videoId: videoExist._id,
  });

  if (!dislikeExists) {
    // If no existing like/dislike document, create a new one
    dislikeExists = new VideoLikeAndDislike({
      videoId: videoExist._id,
    });
  }

  // Check if the user already liked the video
  if (dislikeExists.dislikedBy.includes(ownerId)) {
    throw new ApiError(400, "User already disliked");
  }

  // If the user disliked before, remove the dislike
  if (dislikeExists.likedBy.includes(ownerId)) {
    dislikeExists.likedBy.pull(ownerId);
    dislikeExists.likes -= 1;
  }

  // Add the user to likedBy array and increment the like count
  dislikeExists.dislikedBy.push(ownerId);
  dislikeExists.dislikes += 1;

  // Save the changes to the database
  const newdisLike = await dislikeExists.save();

  return newdisLike;
};

export default {
  createLikeVideo,
  createdisLikeVideo,
};

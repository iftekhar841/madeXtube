import { Video } from "../models/videos.models.js";
import { WatchLater } from "../models/watchLater.model.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId } from "../utils/helperFunctions.js";

//Add video to WatchLater
const addWatchLater = async (loggedInUser, paramsData) => {
  // TODO: add video to Watch Later

  const { videoId } = paramsData;

  const validIds = isValidObjectId([videoId]);

  if (!validIds[videoId]) {
    throw new ApiError(400, "Invalid VideoId Format");
  }

  const videoExists = await Video.findById(validIds[videoId]).select("_id");

  if (!videoExists) {
    throw new ApiError(404, "Video not found");
  }

  const videoInWatchLater = await WatchLater.findOne({
    video: videoExists._id,
    owner: loggedInUser,
  });

  if (videoInWatchLater) {
    throw new ApiError(400, "Video already exists in Watch Later");
  }

  const watchLater = await WatchLater.create({
    video: videoExists._id,
    owner: loggedInUser,
  });

  if (!watchLater) {
    throw new ApiError(
      500,
      "Failed to add a video in WatchLater list, try again"
    );
  }

  return watchLater;
};

//Remove video from WatchLater
const removeWatchLater = async (loggedInUser, paramsData) => {
  // TODO: video remove from watch later
  const { videoId } = paramsData;
  
   // Validate and create ObjectId instance for videoId
  const validIds = isValidObjectId([videoId]);

  if (!validIds[videoId]) {
    throw new ApiError(400, "Invalid VideoId Format");
  }

  // Check if the video exists in Watch Later
  const videoRemoveFromWatchLater = await WatchLater.findOne({
    video: validIds[videoId],
    owner: loggedInUser
  });

  if (!videoRemoveFromWatchLater) {
    throw new ApiError(400, "Video doesn't exist in Watch Later");
  }

  // Validate owner authorization
  if (videoRemoveFromWatchLater?.owner.toString() !== loggedInUser.toString()) {
    throw new ApiError(
      400,
      "Only authorized Owner can remove the video from Watch Later"
    );
  }
  // Remove the video from Watch Later
  await WatchLater.findByIdAndDelete(videoRemoveFromWatchLater._id);
};

//Remove All Watch Later
const removeAllWatchLater = async (loggedInUser, paramsData) => {
  // TODO: All video remove from history
  const { owner } = paramsData;

  const validIds = isValidObjectId([owner]);

  if (!validIds[owner]) {
    throw new ApiError(400, "Invalid owner Format");
  }

  const dataToFetch = await WatchLater.find({ owner: validIds[owner] });
  if (!dataToFetch || dataToFetch.length === 0) {
    throw new ApiError(400, "Video doesn't exist in Watch Later");
  }

   // Validate authorization using for...of loop
   for (const field of dataToFetch) {
    if (field.owner.toString() !== loggedInUser.toString()) {
      throw new ApiError(400, "Only authorized User can remove the Watch Later list");
    }
  }
  const removeAllWatchLater = await WatchLater.deleteMany({
    owner: validIds[owner],
  });

  return removeAllWatchLater;
};

// Get All Watch Later
const getAllWatchLater = async(loggedInUser) => {
    const fetchAllWatchLater = await WatchLater.find({ owner: loggedInUser }).populate("video");

    if(!fetchAllWatchLater || fetchAllWatchLater.length === 0) {
        throw new ApiError(404, "Watch Later Not Found");
    }

    return fetchAllWatchLater;
}
export default {
  addWatchLater,
  removeWatchLater,
  removeAllWatchLater,
  getAllWatchLater
};

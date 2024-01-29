import { isValidObjectId } from "mongoose";
import { History } from "../models/history.model.js";
import { Video } from "../models/videos.models.js";
import { ApiError } from "../utils/ApiError.js";
import { getMongoosePaginationOptions } from "../utils/helperFunctions.js";

//Add History
const addHistory = async (paramsData, loggedInUser) => {
  // TODO: add History

  const { videoId } = paramsData;

  console.log("videoId: ", videoId);

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId).select("_id");

  console.log("video: ", video);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const videoInHistory = await History.findOne({ video: videoId });
  console.log("videoInHistory: ", videoInHistory);

  const historyToCreate = await History.create({
    video: video._id,
    user: loggedInUser,
  });

  if (!historyToCreate) {
    throw new ApiError(400, "Failed to add a video in History, try again");
  }

  return historyToCreate;
};

//Remove Single History
const removedSingleHistory = async (paramsData, loggedInUser) => {
  // TODO: video remove from history
  const { historyId } = paramsData;

  if (!isValidObjectId(historyId)) {
    throw new ApiError(400, "Invalid ObjectId Format");
  }

  const removeHistory = await History.findById(historyId);
  console.log("removeHistory: ", removeHistory);

  if (!removeHistory) {
    throw new ApiError(400, "Video history doesn't exist in History");
  }

  if (removeHistory?.user?.toString() !== loggedInUser.toString()) {
    throw new ApiError(400, "Only authorized Owner can remove the History");
  }

  const removedHistory = await History.findByIdAndDelete(removeHistory._id);

  return removedHistory;
};

//Remove video from Download
const removedAllHistory = async (loggedInUser) => {
  if (!isValidObjectId(loggedInUser)) {
    throw new ApiError(400, "Invalid Owner Id");
  }

  const removedAllHistory = await History.deleteMany({ user: loggedInUser });

  if (removedAllHistory.deletedCount === 0) {
    throw new ApiError(400, "No history records found");
  }

  return removedAllHistory;
};

const getAllHistory = async (loggedInUser, queryParams) => {
  const { page = 1, limit = 12 } = queryParams || {}; // Set default values if queryData is undefined

  if (!isValidObjectId(loggedInUser)) {
    throw new ApiError(400, "Invalid Owner Id");
  }

  // Count total number of history records for pagination
  const totalHistoryCount = await History.countDocuments({
    user: loggedInUser,
  });

  const historyToFetch = await History.find({ user: loggedInUser })
    .populate("video")
    .skip((page - 1) * limit)
    .limit(limit);

  // Count non-null history records
  let countOfHistory = historyToFetch.filter((history) => history._id).length;

  if (!historyToFetch || historyToFetch.length === 0) {
    throw new ApiError(400, "No history records found");
  }

  // Calculate pagination information
  const totalPages = Math.ceil(totalHistoryCount / limit);

  // Return response object with history records and pagination details
  return {
    history: historyToFetch,
    pagination: {
      fetchNoOfDocs: countOfHistory,
      totalRecords: totalHistoryCount,
      totalPages,
      currentPage: page,
      perPage: limit,
    },
  };
};

export default {
  addHistory,
  removedSingleHistory,
  removedAllHistory,
  getAllHistory,
};

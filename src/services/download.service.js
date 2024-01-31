import { Download } from "../models/download.model.js";
import { Video } from "../models/videos.models.js";
import { ApiError } from "../utils/ApiError.js";
import {  isValidObjectId } from "../utils/helperFunctions.js";

// To add download video in the download tab
const addDownloadVideo = async (paramsData, loggedInUser) => {
  const { videoId } = paramsData;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid ObjectId Format");
  }

  const existingVideo = await Video.findById(videoId).select("_id");

  if (!existingVideo) {
    throw new ApiError(400, "Video dees not exists");
  }

  const videoInDownload = await Download.findOne({ video: videoId, owner: loggedInUser });
  console.log("videoInDownload", videoInDownload);

  if (videoInDownload) {
    throw new ApiError(400, "Video already exists in download");
  }

  const videoToDownload = new Download({
    video: existingVideo._id,
    owner: loggedInUser,
  });

  const downloadToSave = await videoToDownload.save();

  if (!downloadToSave) {
    throw new ApiError(
      400,
      "Failed to add a video in Download list, try again"
    );
  }

  return downloadToSave;
};

//Remove video from Download
const deleteDownloadVideo = async (paramsData, loggedInUser) => {
  // TODO: video remove from Download
  const { videoId } = paramsData;

  const validIds = isValidObjectId([videoId]);

  if (!validIds[videoId]) {
    throw new ApiError(400, "Invalid ObjectId Format");
  }

  const videoRemoveFromDownload = await Download.findOne({ video: validIds[videoId] });
  console.log("video remove from Download", videoRemoveFromDownload);

  if (!videoRemoveFromDownload) {
    throw new ApiError(400, "Video doesn't exist in Download list");
  }

  if (videoRemoveFromDownload?.owner.toString() !== loggedInUser.toString()) {
    throw new ApiError(
      400,
      "Only authorized Owner can remove the video from Download list"
    );
  }

  const removedVideo = await Download.findByIdAndDelete(
    videoRemoveFromDownload._id
  );

  return removedVideo;
};

//Remove video from Download
const deleteAllDownloadVideo = async (loggedInUser) => {
  if (!isValidObjectId(loggedInUser)) {
    throw new ApiError(400, "Invalid Owner Id");
  }

  const removedAllDownload = await Download.deleteMany({ owner: loggedInUser });

  if (removedAllDownload.deletedCount === 0) {
    throw new ApiError(400, "No download records found");
  }

  return removedAllDownload;
};

//Remove video from Download
const getAllDownloadVideo = async (loggedInUser, queryParams) => {
  const { page = 1, limit = 12 } = queryParams;

  if (!isValidObjectId(loggedInUser)) {
    throw new ApiError(400, "Invalid Owner Id");
  }

  const totalDownloadCount = await Download.countDocuments({
    owner: loggedInUser,
  });

  const fetchToDownload = await Download.find({ owner: loggedInUser })
    .populate("video")
    .skip((page - 1) * limit)
    .limit(limit);

  const countOfDownload = fetchToDownload.filter(
    (download) => download._id
  ).length;

  if (!fetchToDownload || fetchToDownload.length === 0) {
    throw new ApiError(400, "No download records found");
  }

  const totalPages = Math.ceil(totalDownloadCount / limit);

  return {
    download: fetchToDownload,
    pagination: {
      fetchNoOfDocs: countOfDownload,
      totalRecords: totalDownloadCount,
      totalPages,
      currentPage: page,
      perPage: limit,
    },
  };
};

export default {
  addDownloadVideo,
  deleteDownloadVideo,
  deleteAllDownloadVideo,
  getAllDownloadVideo,
};

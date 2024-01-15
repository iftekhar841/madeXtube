import mongoose from "mongoose";
import { Report } from "../models/report.model.js";
import { VideoReport } from "../models/videoReport.model.js";
import { Video } from "../models/videos.models.js";
import { ApiError } from "../utils/ApiError.js";
import { getUserObjectId, isValidObjectId } from "../utils/helperFunctions.js";

// Create Video Reprt

const CreateVideoReport = async (videoReportDetails) => {
  const { userId, videoId, reportId } = videoReportDetails;

  if (!userId || !videoId || !reportId) {
    throw new ApiError(400, "All fields are required");
  }

 //Validate and create ObjectId instances for userId, videoId, and reportId
  const validIds = isValidObjectId([userId, videoId, reportId]);

  // Check if any of the ObjectId instances is invalid   
  if(!validIds[userId] || !validIds[videoId] || !validIds[reportId]) {
    throw new ApiError(400, "Invalid ObjectId Format");
  }

  const ownerId = await getUserObjectId(validIds[userId]); // Fetch the user object id

  const video = await Video.findById({ _id: validIds[videoId] }).select(
    "_id"
  );

  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  const report = await Report.findById({
    _id: validIds[reportId],
  }).select("_id reportName");

  if (!report) {
    throw new ApiError(404, "Report does not exist");
  }

  const dataToCreate = await VideoReport.create({
    ownerId: ownerId,
    videoId: video._id,
    reportId: report._id,
    reportContent: report.reportName,
  });

  const dataToFetch = await VideoReport.findById(dataToCreate._id).select(
    "_id reportContent"
  );

  if (!dataToFetch) {
    throw new ApiError(
      500,
      "Something went wrong while fetching the video report"
    );
  }

  return dataToFetch;
};         

export default {
  CreateVideoReport,
};

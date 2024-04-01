import { Channel } from "../models/channel.model.js";
import { Report } from "../models/report.model.js";
import { VideoReport } from "../models/videoReport.model.js";
import { Video } from "../models/videos.models.js";
import { ApiError } from "../utils/ApiError.js";
import { getUserObjectId, isValidObjectId } from "../utils/helperFunctions.js";

// Create Video Reprt

const CreateReportOnVideo = async (loggedInUser, bodyData) => {
  const { videoId, reportId, reportContent } = bodyData;

  if (!videoId || !reportId) {
    throw new ApiError(400, "All fields are required");
  }

  //Validate and create ObjectId instances for videoId, and reportId
  const validIds = isValidObjectId([videoId, reportId]);

  // Check if any of the ObjectId instances is invalid
  if (!validIds[videoId] || !validIds[reportId]) {
    throw new ApiError(400, "Invalid VideoId or ReportId Format");
  }

  // Fetch the user object id
  const userObjectId = await getUserObjectId(loggedInUser);

  // Fetch video details
  const video = await Video.findById(videoId).select("_id channel");
  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  // Fetch channel details
  const channel = await Channel.findById(video.channel).select("_id owner");
  if (!channel) {
    throw new ApiError(404, "Channel does not exist");
  }

  // Check if the user is the owner of the channel
  if (channel.owner.toString() === userObjectId.toString()) {
    throw new ApiError(400, "You cannot report your own videos");
  }

  // Fetch report details
  const report = await Report.findById(reportId).select("_id reportName");
  if (!report) {
    throw new ApiError(404, "Report does not exist");
  }

  // Create video report
  const dataToCreate = await VideoReport.create({
    ownerId: userObjectId,
    videoId: video._id,
    reportId: report._id,
    reportContent,
  });

  // Fetch created report details
  const fethedReport = await VideoReport.findById(dataToCreate._id).select(
    "_id reportContent"
  );

  if (!fethedReport) {
    throw new ApiError(
      500,
      "Something went wrong while fetching the video report"
    );
  }

  return fethedReport;
};

export default {
  CreateReportOnVideo,
};

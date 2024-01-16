import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/videos.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  getUserObjectId,
  getCategoryObjectId,
  getMongoosePaginationOptions,
  formatDuration,
} from "../utils/helperFunctions.js";

//Created videos
const createVideos = async (
  videoDetails,
  videoFileLocalPath,
  thumbnailLocalPath
) => {
  const { title, description, views, userId, categoryId } = videoDetails;

  if (!(userId && categoryId)) {
    throw new ApiError(
      404,
      "UserId and categoryId are required and cannot be empty"
    );
  }

  const ownerId = await getUserObjectId(userId);
  const videoCategoryId = await getCategoryObjectId(categoryId);

  if (!videoFileLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "video file is required");
  }

  const video = await uploadOnCloudinary(videoFileLocalPath);
  const formattedDuration = formatDuration(video.duration); // Convert duration seconds into this format HH:MM:SS.

  const thumbnailImage = await uploadOnCloudinary(thumbnailLocalPath);

  if (!video || !thumbnailImage) {
    throw new ApiError(400, "video file and thumbnail are required");
  }

  const videoData = await Video.create({
    title,
    videoFile: video?.url || "",
    thumbnail: thumbnailImage?.url || "",
    description,
    duration: formattedDuration,
    views,
    owner: ownerId,
    videoCategory: videoCategoryId,
  });

  const dataToFetch = await Video.findById(videoData._id);

  if (!dataToFetch) {
    throw new ApiError(500, "Something went wrong while fetching the video");
  }
  return dataToFetch;
};

const getAllVideos = async (queryData) => {

  const { page = 1, limit = 10 } = queryData;

  // const paginationOptions = getMongoosePaginationOptions({
  //   page,
  //   limit,
  //   customLabels: {
  //     totalDocs: "totalVideos",
  //     docs: "videos",
  //   },
  // });

  const videoAggregate = await Video.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner"
        }
      },
      {
        $unwind: "$owner"
      },
      {
        $project: {
          videoFile: 1,
          thumbnail: 1,
          title: 1,
          description: 1,
          duration: 1,
          views: 1,
          isPublished: 1,
          videoCategory: 1,
          createdAt: 1,
          owner: {
            _id: 1,
            avatar: 1
          },
          
        }
      },
      // {
      //   $facet: {
      //     metadata: [
      //       { $count: "totalVideos" },
      //       { $addFields: { serialNumberStartFrom: paginationOptions.page * paginationOptions.limit - paginationOptions.limit + 1 } },
      //     ],
      //     videos: [
      //       { $skip: (paginationOptions.page - 1) * paginationOptions.limit },
      //       { $limit: paginationOptions.limit },
      //     ],
      //   },
      // },
      {
        $facet: {
          metadata : [{ $count: "totalVideos"}],
          videos: [
            { $skip: (page -1) * limit },
            { $limit: limit }
          ]
        }
      }
  ])

  console.log("videoAggregate", videoAggregate);

  if (!videoAggregate || videoAggregate.length === 0) {
    throw new ApiError(404, "No video found");
  }

  return videoAggregate;
};

const getSingleVideoById = async (videoId) => {
  const videos = await Video.findById(videoId);

  if (!videos) {
    console.log("inside if block");
    throw new ApiError(404, "Videos does not exist");
  }

  return videos;
};

export default {
  createVideos,
  getAllVideos,
  getSingleVideoById,
};

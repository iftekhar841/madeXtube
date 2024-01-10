import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/videos.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { 
    getUserObjectId, 
    getCategoryObjectId, getMongoosePaginationOptions, formatDuration } 
from "../utils/helperFunctions.js";


//Created videos
const createVideos = async (
    videoDetails,
    videoFileLocalPath,
    thumbnailLocalPath
) => {

    const { title, description, views, userId, categoryId } = videoDetails;

    if (!(userId && categoryId)) {
        throw new ApiError(404, "UserId and categoryId are required and cannot be empty");
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
        videoCategory: videoCategoryId
    });

    const dataToFetch = await Video.findById(videoData._id);

    if (!dataToFetch) {
        throw new ApiError(500, "Something went wrong while fetching the video");
    }
    return dataToFetch;
};

const getAllVideos = async (queryData) => {
    const videoPopulate = await Video.find().populate('owner', '_id').populate('videoCategory', '_id');

    const { page = 1, limit = 10 } = queryData;

    const videos = await Video.aggregatePaginate(
        videoPopulate,
        getMongoosePaginationOptions({
            page,
            limit,
            customLabels: {
                totalDocs: "totalVideos",
                docs: "videos"
            },
        })
    )

    if (!videos || videos.length === 0) {
        throw new ApiError(404, "No videos found");
    }

    return videos;
}

const getSingleVideoById = async (paramsData) => {
    const { videoId } = paramsData;

    const videos = await Video.findById(videoId);
    console.log("Found video", videos);

    if (!videos) {
        console.log("inside if block");
        throw new ApiError(404, "Videos does not exist");
      }

    return videos;
}


export default {
    createVideos,
    getAllVideos,
    getSingleVideoById
}
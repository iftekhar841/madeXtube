import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/videos.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


//Created videos
const createVideos = async (
    videoDetails,
    videoFileLocalPath,
    thumbnailLocalPath
) => {

    const { title, description, duration, views } = videoDetails;

    if (!videoFileLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "video file is required");
    }

    const video = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnailImage = await uploadOnCloudinary(thumbnailLocalPath);

    if (!video || !thumbnailImage) {
        throw new ApiError(400, "video file and thumbnail are required");
    }

    const videoData = await Video.create({
        title,
        videoFile: video?.url || "", 
        thumbnail: thumbnailImage?.url || "",
        description,
        duration,
        views,
    });

    const dataToFetch = await Video.findById(videoData._id);

    if (!dataToFetch) {
        throw new ApiError(500, "Something went wrong while fetching the video");
    }

    return dataToFetch;
};


export default {
    createVideos,
}
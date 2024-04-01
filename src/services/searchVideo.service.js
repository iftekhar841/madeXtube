import { Video } from "../models/videos.models.js";
import { ApiError } from "../utils/ApiError.js";


const searchVideo = async (bodyData) => {
  const { searchTerm } = bodyData;
  if (typeof searchTerm !== 'string') {
    throw new ApiError("Search term must be a string.");
  }

  const searchQuery = {
    title: { $regex: searchTerm, $options: "i" }
  };

  const searchVideoAggregate = await Video.aggregate([
    {
        $match: searchQuery,
    },
    {
      $lookup: {
        from: "channels",
        localField: "channel",
        foreignField: "_id",
        as: "channelData",
      },
    },
    {
      $unwind: "$channelData",
    },
    {
      $lookup: {
        from: "users",
        let: { ownerId: "$channelData.owner" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$ownerId"] },
            },
          },
          {
            $project: {
              _id: 1,
              avatar: 1,
              username: 1,
            },
          },
        ],
        as: "ownerData",
      },
    },
    {
      $unwind: "$ownerData",
    },
    {
      $project: {
        _id: 1,
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        videoCategory: 1,
        createdAt: 1,
        "channelData._id": 1,
        "channelData.channelName": 1,
        "channelData.owner": "$ownerData",
      },
    },
  ]);

  if (!searchVideoAggregate.length) {
    throw new ApiError(400, "No Video Found");
  }

  return searchVideoAggregate;
};

export default {
  searchVideo,
};

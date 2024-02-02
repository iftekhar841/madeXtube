import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/videos.models.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId } from "../utils/helperFunctions.js";


//Create playlist
const createPlayList = async (bodyData, paramsData, loggedInUser) => {
  const { videoId } = paramsData;
  const { name, description } = bodyData;

  // Validate name and description
  if (!name || !description) {
    throw new ApiError(400, "Name or Description are required");
  }

  // Validate and create ObjectId instance for videoId
  const validIds = isValidObjectId([videoId]);
  if (!validIds[videoId]) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const existingVideo = await Video.findById(validIds[videoId]).select("_id");

  if (!existingVideo) {
    throw new ApiError(404, "video not found");
  }

  // Create playlist
  const playlistData = {
    name,
    description,
    videos: [existingVideo._id], // Assuming 'videos' is an array
    owner: loggedInUser,
  };

  const playlistToCreate = await Playlist.create(playlistData);

  if (!playlistToCreate) {
    throw new ApiError(500, "Failed to create playlist, please try again");
  }

  return playlistToCreate;
};


// Add video into existing playlist
const addVideoToPlayList = async (bodyData, paramsData, loggedInUser) => {
  const { playListId } = paramsData;

  const { videoId } = bodyData;

  if (!videoId) {
    throw new ApiError(400, "Video Field is required");
  }

  const validIds = isValidObjectId([playListId, videoId]);

  if (!validIds[playListId] || !validIds[videoId]) {
    throw new ApiError(400, "Invalid ObjectId Format");
  }

  const existingPlaylist = await Playlist.findOne({
    _id: validIds[playListId],
    owner: loggedInUser,
  });

  if (!existingPlaylist) {
    throw new ApiError(400, "Playlist not found or not owned by the user");
  }

  const existingVideo = await Video.findById(validIds[videoId], "_id");

  if (!existingVideo) {
    throw new ApiError(404, "Video not found ");
  }

  // Check if the video is already in the playlist
  if (existingPlaylist.videos.includes(existingVideo._id)) {
    throw new ApiError(400, "Video already exists in the playlist");
  }

  // Add the new video ID to the playlist's videos array
  existingPlaylist.videos.push(existingVideo._id);

  // Save the updated playlist
  await existingPlaylist.save();

  return existingPlaylist;
};


//Update playlist
const updatePlayList = async (bodyData, paramsData, loggedInUser) => {
  const { name, description } = bodyData;
  const { playListId } = paramsData;

  if (!name || !description) {
    throw new ApiError(400, "Name or Description are required");
  }

  // Validate and create ObjectId instance for playListId
  const validIds = isValidObjectId([playListId]);
  if (!validIds[playListId]) {
    throw new ApiError(400, "Invalid PlayListId");
  }

  // Check if the playlist exists and is owned by the logged-in user
  const existingPlaylist = await Playlist.findOne({
    _id: validIds[playListId],
    owner: loggedInUser,
  });

  if (!existingPlaylist) {
    throw new ApiError(400, "Playlist not found or not owned by the user");
  }

  // Update the playlist
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    existingPlaylist?._id,
    {
      $set: {
        name,
        description,
      },
    },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(500, "Failed to update the playlist, try again");
  }

  return updatedPlaylist;
};


// //Delete playlist
const deleteSinglePlayList = async (paramsData, loggedInUser) => {
  const { playListId } = paramsData;

  // Validate and create ObjectId instance for playListId
  const validIds = isValidObjectId([playListId]);
  if (!validIds[playListId]) {
    throw new ApiError(400, "Invalid PlayListId");
  }

  // Check if the playlist exists and is owned by the logged-in user
  const existingPlaylist = await Playlist.findOne({
    _id: validIds[playListId],
    owner: loggedInUser,
  });

  if (!existingPlaylist) {
    throw new ApiError(404, "Playlist not found or not owned by the user");
  }

  // Delete the playlist
  await Playlist.findByIdAndDelete(existingPlaylist?._id);

  return existingPlaylist;
};


//Get user playlists
const getUserPlayLists = async (paramsData) => {
  //Todo: get user playlists
  const { userId } = paramsData;

  const validIds = isValidObjectId([userId]);

  if (!validIds[userId]) {
    throw new ApiError(400, "Invalid userId");
  }

  const playListsAggregate = await Playlist.aggregate([
    {
      $match: {
        owner: validIds[userId],
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
      },
    },
  ]);

  return playListsAggregate;
};


//Remove video from playlist
const removeSingleVideoFromPlayList = async (paramsData, loggedInUser) => {
  //Todo: remove video from playlist
  const { playListId, videoId } = paramsData;

  const validIds = isValidObjectId([playListId, videoId]);

  if (!validIds[playListId] || !validIds[videoId]) {
    throw new ApiError(400, "Invalid playListId or videoId");
  }

  // Check if the playlist exists and is owned by the logged-in user
  const existingPlaylist = await Playlist.findOne({
    _id: validIds[playListId],
    owner: loggedInUser,
  });

  if (!existingPlaylist) {
    throw new ApiError(404, "Playlist not found or not owned by the user");
  }

  if (!existingPlaylist.videos.includes(validIds[videoId])) {
    throw new ApiError(400, "Video does not exists in the playlist");
  }

  // Remove video ID to the playlist's videos array
  existingPlaylist.videos.pull(validIds[videoId]);

  // Save the updated playlist
  await existingPlaylist.save();

  return existingPlaylist;
};


export default {
  createPlayList,
  addVideoToPlayList,
  updatePlayList,
  deleteSinglePlayList,
  getUserPlayLists,
  removeSingleVideoFromPlayList,
};

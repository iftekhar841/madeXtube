import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/videos.models.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId } from "../utils/helperFunctions.js";



//Create playlist
const createPlayList =  async (bodyData, paramsData, loggedInUser) => {
  const { videoId } = paramsData;  
  const { name, description } = bodyData;

  // Validate name and description
  if (!name || !description) {
    throw new ApiError(400, "Name or Description are required");
  }

  // Validate and create ObjectId instance for videoId
  const validIds = isValidObjectId([videoId]);
  if(!validIds[videoId]) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const existingVideo = await Video.findById(validIds[videoId]).select('_id');
  console.log("existingVideo", existingVideo);

  if(!existingVideo) {
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
  console.log("dataToFetch: ", existingPlaylist);

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
const deletePlayList = async (paramsData, loggedInUser) => {
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
  
    console.log("existingPlaylist", existingPlaylist);
  
    if (!existingPlaylist) {
      throw new ApiError(404, "Playlist not found or not owned by the user");
    }
  
    // Delete the playlist
    await Playlist.findByIdAndDelete(existingPlaylist?._id);
  
    return;
  };
  


export default {
  createPlayList,
  updatePlayList,
  deletePlayList,
};
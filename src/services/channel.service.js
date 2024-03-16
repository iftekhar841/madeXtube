import { Channel } from "../models/channel.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/videos.models.js";
import { ApiError } from "../utils/ApiError.js";
import { getUserObjectId, isValidObjectId } from "../utils/helperFunctions.js";

/**
 * Creates a new channel with the provided details.
 *
 * @param {object} channelDetails - Details for creating a new channel.
 * @param {string} channelDetails.channelName - The name of the channel.
 * @param {string} channelDetails.description - The description of the channel.
 * @param {string} channelDetails.userId - The unique identifier of the user creating the channel.
 * @returns {Promise<object>} - A Promise that resolves to the created channel details.
 * @throws {ApiError} - Throws an ApiError if validation fails, the channel already exists, or if there's an error during the process.
 */

const createChannel = async (channelDetails) => {
  const { channelName, description, userId } = channelDetails;

  // if(!channelName || !description ||  !userId) {
  //     throw new ApiError(400,  "Fields cannot be empty");
  // }

  if ([channelName, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingChannel = await Channel.findOne({
    channelName: { $regex: new RegExp(`^${channelName}$`, "i") },
  });

  if (existingChannel) {
    throw new ApiError(409, `This Channel ${channelName} already exists`);
  }

  // Validate the user and return the user id through this method getUserObjectId
  const ownerId = await getUserObjectId(userId);

  // Check if the user has already created a channel
  const userChannels = await Channel.find({ owner: ownerId });

  if (userChannels.length === 0) {
    const dataToCreate = await Channel.create({
      channelName,
      description,
      owner: ownerId,
    });
    const dataToFetch = await Channel.findById(dataToCreate._id);

    if (!dataToFetch) {
      throw new ApiError(
        500,
        "Something went wrong while fetching the channel"
      );
    }
    return dataToFetch;
  } else {
    throw new ApiError(400, "You have already created a channel");
  }
};

const getChannelInfoByUserId = async (paramsData) => {
  const { userId } = paramsData;

  const validIds = isValidObjectId([userId]);

  // Check if any of the ObjectId instances is invalid
  if (!validIds[userId]) {
    throw new ApiError(400, "Invalid ObjectId Format");
  }

  const ownerId = await getUserObjectId(validIds[userId]);
  console.log("ownerId: ", ownerId);

  const channelInfo = await Channel.findOne({ owner: ownerId });
  console.log("channelInfo", channelInfo);

  if (!channelInfo) {
    throw new ApiError(400, "There is no channel exists with this users");
  }

  return channelInfo;
};

const deleteChannel = async (paramsData, loggedInUser) => {
  console.log("loggedInUser", loggedInUser);
  const { channelId } = paramsData;

  const validIds = isValidObjectId([channelId]);

  if (!validIds[channelId]) {
    throw new ApiError(400, "Invalid ChannelId Format");
  }

  const existingChannel = await Channel.findOne({
    _id: channelId,
    owner: loggedInUser,
  });
  console.log("existingChannel", existingChannel);

  if (!existingChannel) {
    throw new ApiError(400, "Neither Channel exists Nor User authorized");
  }

  // Delete all videos associated with the channel
  const videos = await Video.deleteMany({ channel: existingChannel._id });
  console.log("vidoes", videos);
  // Delete all subscriptions to the channel
  const subscribers = await Subscription.deleteMany({
    channel: existingChannel.owner,
  });
  console.log("subscribers", subscribers);

  // Delete the channel itself
  const removedChannel = await existingChannel.deleteOne();

  if (removedChannel.acknowledged && removedChannel.deletedCount === 1) {
    if (videos.deletedCount > 0 || subscribers.deletedCount > 0) {
      return "All content related to your channel has been erased successfully";
    } else {
      return "The channel has been deleted successfully";
    }
  } else {
    throw new ApiError(400, "Something went wrong while deleting the channel");
  }
};

export default {
  createChannel,
  getChannelInfoByUserId,
  deleteChannel,
};

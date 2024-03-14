import { Subscription } from "../models/subscription.model.js";
import { Channel } from "../models/channel.model.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId, getUserObjectId } from "../utils/helperFunctions.js";
import { Video } from "../models/videos.models.js";

// Create Subscribe methods
const createSubscription = async (loggedInUser, paramsData) => {
  const { userId, channelId } = paramsData;

  const validIds = isValidObjectId([loggedInUser]);

  if (!validIds[loggedInUser]) {
    throw new ApiError(404, "Invalid ObjectId Format");
  }

  const userExistsId = await getUserObjectId(userId);

  if (userExistsId.toString() !== validIds[loggedInUser].toString()) {
    throw new ApiError(400, "Only authorized Owner can subscribed the channel");
  }

  const channel = await Channel.findById(channelId);
  if (!channel) {
    throw new ApiError(400, "Channel does not exist");
  }

  // Check if loggedInUser is trying to subscribe to their own channel
  if (channel.owner.toString() === userExistsId.toString()) {
    throw new ApiError(400, "Cannot subscribe to your own channel");
  }

  // To Check if user already subscribed
  const checkIsSubcribe = await Subscription.findOne({
    subscriber: userExistsId,
    channel: channel.owner,
  });

  if (checkIsSubcribe) {
    throw new ApiError(400, "You have already subscribed to this channel");
  }

  const dataToCreate = new Subscription({
    subscriber: userExistsId,
    channel: channel.owner, // Store the creator's ObjectId in the channel field
  });

  const dataToSave = await dataToCreate.save();
  return dataToSave;
};

const unsubcribeSubscription = async (loggedInUser, paramsData) => {
  const { userId, channelId } = paramsData;

  const validIds = isValidObjectId([userId, channelId]);

  if (!validIds[userId] || !validIds[channelId]) {
    throw new ApiError(404, "Invalid ObjectId Format or Missing Fields");
  }

  const userExistsId = await getUserObjectId(userId);

  const fetchChannel = await Channel.findById(validIds[channelId]);
  console.log("fetchChannel: ", fetchChannel);

  if (!fetchChannel) {
    throw new ApiError(400, "Channel does not exist");
  }

  // Check if loggedInUser is trying to unsubscribe from their own channel
  if (fetchChannel.owner.toString() === userExistsId.toString()) {
    throw new ApiError(400, "Cannot unsubscribe to your own channel");
  }

  const subscription = await Subscription.findOne({
    subscriber: validIds[userId],
    channel: fetchChannel.owner,
  });

  // console.log("subscribeExits--------->", subscriberExits);

  if (
    !subscription ||
    subscription?.subscriber.toString() !== loggedInUser.toString()
  ) {
    throw new ApiError(
      400,
      "Only authorized Owner can unsubscribed from this channel"
    );
  }

  // Delete the subscription
  const dataToUnsubscribed = await Subscription.findByIdAndDelete(
    subscription._id
  );
  if (!dataToUnsubscribed) {
    throw new ApiError(400, "Error unsubscribing from the channel");
  }

  return dataToUnsubscribed;
};

const getUserSubscribedVideos = async (loggedInUser) => {
  // Validate loggedInUserId
  const validIds = isValidObjectId([loggedInUser]);
  if (!validIds[loggedInUser]) {
    throw new ApiError(400, "Invalid loggedInUser Format");
  }

  // Find the user's subscribed channels
  const userSubscribedChannels = await Subscription.find({
    subscriber: loggedInUser,
  }).distinct('channel');

  console.log("userSubscribedChannels", userSubscribedChannels);

  if (!userSubscribedChannels.length) {
    throw new ApiError(404, "User is not subscribed to any channels");
  }
  // Find the channelIds of the subscribed channels
  // const subscribedChannels = await Channel.find({
  //   owner: { $in: userSubscribedChannels },
  // }).populate('owner', 'avatar username -_id');
  const subscribedChannels = await Channel.find({
    owner: { $in: userSubscribedChannels },
  }).populate('owner', 'avatar username -_id');

  console.log("Subscribed channels", subscribedChannels);

  if (!subscribedChannels.length) {
    throw new ApiError(400, "No Channel Found from subscribed channels");
  }

return subscribedChannels;

  // // Find videos uploaded by subscribed channels
  // const subscribedVideos = await Video.find({
  //   channel: { $in: subscribedChannels },
  // });

  // // console.log("subscribed videos", subscribedVideos);
  // if (!subscribedVideos.length) {
  //   throw new ApiError(400, "No Video Found from subscribed channels");
  // }

  // return subscribedVideos;
};

const checkIsSubcribe = async (paramsData) => {
  const { userId, channelId } = paramsData;

  const validIds = isValidObjectId([userId, channelId]);

  if (!validIds[userId] || !validIds[channelId]) {
    throw new ApiError(400, "Invalid userId or ChannelId format");
  }

  const userExistsId = await getUserObjectId(validIds[userId]);

  const fetchSubcribed = await Subscription.findOne({
    subscriber: userExistsId,
    channel: validIds[channelId].owner,
  });
  console.log("fetchSubcribed", fetchSubcribed);

  if (!fetchSubcribed) {
    return {
      isSubscribed: false,
      message: "You haven't subcribed Yet!, Sign in then subcribe",
    };
  } else {
    return {
      isSubscribed: true,
      message: "You have already subscribed",
    };
  }
};

export default {
  createSubscription,
  unsubcribeSubscription,
  getUserSubscribedVideos,
  checkIsSubcribe,
};

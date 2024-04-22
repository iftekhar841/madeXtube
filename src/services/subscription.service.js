import { Subscription } from "../models/subscription.model.js";
import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId, getUserObjectId, queueAddServiceHelper } from "../utils/helperFunctions.js";
// import notificationQueue from '../notifications/notificationQueue.js';

// import processRequest from "../processors/notificationSubscriptionQueueProcessor.js";


// Create Subscribe methods
const createSubscription = async (loggedInUser, bodyData) => {
  console.log("loggedInUser", loggedInUser);
  const { userId, channelId } = bodyData;

  if (!isValidObjectId([loggedInUser._id])) {
    throw new ApiError(404, "Invalid ObjectId Format for loggedInUser");
  }

  // Check if user exists
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Check if the loggedInUser is authorized to subscribe
  if (userExists._id.toString() !== loggedInUser._id.toString()) {
    throw new ApiError(400, "Only authorized Owner can subscribed the channel");
  }

   // Check if the channel exists
  const channel = await Channel.findById(channelId);
  console.log("channel", channel);
  if (!channel) {
    throw new ApiError(400, "Channel does not exist");
  }

  // Check if loggedInUser is trying to subscribe to their own channel
  if (channel.owner.toString() === userExists.toString()) {
    throw new ApiError(400, "Cannot subscribe to your own channel");
  }

  // Check if the user is already subscribed to the channel
  const existingSubscription = await Subscription.findOne({
    subscriber: userExists._id,
    channel: channel.owner,
  });
  if (existingSubscription) {
    throw new ApiError(400, "You have already subscribed to this channel");
  }

  // Create a new subscription entry
  const newSubscription = new Subscription({
    subscriber: userExists._id,
    channel: channel.owner, // Store the creator's ObjectId in the channel field
  });
  console.log("newSubscription", newSubscription);
   await newSubscription.save(); 
  
  // Enqueue a job to send notification to the channel owner
 await queueAddServiceHelper('subscriptionQueue', {
    userId: loggedInUser._id,
    channelId: channel.owner,
    message: `User ${loggedInUser.username} has subscribed to your channel`,
  })

  // await queueServiceHelper.add('subscriptionQueue',{
  //   userId: loggedInUser._id,
  //   channelId: channel.owner,
  //   message: `User ${loggedInUser.username} has subscribed to your channel`,
  // });
  return newSubscription;
}


const unsubcribeSubscription = async (loggedInUser, paramsData) => {
  const { userId, channelId } = paramsData;

  const validIds = isValidObjectId([userId, channelId]);

  if (!validIds[userId] || !validIds[channelId]) {
    throw new ApiError(404, "Invalid ObjectId Format or Missing Fields");
  }

  const userExists = await getUserObjectId(userId);

  const fetchChannel = await Channel.findById(validIds[channelId]);
  console.log("fetchChannel: ", fetchChannel);

  if (!fetchChannel) {
    throw new ApiError(400, "Channel does not exist");
  }

  // Check if loggedInUser is trying to unsubscribe from their own channel
  if (fetchChannel.owner.toString() === userExists.toString()) {
    throw new ApiError(400, "Cannot unsubscribe to your own channel");
  }

  const subscription = await Subscription.findOne({
    subscriber: validIds[userId],
    channel: fetchChannel.owner,
  });

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

                                                                                                                                                                                                                                                                                          
const getSubscriberCount = async (paramsData) => {
    const { channelId } = paramsData;

    // Input validation
    const isValidChannelId = isValidObjectId([channelId]);

    if (!isValidChannelId[channelId]) {
      throw new ApiError(400, "Invalid channelId Format");
    }

    // Fetch the channel
    const existingChannel = await Channel.findById(
      isValidChannelId[channelId]
    ).select('owner');
    
    if (!existingChannel) {
      throw new ApiError(400, "Channel does not exist");
    }

    // Find the user's subscribed channels
    const channelSubscriberCount = await Subscription.countDocuments({
      channel: existingChannel.owner,
    });

    return {
      subscriberCount: channelSubscriberCount,
    };
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

  const userExists = await getUserObjectId(validIds[userId]);

  const fetchSubcribed = await Subscription.findOne({
    subscriber: userExists,
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
  getSubscriberCount,
  getUserSubscribedVideos,
  checkIsSubcribe,
};

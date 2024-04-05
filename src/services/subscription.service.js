import { Subscription } from "../models/subscription.model.js";
import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId, getUserObjectId } from "../utils/helperFunctions.js";


/************** Send Notification Methods ******************/

// Import your push notification 
import webpush from "web-push";

const publicVapidKey = 'BE3PB0SdEJKGtz_PsZWJgkgrSjZGgvlEpQfLDcfNP--Yetf3YBE6jvb2iJk6SjP47_lWu5Km6Tfg1GrGrLpOrCE';
const privateVapidKey = '5GUDzlT37iMh_z7ni048tc3z2PhDOpkcxpaj-v0yeic';
webpush.setVapidDetails('mailto:sameerhacker34@gmail.com', publicVapidKey, privateVapidKey)



// Define your sendPushNotification method
const sendPushNotification = async (subscription, payload) => {
  try {
    console.log("subscription", subscription);

    // Send the push notification
    const result = await webpush.sendNotification(subscription, JSON.stringify(payload));
    console.log("result", result);
    // Handle the result if necessary
    console.log('Push notification sent successfully:', result);
  } catch (error) {
    // Handle any errors that occur during notification sending
    console.error('Error sending push notification:', error.message);
  }
};

// Create Subscribe methods
const createSubscription = async (loggedInUser, bodyData) => {
  const { userId, channelId, pushSubscription } = bodyData;
  console.log("loged", loggedInUser);
  console.log("userId", userId);
console.log("pushSubscription", pushSubscription);
  const validIds = isValidObjectId([loggedInUser]);

  if (!validIds[loggedInUser]) {
    throw new ApiError(404, "Invalid ObjectId Format");
  }

  const userExists = await User.findById(userId);
  // console.log("userExists", userExists);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  if (userExists._id.toString() !== validIds[loggedInUser].toString()) {
    throw new ApiError(400, "Only authorized Owner can subscribed the channel");
  }

  const channel = await Channel.findById(channelId);
  console.log("channel", channel);
  if (!channel) {
    throw new ApiError(400, "Channel does not exist");
  }

  // Check if loggedInUser is trying to subscribe to their own channel
  if (channel.owner.toString() === userExists.toString()) {
    throw new ApiError(400, "Cannot subscribe to your own channel");
  }

  // To Check if user already subscribed
  const checkIsSubcribe = await Subscription.findOne({
    subscriber: userExists,
    channel: channel.owner,
  });

  if (checkIsSubcribe) {
    throw new ApiError(400, "You have already subscribed to this channel");
  }

  // Save the push subscription to the user document
  const channelOwner = await User.findOne({_id: channel.owner });
  console.log("channelOwner", channelOwner);

  channelOwner.pushSubscription = pushSubscription;
   await channelOwner.save();

   console.log("Saving subscription to channel owner", channelOwner);

// Check if the pushSubscription property is assigned to channelOwner
console.log("Saved push subscription:", channelOwner.pushSubscription);


  const newSubscription = new Subscription({
    subscriber: userExists,
    channel: channel.owner, // Store the creator's ObjectId in the channel field
  });
  
   await newSubscription.save(); 

  // // Send push notification to the channel owner when user is subscribed to the channel

  if (!channelOwner || !channelOwner.pushSubscription || !channelOwner.pushSubscription.endpoint) {
    console.error('Channel owner does not have a valid push subscription.');
    return newSubscription;
  }
   // Send push notification to the channel owner using other means
   const notificationMessage = `${userExists.username} has subscribed to your channel.`;
   sendPushNotification(channelOwner.pushSubscription, notificationMessage); // Call your push notification service with an alternative identifier (e.g., email)
  
   return newSubscription;
};


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

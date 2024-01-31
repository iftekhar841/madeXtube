import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.models.js";
import { Channel } from "../models/channel.model.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId, getUserObjectId } from "../utils/helperFunctions.js";


const createSubscription = async (loggedInUser, paramsData) => {
    const { userId, channelId } = paramsData;

    const validIds = isValidObjectId([loggedInUser]);

    if(!validIds[loggedInUser]) {
        throw new ApiError(404, "Invalid ObjectId Format");
    }

    const userExistsId = await getUserObjectId(userId);

    if(userExistsId.toString() !== validIds[loggedInUser].toString()) {
        throw new ApiError( 400,
            "Only authorized Owner can subscribed the channel")
    }

    const channel = await Channel.findById({ _id : channelId });
    console.log("channel", channel);

    if(!channel) {
        throw new ApiError(400, "Channel does not exist")
    }
    
    // To Check if user already subscribed
    const checkIsSubcribe = await Subscription.findOne({ subscriber: userExistsId, channel: channel._id });
    console.log("checkIsSubcribe", checkIsSubcribe);
    if(checkIsSubcribe) {
        throw new ApiError( 400, "You have already subscribed to this channel")
    }

    const dataToCreate = new Subscription({
        subscriber: userExistsId,
        channel: channel._id
    })

    const dataToSave = await dataToCreate.save();
    return dataToSave;

}


const unsubcribeChannel = async(loggedInUser, paramsData, bodyData) => {
    const { userId } = paramsData;

    const { subcriberId } = bodyData;

    // if(!subcriberId) {
    //     throw new ApiError( 400, "All field are required" );
    // }

    const validIds = isValidObjectId([loggedInUser, subcriberId]);

    if(!validIds[loggedInUser] || !validIds[subcriberId]) {
        throw new ApiError(404, "Invalid ObjectId Format or Missing Fields");
    }

    const subscriberExits = await Subscription.findOne({ subscriber: userId, _id: validIds[subcriberId] });

    console.log("subscribeExits", subscriberExits);

    if(subscriberExits?.subscriber.toString() !== validIds[loggedInUser].toString()) {
        throw new ApiError( 400,
            "Only authorized Owner can unsubscribed the channel")
    }

    const dataToUnsubscribed = await Subscription.findByIdAndDelete(subscriberExits._id);
    console.log("dataToUnsubscribed", dataToUnsubscribed);
    if(!dataToUnsubscribed) {
        throw new ApiError(400, "Subscriber does not exist");
    }

    return dataToUnsubscribed;
}

export default {
    createSubscription,
    unsubcribeChannel
}
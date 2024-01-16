import { Channel } from "../models/channel.model.js";
import { ApiError } from "../utils/ApiError.js"
import { getUserObjectId } from "../utils/helperFunctions.js";


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

    if (
        [channelName, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existingChannel = await Channel.findOne({ channelName: { $regex: new RegExp(`^${channelName}$`, 'i') } });

    if (existingChannel) {
        throw new ApiError(409, `This Channel ${channelName} already exists`);
    }

    // Validate the user and return the user id through this method getUserObjectId
    const ownerId = await getUserObjectId(userId);

    // Check if the user has already created a channel
    const userChannels = await Channel.find({ owner: ownerId});

    if (userChannels.length === 0) {
        const dataToCreate = await Channel.create({
            channelName,
            description,
            owner: ownerId
        });
        const dataToFetch = await Channel.findById(dataToCreate._id);

        if (!dataToFetch) {
            throw new ApiError(500, "Something went wrong while fetching the channel");
        }
        return dataToFetch;
    } else {
        throw new ApiError(400, "You have already created a channel")
    }
}

export default {
    createChannel,
}
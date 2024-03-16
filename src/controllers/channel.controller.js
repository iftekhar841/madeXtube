import channelService from '../services/channel.service.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js'


// Create Controller to handle the API request and response
const createChannel = asyncHandler(async (req, res) => {
    try {
        const channelResponse = await channelService.createChannel(
            req.body
        );
        return res
        .status(201)
        .json( new ApiResponse(201, channelResponse, "Channel created successfully"));
   
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError({ statusCode: error.statusCode, message: error.message }))
        
    }
})


// Get Controller to handle the API request and response
const getChannelInfoByUserId = asyncHandler(async (req, res) => {
    try {
        const getResponse = await channelService.getChannelInfoByUserId(
            req.params
        );
        return res
        .status(201)
        .json( new ApiResponse(201, getResponse, "Channel info fetch successfully"));
   
    } catch (error) {
        return res
        .status(500)
        .json( new ApiError({ statusCode: error.statusCode, message: error.message }))
        
    }
})


const deleteChannel = asyncHandler(async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        // Handle the delete response
        const deleteResponse = await channelService.deleteChannel(
            req.params,
            loggedInUser
        );
        return res
       .status(201)
       .json( new ApiResponse(201, deleteResponse));
   
    } catch (error) {
        return res
       .status(500)
       .json( new ApiError({ statusCode: error.statusCode, message: error.message }))
        
    }
})

export default {
    createChannel,
    getChannelInfoByUserId,
    deleteChannel
}
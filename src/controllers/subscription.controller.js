import { response } from "express";
import subscriptionService from "../services/subscription.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSubscription = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const subcriptionResponse = await subscriptionService.createSubscription(
      loggedInUser,
      req.params
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subcriptionResponse,
          "Subscription Added Successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});


const unsubcribeSubscription = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const unSubcribedResponse = await subscriptionService.unsubcribeSubscription(
      loggedInUser,
      req.params
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, unSubcribedResponse, "Subscription removed Successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});


const getSubscriberCount = asyncHandler(async (req, res) => {
  try {
    const subscriberCountResponse = await subscriptionService.getSubscriberCount(
      req.params
    );
    return res
    .status(200)
    .json(
        new ApiResponse(
          200,
          subscriberCountResponse,
          "Subscriber Count fetch successfully"
        )
      );
  } catch (error) {
    return res
    .status(500)
    .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
}) 


const getUserSubscribedVideos = asyncHandler(async (req, res) => {
  try {
    const loggedInUser =  req.user?._id
    const userSubscribedVideosResponse = await subscriptionService.getUserSubscribedVideos(
      loggedInUser
    );
    return res
    .status(200)
    .json(
        new ApiResponse(
          200,
          userSubscribedVideosResponse,
          "User Subscribed Videos fetch successfully"
        )
      );
  } catch (error) {
    return res
    .status(500)
    .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
})


const checkIsSubcribe = asyncHandler(async (req, res) => {
  try {
    console.log("req.params", req.params);
    const isSubscribeResponse = await subscriptionService.checkIsSubcribe(
      req.params
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          isSubscribeResponse,
          "subscribe fetch successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});


export default {
  createSubscription,
  unsubcribeSubscription,
  getSubscriberCount,
  getUserSubscribedVideos,
  checkIsSubcribe
};

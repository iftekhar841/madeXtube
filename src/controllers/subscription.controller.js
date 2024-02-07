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

const unsubcribeChannel = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const unSubcribedResponse = await subscriptionService.unsubcribeChannel(
      loggedInUser,
      req.params,
      req.body
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, unSubcribedResponse, "Unsubscribed Successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

const checkIsSubcribe = asyncHandler(async (req, res) => {
  try {
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
  unsubcribeChannel,
  checkIsSubcribe
};

import { User } from "../models/user.models.js";
import { Category } from "../models/categories.model.js";
import { ApiError } from "./ApiError.js";
import mongoose from "mongoose";
import Bull from "bull";
// import queueService from "../processors/bullQueueServices.js";
import notificationSubscriptionQueueProcessor from "../processors/notificationSubscriptionQueueProcessor.js";
// import processRequest from "../processors/notificationSubscriptionQueueProcessor.js";
/**
 *
 * @param {{page: number; limit: number; customLabels: mongoose.CustomLabels;}} options
 * @returns {mongoose.PaginateOptions}
 */

export const getMongoosePaginationOptions = ({
  page = 1,
  limit = 12,
  customLabels,
}) => {
  return {
    page: Math.max(page, 1),
    limit: Math.max(limit, 10),
    customLabels: {
      pagingCounter: "serialNumberStartFrom",
      ...customLabels,
    },
  };
};

/**
 * Gets the object id of a user based on the provided user id.
 *
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<string>} - A Promise that resolves to the user's object id.
 * @throws {ApiError} - Throws an ApiError if the user is not found or if there's an error during the process.
 */

export const getUserObjectId = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId }).select("_id isActive");
    if (!user) {
      throw new ApiError(404, "User id does not exist");
    } else {
      return user._id;
    }
  } catch (error) {
    // Handle the specific case of CastError
    if (error.name === "CastError") {
      throw new ApiError(400, "Invalid user id format");
    } else {
      // Throw other errors as ApiError with the original status code and message
      throw new ApiError(error.statusCode, error.message);
    }
  }
};

/**
 * Gets the object id of a category based on the provided category id.
 *
 * @param {string} categoryId - The unique identifier of the category.
 * @returns {Promise<string>} - A Promise that resolves to the category's object id.
 * @throws {ApiError} - Throws an ApiError if the category is not found or if there's an error during the process.
 */

export const getCategoryObjectId = async (categoryId) => {
  try {
    const category = await Category.findOne({ _id: categoryId }).select("_id");

    if (!category) {
      throw new ApiError(404, "Category id does not exist");
    } else {
      return category._id;
    }
  } catch (error) {
    throw new ApiError(error.statusCode, error.message);
  }
};

/**
 * Formats duration in seconds into HH:MM:SS format.
 * @param {{ durationInSeconds: string }} options - Object containing the duration in seconds as a string.
 * @returns {string} - Formatted duration in HH:MM:SS format.
 */

export const formatDuration = (durationInSeconds) => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  const formattedDuration = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return formattedDuration;
};

/**
 * Validates and creates ObjectId instances for an array of ids.
 *
 * @param {Array<string>} ids - An array of string representations of ObjectId.
 * @returns {Object} - An object where keys are the original ids and values are corresponding ObjectId instances or null if the id is not valid.
 */

export const isValidObjectId = (ids) => {
  const validIds = {};

  ids.forEach((id) => {
    if(mongoose.Types.ObjectId.isValid(id)) {
      validIds[id] = new mongoose.Types.ObjectId(id);
    }
    else {
      validIds[id] = null;
    }
  });
  return validIds;
}




export const createBullQueue = (queueName) => {
    const bullQueue = new Bull(queueName, {
      redis: {
        host: '127.0.0.1',
        port: 6379
      },
  });
  console.log("CreatingbullQueue", bullQueue);
  return bullQueue;
};



export const queueAddServiceHelper = async (queueName, job) => {
  console.log("job", job);
  console.log("queueName", queueName);

  // await queueService(queueName, job);
  const bullQueue = createBullQueue(queueName)
  const addJob =  await bullQueue.add(job)
  console.log("addJob---->", addJob);

  bullQueue.process(notificationSubscriptionQueueProcessor);
  }

//   console.log("notification subscription queue", notificationSubscriptionQueue);
// queueService.process(notificationSubscriptionQueueProcessor)

// export const queueProcessServiceHelper = async (queueName, notificationSubscriptionQueueProcessor) => {
  // console.log("processQueueService", processRequest);  
  // console.log("queueName", queueName);

//  const bullQueue = createBullQueue(queueName);
//   await bullQueue.process(notificationSubscriptionQueueProcessor);
// };
import { User } from "../models/user.models.js";
import { Category } from "../models/categories.model.js";
import { ApiError } from "./ApiError.js";

/**
 *
 * @param {{page: number; limit: number; customLabels: mongoose.CustomLabels;}} options
 * @returns {mongoose.PaginateOptions}
 */

export const getMongoosePaginationOptions = ({
  page = 1,
  limit = 10,
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
    throw new ApiError(error.statusCode, error.message);
  }
};

/**
 * Gets the object id of a user based on the provided user id.
 *
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<string>} - A Promise that resolves to the user's object id.
 * @throws {ApiError} - Throws an ApiError if the user is not found or if there's an error during the process.
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

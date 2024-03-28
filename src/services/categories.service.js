import { Category } from "../models/categories.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



// Create a new category
const createCategory = async (categoryDetails, categoryImagePath) => {
    const { categoryName, description } = categoryDetails;

    //   if(!categoryName || !description) {
    //     console.log("insid not if block");
    //     throw new ApiError(400, "All filds are mandatory")
    //   }

    if (
        [categoryName, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existingCategory = await Category.findOne({
        categoryName: { $regex: new RegExp(`^${categoryName}$`, "i") },
    });

    if (existingCategory) {
        throw new ApiError(400, `Category ${categoryName} already exists`);
    }

    if (!categoryImagePath) {
        throw new ApiError(400, "Category Image is required");
      }

    // Uploading the image on cloudinary server  
    const cloudinaryImageLink = await uploadOnCloudinary(categoryImagePath)
    console.log("Uploading image on cloudinary server", cloudinaryImageLink);
    if (!cloudinaryImageLink) {
        throw new ApiError(400, "Category Image is required");
    }

    const dataToSave = await Category.create({
        categoryName,
        description,
        categoryImage: cloudinaryImageLink.url
    });

    return dataToSave;
};

// Update the category
const updateCategory = async (updateDetails, _id) => {

    const { categoryName, description } = updateDetails

    if (!(categoryName || description)) {
        throw new ApiError(400, "Field is missing or invalid")
    }
    const dataToUpdate = await Category.findByIdAndUpdate(
        _id,
        {
            $set: updateDetails,
        },
        {
            new: true
        }
    );
    return dataToUpdate;
}

const getAllCategory = async () => {
    const dataToFetch = await Category.find();

    if(!dataToFetch) {
        throw new ApiError(404, "No data to fetch");
    }
    return dataToFetch 
}

export default {
    createCategory,
    updateCategory,
    getAllCategory
}

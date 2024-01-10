import { Category } from "../models/categories.model.js";
import { ApiError } from "../utils/ApiError.js";
import { getMongoosePaginationOptions } from "../utils/helperFunctions.js";



// Create a new category
const createCategory = async (categoryDetails) => {
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

    const dataToSave = await Category.create({
        categoryName,
        description
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

const getAllCategory = async (queryData) => {
    // const dataToFetch = await Category.find();

    // if(!dataToFetch) {
    //     throw new ApiError(404, "No data to fetch");
    // }
    // return dataToFetch 

    const { page = 1, limit = 10 } = queryData;
    const categoryAggregate = Category.aggregate([ { $match: {} }]);

    const categories = await Category.aggregatePaginate(
        categoryAggregate,
        getMongoosePaginationOptions({
          page,
          limit,
          customLabels: {
            totalDocs: "totalCategories",
            docs: "categories",
          },
        })
      );
       
     console.log("categories: ", categories); 
    return categories;
}

export default {
    createCategory,
    updateCategory,
    getAllCategory
}

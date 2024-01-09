import categoriesService from "../services/categories.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// Category Controllers
const createCategory = asyncHandler(async (req, res) => {
    try {

        // Handle the category response
        const categoryResponse = await categoriesService.createCategory(
            req.body
        );
        return res
            .status(201)
            .json(
                new ApiResponse(201, categoryResponse, "Category created Successfully.")
            );
    } catch (error) {
        // Handle errors and return an appropriate error response
        return res
            .status(500)
            .json(
                new ApiError({ statusCode: error.statusCode, message: error.message })
            );
    }
});


const updateCategory = asyncHandler(async (req, res) => {
    try {
        const _id = req.params.id;
        console.log("id: ", _id);
        // Handle category update response
        const updateCategoryResponse = await categoriesService.updateCategory(req.body, _id);

        return res.
            status(200).
            json(new ApiResponse(200, updateCategoryResponse, "Category updated successfully."))
    } catch (error) {
        return res.
            status(500).
            json(new ApiError({ statusCode: error.statusCode, message: error.message }));
    }

})

const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const getResponse = await categoriesService.getAllCategory(req.query);
    return res.
    status(200).
    json(new ApiResponse(200, getResponse, "Category fetched successfully."))
        
    } catch (error) {
        return res.
            status(500).
            json(new ApiError({ statusCode: error.statusCode, message: error.message }));
    }
})
export default {
    createCategory,
    updateCategory,
    getAllCategory
}

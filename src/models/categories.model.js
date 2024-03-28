import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CategoriesSchema = new Schema({
    categoryName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categoryImage: {
        type: String, //cloudinary url
        required: true
    }
});

CategoriesSchema.plugin(mongooseAggregatePaginate);
export const Category = mongoose.model('Category', CategoriesSchema);


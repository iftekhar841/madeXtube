import { Router } from "express";

const category_route = Router();

import categoriesController from "../controllers/categories.controller.js";

import { upload } from "../middlewares/multer.middleware.js";


category_route.post('/add-category', upload.single('categoryImage'), categoriesController.createCategory);  

category_route.patch('/update-category/:id', categoriesController.updateCategory);

category_route.get('/get-category', categoriesController.getAllCategory);

export default category_route;

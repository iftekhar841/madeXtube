import { Router } from "express";

const category_route = Router();

import categoriesController from "../controllers/categories.controller.js";


category_route.post('/add-category', categoriesController.createCategory);

category_route.patch('/update-category/:id', categoriesController.updateCategory);

category_route.get('/get-category', categoriesController.getAllCategory);

export { category_route };
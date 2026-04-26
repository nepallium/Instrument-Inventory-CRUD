import { Router } from "express";
import * as controller from "../controllers/categoryController.js";

const categories = Router();

categories.get("/", controller.showAllCategories);
categories.get("/:id", controller.showSingleCategory);

categories.post("/add", controller.addCategory);
categories.post("/delete/:id", controller.deleteCategory);

export default categories;

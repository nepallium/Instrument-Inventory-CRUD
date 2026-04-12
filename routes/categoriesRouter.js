import { Router } from "express";
import * as controller from "../controllers/categoryController.js";

const categories = Router();

categories.get("/", controller.showAllCategories);

export default categories;

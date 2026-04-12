import { Router } from "express";
import * as controller from "../controllers/productController.js";

const products = Router();

products.get("/", controller.showAllProducts);

export default products;

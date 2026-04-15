import { Router } from "express";
import * as controller from "../controllers/productController.js";

const products = Router();

products.get("/", controller.showAllProducts);
products.post("/delete/:id", controller.deleteProduct)

export default products;

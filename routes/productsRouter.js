import { Router } from "express";
import * as controller from "../controllers/productController.js";

const products = Router();

products.get("/", controller.showAllProducts);
products.post("/delete/:id", controller.deleteProduct)
products.post("/update/:id", controller.updateProduct)

export default products;

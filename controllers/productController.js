import * as db from "../db/queries.js";

export async function showAllProducts(req, res) {
  const products = await db.getAllProducts();
  console.log("all products after join: " + products);

  res.render("products/products", { title: "Products", products });
}

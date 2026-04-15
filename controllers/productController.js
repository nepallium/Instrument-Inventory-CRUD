import * as db from "../db/queries.js";

export async function showAllProducts(req, res) {
  const products = await db.getAllProducts();
  console.log("all products after join: " + products);

  res.render("products/products", { title: "Products", products });
}

export async function deleteProduct(req, res) {
  try {
    await db.deleteProduct(req.params.id)
    console.log("successfully delete product w/ id", req.params.id)
  } catch (error) {
    console.error("Error while deleting product:", error)
  } finally {
    res.redirect("/")
  }
}

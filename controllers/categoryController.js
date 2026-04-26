import * as db from "../db/queries.js";

export async function showAllCategories(req, res) {
  const categories = await db.getAllCategories();
  res.render("categories/categories", { title: "Categories", categories });
}

export async function showSingleCategory(req, res) {
  const products = await db.getProductsInCategory(req.params.id);
  const [{ category_name }] = await db.getCategoryNameFromId(req.params.id);
  // console.log(products);
  res.render("categories/categoryPage", {
    title: category_name,
    products,
  });
}

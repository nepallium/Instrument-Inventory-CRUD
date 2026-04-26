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
    category_id: req.params.id,
  });
}

export async function addCategory(req, res) {
  await db.addCategory(req.body);
  res.redirect("/categories");
}

export async function deleteCategory(req, res) {
  await db.deleteCategory(req.params.id);
  res.redirect("/categories");
}

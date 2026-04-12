import * as db from "../db/queries.js";

export async function showAllCategories(req, res) {
  const categories = await db.getAllCategories();
  res.render("categories/categories", { title: "Categories", categories });
}

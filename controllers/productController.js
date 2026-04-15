import * as db from "../db/queries.js";

export async function showAllProducts(req, res) {
  const products = await db.getAllProducts();
  // console.log("all products after join: " + products);
  console.log("first product:", products[0]);

  res.render("products/products", { title: "Products", products });
}

export async function showUpdateProduct(req, res) {
  const [product] = await db.getProductInfo(req.params.id);
  // console.log(product);
  const brands = await db.getAllBrands();
  const categories = await db.getAllCategories();

  if (!product) {
    return res.status(404).send("Product not found");
  }

  res.render("products/updateProduct", {
    title: `Update product ${product.instrument_name}`,
    product,
    brands,
    categories,
  });
}

export async function deleteProduct(req, res) {
  try {
    await db.deleteProduct(req.params.id);
    console.log("successfully delete product w/ id", req.params.id);
  } catch (error) {
    console.error("Error while deleting product:", error);
  } finally {
    res.redirect("/");
  }
}

export async function updateProduct(req, res) {
  try {
    await db.updateProduct(req.params);
  } catch (error) {
    console.error("Error while updating product:", error);
  } finally {
    res.redirect("/");
  }
}

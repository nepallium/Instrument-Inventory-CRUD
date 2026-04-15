import pool from "./pool.js";
// for deletion, learn how to reverse delete query to test deleting whole categories
// deleting category should not delete the instrument

export async function getAllProducts() {
  const { rows } = await pool.query(`
    SELECT i.id, i.instrument_name, b.brand_name,
      COALESCE(json_agg(c.category_name) FILTER (WHERE c.category_name IS NOT NULL), '[]') AS categories
    FROM instruments i
    LEFT JOIN instrument_categories i_c ON i_c.instrument_id = i.id
    LEFT JOIN categories c ON c.id = i_c.category_id
    LEFT JOIN brands b ON b.id = i.brand_id
    GROUP BY i.id, b.brand_name
    `);

  return rows;
}

export async function deleteProduct(productId) {
  await pool.query(`
      DELETE FROM instruments i WHERE i.id = $1;
    `, [productId])
}

export async function getAllCategories() {
  const { rows } = await pool.query(`SELECT * FROM categories`);
  return rows;
}

export async function getProductsInCategory(category) {
  const {rows} = await pool.query(`
    SELECT i.id, i.name, b.brand_name
    LEFT JOIN instrument_categories i_c ON i_c.instrument_id = i.id
    LEFT JOIN categories c ON c.id = i_c.category_id
    LEFT JOIN brands b ON b.id = i.brand_id
    WHERE c.name = $1
    GROUP BY i.id, b.brand_name
    `, [category])
    return rows
}

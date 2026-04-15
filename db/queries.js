import pool from "./pool.js";
// for deletion, learn how to reverse delete query to test deleting whole categories
// deleting category should not delete the instrument

const joinAll = 
    `FROM instruments i
    LEFT JOIN instruments_categories i_c ON i_c.instrument_id = i.id
    LEFT JOIN categories c ON c.id = i_c.category_id
    LEFT JOIN brands b ON b.id = i.brand_id`

const joinAndSelectAll = 
    `
    SELECT i.id, i.instrument_name, b.brand_name,
    COALESCE(json_agg(c.category_name) FILTER (WHERE c.category_name IS NOT NULL), '[]') AS categories
    ${joinAll}
    `

export async function getAllProducts() {
  const { rows } = await pool.query(`
    ${joinAndSelectAll}
    GROUP BY i.id, b.brand_name
    `);

  return rows;
}

export async function getProductInfo(productId) {
  const {rows} = await pool.query(`
    ${joinAndSelectAll}
    WHERE id = $1
    GROUP BY i.id, b.brand_name
    `, [productId])
}

export async function deleteProduct(productId) {
  await pool.query(`
      DELETE FROM instruments i WHERE i.id = $1;
    `, [productId])
}

export async function updateProduct(product) {
  if (product.category_name) {
    await pool.query(`
        UPDATE instruments_categories ic
        SET category_id = (SELECT id FROM categories WHERE id = $1)
        WHERE $2 = ic.instrument_id
      `, [product.category_name, product.id])
  }
  if (product.brand_name) {
    await pool.query(`
        UPDATE instruments i
        SET brand_id = (SELECT id FROM brands WHERE id = $1)
        WHERE i.id = $2
      `, [product.brand_name, product.id])
  }

  if (product.instrument_name) {
    await pool.query(`
        UPDATE instruments i
        SET instrument_name = $1
        WHERE i.id = $2
      `, [product.name, product.id])
  }
}

export async function getAllCategories() {
  const { rows } = await pool.query(`SELECT * FROM categories`);
  return rows;
}

export async function getProductsInCategory(category) {
  const {rows} = await pool.query(`
    ${joinAndSelectAll}
    WHERE c.name = $1
    GROUP BY i.id, b.brand_name
    `, [category])
    return rows
}

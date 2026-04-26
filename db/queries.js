import pool from "./pool.js";
// for deletion, learn how to reverse delete query to test deleting whole categories
// deleting category should not delete the instrument

const joinAll = `FROM instruments i
    LEFT JOIN instrument_categories i_c ON i_c.instrument_id = i.id
    LEFT JOIN categories c ON c.id = i_c.category_id
    LEFT JOIN brands b ON b.id = i.brand_id`;

const joinAndSelectAll = {
  select: `SELECT i.id, i.instrument_name, b.brand_name, i.brand_id,
      COALESCE(json_agg(c.category_name) FILTER (WHERE c.category_name IS NOT NULL), '[]') AS categories,
      COALESCE(json_agg(c.id) FILTER (WHERE c.id IS NOT NULL), '[]') AS category_ids
      ${joinAll}`,
  groupBy: `GROUP BY i.id, b.brand_name, i.brand_id`,
};

export async function getAllProducts() {
  const { rows } = await pool.query(
    `${joinAndSelectAll.select}
    ${joinAndSelectAll.groupBy}
    `,
  );

  return rows;
}

export async function getProductInfo(productId) {
  const { rows } = await pool.query(
    `${joinAndSelectAll.select}
    WHERE i.id = $1
    ${joinAndSelectAll.groupBy}
    `,
    [productId],
  );
  return rows;
}

export async function deleteProduct(productId) {
  await pool.query(
    `
      DELETE FROM instruments i WHERE i.id = $1;
    `,
    [productId],
  );
}

export async function updateProduct(formData) {
  if (formData.category_id) {
    await pool.query(
      `
        UPDATE instrument_categories ic
        SET category_id = $1
        WHERE ic.instrument_id = $2
      `,
      [formData.category_id, formData.id],
    );
  }
  if (formData.brand_id) {
    await pool.query(
      `
        UPDATE instruments i
        SET brand_id = $1
        WHERE i.id = $2
      `,
      [formData.brand_id, formData.id],
    );
  }

  if (formData.instrument_name) {
    await pool.query(
      `
        UPDATE instruments i
        SET instrument_name = $1
        WHERE i.id = $2
      `,
      [formData.instrument_name, formData.id],
    );
  }
}

// =========
// CATEGORIES
export async function getAllCategories() {
  const { rows } = await pool.query(`SELECT * FROM categories`);
  return rows;
}

export async function getProductsInCategory(categoryId) {
  const { rows } = await pool.query(
    `
    ${joinAndSelectAll.select}
    WHERE EXISTS (
      SELECT 1
      FROM instrument_categories ic
      WHERE ic.instrument_id = i.id
      AND ic.category_id = $1
    )
    ${joinAndSelectAll.groupBy}
    `,
    [categoryId],
  );
  return rows;
}

export async function getCategoryNameFromId(categoryId) {
  const { rows } = await pool.query(
    `SELECT category_name
    FROM categories c
    WHERE c.id = $1
    `,
    [categoryId],
  );
  return rows;
}

// =======
// BRANDS
export async function getAllBrands() {
  const { rows } = await pool.query(`SELECT * FROM brands`);
  return rows;
}

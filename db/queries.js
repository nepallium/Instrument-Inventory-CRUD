import pool from "./pool.js";
// for deletion, learn how to reverse delete query to test deleting whole categories
// deleting category should not delete the instrument

export async function getAllProducts() {
  const { rows } = await pool.query(`
    SELECT * FROM instruments i
    LEFT JOIN instrument_categories i_c ON i_c.instrument_id = i.id
    JOIN categories c ON c.id = i_c.category_id
    JOIN brands b ON b.id = i.brand_id
    `);

  return rows;
}

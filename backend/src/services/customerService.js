import pool from "../config/db.js";

export const createCustomer = async (brokerId, customerData) => {
  const { name, email, gstin, type } = customerData;

  const result = await pool.query(
    `INSERT INTO customers
    (broker_id, name, email, gstin, type)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [brokerId, name, email, gstin, type]
  );

  return result.rows[0];
};

export const getCustomers = async (brokerId) => {
  const result = await pool.query(
    `SELECT *
     FROM customers
     WHERE broker_id = $1
     ORDER BY id DESC`,
    [brokerId]
  );

  return result.rows;
};
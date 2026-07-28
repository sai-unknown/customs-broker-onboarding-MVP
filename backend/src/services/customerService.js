import pool from "../config/db.js";
import { handleCustomerDbError } from "../utils/dbErrors.js";

export const createCustomer = async (brokerId, customerData) => {
  const { name, email, gstin, type } = customerData;

  try {
    const result = await pool.query(
      `INSERT INTO customers
      (broker_id, name, email, gstin, type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [brokerId, name, email.toLowerCase(), gstin.toUpperCase(), type]
    );

    return result.rows[0];
  } catch (error) {
    handleCustomerDbError(error);
  }
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


export const getCustomerById = async (brokerId, customerId) => {
  const result = await pool.query(
    `SELECT *
     FROM customers
     WHERE id = $1
       AND broker_id = $2`,
    [customerId, brokerId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

export const updateCustomer = async (
  brokerId,
  customerId,
  customerData
) => {
  const { name, email, gstin, type } = customerData;

  try {
    const result = await pool.query(
      `UPDATE customers
       SET
         name = $1,
         email = $2,
         gstin = $3,
         type = $4,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
         AND broker_id = $6
       RETURNING *`,
      [name, email.toLowerCase(), gstin.toUpperCase(), type, customerId, brokerId]
    );

    if (result.rows.length === 0) {
      const error = new Error("Customer not found");
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    handleCustomerDbError(error);
  }
};

export const deleteCustomer = async (
  brokerId,
  customerId
) => {
  const result = await pool.query(
    `DELETE FROM customers
     WHERE id = $1
       AND broker_id = $2
     RETURNING id`,
    [customerId, brokerId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  return true;
};
import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const registerBroker = async ({ name, email, password }) => {
  const existingUser = await pool.query(
    "SELECT id FROM brokers WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO brokers
    (name,email,password_hash)
    VALUES ($1,$2,$3)
    RETURNING id,name,email,role`,
    [name, email, passwordHash]
  );

  return result.rows[0];
};
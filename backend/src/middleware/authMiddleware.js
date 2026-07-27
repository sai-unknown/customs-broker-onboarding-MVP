import pool from "../config/db.js";
import { verifyToken } from "../utils/jwt.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    const error = new Error("Not authorized. No token provided.");
    error.statusCode = 401;
    throw error;
  }

  const decoded = verifyToken(token);

  const result = await pool.query(
    `SELECT id, name, email, role
     FROM brokers
     WHERE id = $1`,
    [decoded.id]
  );

  if (result.rows.length === 0) {
    const error = new Error("Broker not found.");
    error.statusCode = 401;
    throw error;
  }

  req.user = result.rows[0];

  next();
});
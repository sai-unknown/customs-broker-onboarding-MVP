import pg from "pg";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number.parseInt(process.env.DB_POOL_MAX || "20", 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl:
    isProduction &&
    (process.env.DB_SSL === "true" ||
      process.env.DATABASE_URL?.includes("railway") ||
      process.env.DATABASE_URL?.includes("neon.tech") ||
      process.env.DATABASE_URL?.includes("render.com"))
      ? {
          rejectUnauthorized:
            process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
        }
      : false,
});

pool.on("error", (err) => {
  logger.error("Unexpected database pool error", { error: err.message });
});

export default pool;

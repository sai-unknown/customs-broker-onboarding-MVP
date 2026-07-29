import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/db.js";
import { validateEnv } from "./config/validateEnv.js";
import { logger } from "./utils/logger.js";

dotenv.config();
validateEnv();

const PORT = Number.parseInt(process.env.PORT || "5000", 10);
const HOST = process.env.HOST || "0.0.0.0";

let server;

async function startServer() {
  try {
    await pool.query("SELECT 1");

    server = app.listen(PORT, HOST, () => {
      logger.info("Server started", {
        host: HOST,
        port: PORT,
        env: process.env.NODE_ENV || "development",
      });
    });

    server.on("error", (error) => {
      logger.error("Server error", { error: error.message });
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to connect to PostgreSQL", { error: error.message });
    process.exit(1);
  }
}

async function shutdown(signal) {
  logger.info("Shutdown signal received", { signal });

  if (server) {
    server.close(async () => {
      try {
        await pool.end();
        logger.info("Server shut down gracefully");
        process.exit(0);
      } catch (error) {
        logger.error("Error during shutdown", { error: error.message });
        process.exit(1);
      }
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000).unref();
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();

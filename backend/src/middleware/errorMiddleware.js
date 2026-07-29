import { ZodError } from "zod";
import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "production") {
    logger.error("Request error", {
      message: err.message,
      statusCode,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.error("Request error", {
      message: err.message,
      statusCode,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode < 500 ? err.message : "Internal Server Error",
  });
};

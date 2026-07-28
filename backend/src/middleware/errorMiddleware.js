import { ZodError } from "zod";

export const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  } else {
    console.error(err.message);
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

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      err.statusCode && err.statusCode < 500
        ? err.message
        : "Internal Server Error",
  });
};
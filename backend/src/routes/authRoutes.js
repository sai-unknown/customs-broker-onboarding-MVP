import express from "express";
import { register } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth routes working",
  });
});

export default router;
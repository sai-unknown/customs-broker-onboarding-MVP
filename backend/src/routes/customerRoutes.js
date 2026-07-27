import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/test", protect, (req, res) => {
  res.json({
    success: true,
    message: "Customer routes working",
    user: req.user,
  });
});


export default router;
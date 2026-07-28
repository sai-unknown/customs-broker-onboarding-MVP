import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  addCustomer,
  getAllCustomers,
} from "../controllers/customerController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(addCustomer)
  .get(getAllCustomers);

export default router;
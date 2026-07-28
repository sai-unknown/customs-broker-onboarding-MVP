import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  addCustomer,
  getAllCustomers,
  getCustomer,
  editCustomer,
  removeCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(addCustomer)
  .get(getAllCustomers);

router
  .route("/:id")
  .get(getCustomer)
  .put(editCustomer)
  .delete(removeCustomer);

export default router;
import asyncHandler from "../utils/asyncHandler.js";
import { customerSchema } from "../validators/customerValidator.js";

import {
  createCustomer,
  getCustomers,
} from "../services/customerService.js";

export const addCustomer = asyncHandler(async (req, res) => {
  const validatedData = customerSchema.parse(req.body);

  const customer = await createCustomer(
    req.user.id,
    validatedData
  );

  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    data: customer,
  });
});

export const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await getCustomers(req.user.id);

  res.json({
    success: true,
    data: customers,
  });
});
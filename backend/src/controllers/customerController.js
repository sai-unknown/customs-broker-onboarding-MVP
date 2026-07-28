import asyncHandler from "../utils/asyncHandler.js";
import { customerSchema } from "../validators/customerValidator.js";
import { idParamSchema } from "../validators/paramsValidator.js";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../services/customerService.js";

export const addCustomer = asyncHandler(async (req, res) => {
  const validatedData = customerSchema.parse(req.body);

  const customer = await createCustomer(req.user.id, validatedData);

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

export const getCustomer = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);

  const customer = await getCustomerById(req.user.id, id);

  res.json({
    success: true,
    data: customer,
  });
});

export const editCustomer = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const validatedData = customerSchema.parse(req.body);

  const customer = await updateCustomer(
    req.user.id,
    id,
    validatedData
  );

  res.json({
    success: true,
    message: "Customer updated successfully",
    data: customer,
  });
});

export const removeCustomer = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);

  await deleteCustomer(req.user.id, id);

  res.json({
    success: true,
    message: "Customer deleted successfully",
  });
});
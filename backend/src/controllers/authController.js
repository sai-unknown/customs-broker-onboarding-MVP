import { registerSchema, loginSchema } from "../validators/authValidator.js";
import { registerBroker, loginBroker } from "../services/authService.js";
import { generateToken } from "../utils/jwt.js";
import asyncHandler from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const validatedData = registerSchema.parse(req.body);

  const broker = await registerBroker(validatedData);

  const token = generateToken(broker.id);

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      user: broker,
      token,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);

  const broker = await loginBroker(validatedData);

  const token = generateToken(broker.id);

  res.json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: broker.id,
        name: broker.name,
        email: broker.email,
        role: broker.role,
      },
      token,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});
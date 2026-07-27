import { registerSchema } from "../validators/authValidator.js";
import { registerBroker } from "../services/authService.js";
import { generateToken } from "../utils/jwt.js";

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
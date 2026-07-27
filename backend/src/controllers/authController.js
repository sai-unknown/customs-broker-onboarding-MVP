import { registerSchema } from "../validators/authValidator.js";
import { registerBroker } from "../services/authService.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res, next) => {
  try {
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body:", req.body);

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
  } catch (error) {
    next(error);
  }
};
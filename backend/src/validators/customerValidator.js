import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .min(2, "Customer name must be at least 2 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  gstin: z
    .string()
    .length(15, "GSTIN must be exactly 15 characters")
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN format"
    ),

  type: z.enum(["EXPORTER", "IMPORTER"]),
});
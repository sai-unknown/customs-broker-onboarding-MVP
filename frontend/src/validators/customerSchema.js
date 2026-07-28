import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  gstin: z.string().length(15, "GSTIN must be exactly 15 characters"),
  type: z.enum(["EXPORTER", "IMPORTER"]),
});
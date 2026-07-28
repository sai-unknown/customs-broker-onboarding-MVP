export function isUniqueViolation(error) {
  return error?.code === "23505";
}

export function handleCustomerDbError(error) {
  if (!isUniqueViolation(error)) {
    throw error;
  }

  const constraint = error.constraint ?? "";

  if (constraint.includes("email")) {
    const err = new Error("A customer with this email already exists");
    err.statusCode = 409;
    throw err;
  }

  if (constraint.includes("gstin")) {
    const err = new Error("A customer with this GSTIN already exists");
    err.statusCode = 409;
    throw err;
  }

  const err = new Error("Customer already exists");
  err.statusCode = 409;
  throw err;
}

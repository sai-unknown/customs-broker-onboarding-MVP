import { getCustomers } from "./customerApi";

export async function getDashboardStats() {
  const customers = await getCustomers();

  return {
    totalCustomers: customers.length,
  };
}
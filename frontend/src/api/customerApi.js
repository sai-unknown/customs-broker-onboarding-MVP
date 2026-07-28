import api from "./axios";

export const getCustomers = async () => {
  const res = await api.get("/customers");
  return res.data.data;
};

export const getCustomer = async (id) => {
  const res = await api.get(`/customers/${id}`);
  return res.data.data;
};

export const createCustomer = async (data) => {
  const res = await api.post("/customers", data);
  return res.data.data;
};

export const updateCustomer = async (id, data) => {
  const res = await api.put(`/customers/${id}`, data);
  return res.data.data;
};

export const deleteCustomer = async (id) => {
  await api.delete(`/customers/${id}`);
};
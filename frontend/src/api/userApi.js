import api from "./axios";

export async function getProfile() {
  const res = await api.get("/users/profile");
  return res.data.data;
}
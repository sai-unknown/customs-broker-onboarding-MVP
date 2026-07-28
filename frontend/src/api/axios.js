import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let onUnauthorized = null;

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url ?? "";
    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");

    if (
      error.response?.status === 401 &&
      onUnauthorized &&
      !isAuthRequest
    ) {
      onUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default api;

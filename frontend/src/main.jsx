import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

if (!import.meta.env.VITE_API_URL) {
  console.error("VITE_API_URL is not configured. Copy frontend/.env.example to frontend/.env");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
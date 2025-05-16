import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "../src/components/auth/AuthContext";

const futureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode futureFlags={futureFlags}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

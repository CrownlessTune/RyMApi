import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./sass/global.scss";
import { AuthProvider } from "./context/AuthContext"; // <-- Importa tu proveedor

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>  {/* Aquí envuelves todo */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

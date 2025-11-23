// src/routes/RequireAuth.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const token = localStorage.getItem("authToken");

  // ❌ No token → send to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Token exists → allow child routes
  return <Outlet />;
};

export default RequireAuth;

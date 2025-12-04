// src/routes/RequirePatient.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RequirePatient = () => {
  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const isPatient = token && user?.role === "patient";

  if (!isPatient) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default RequirePatient;

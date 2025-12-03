// src/routes/RequireDoctor.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RequireDoctor = () => {
  const doctorAuth = JSON.parse(localStorage.getItem("doctorAuth") || "{}");

  const isDoctor =
    doctorAuth?.token && doctorAuth?.role === "doctor";

  if (!isDoctor) {
    return <Navigate to="/signin/doctor" replace />;
  }

  return <Outlet />;
};

export default RequireDoctor;

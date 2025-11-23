// src/hooks/useAuth.js
import { useMemo } from "react";

const AUTH_TOKEN_KEY = "authToken";
const AUTH_USER_KEY = "currentUser";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const useAuth = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY) || null;
  const user = useMemo(
    () => safeParse(localStorage.getItem(AUTH_USER_KEY)),
    []
  );

  const isAuthenticated = !!token && !!user;
  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = "/signin";
  };

  return {
    token,
    user,
    isAuthenticated,
    isDoctor,
    isPatient,
    logout,
  };
};

export default useAuth;

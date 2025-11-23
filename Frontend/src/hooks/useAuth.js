// src/hooks/useAuth.js
import { useMemo, useEffect, useState } from "react";

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
  const [token, setToken] = useState(localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(safeParse(localStorage.getItem(AUTH_USER_KEY)));

  // Automatically re-check localStorage whenever login happens
  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const newUser = safeParse(localStorage.getItem(AUTH_USER_KEY));

      setToken(newToken);
      setUser(newUser);
    }, 200);

    return () => clearInterval(interval);
  }, []);

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

// src/hooks/useAuth.js
import { useEffect, useState } from "react";

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
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(() =>
    safeParse(localStorage.getItem(AUTH_USER_KEY))
  );

  // 🔥 Sync auth state ONCE on mount + whenever storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem(AUTH_TOKEN_KEY));
      setUser(safeParse(localStorage.getItem(AUTH_USER_KEY)));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🔥 LOGIN: save user + token + role
  const login = (token, userObj) => {
    if (!token || !userObj) return;

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userObj));

    setToken(token);
    setUser(userObj);
  };

  // 🔥 CLEAN LOGOUT: clears all, redirects to homepage
  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    setToken(null);
    setUser(null);

    window.location.href = "/"; // clean logout redirect
  };

  // Derived states
  const isAuthenticated = !!token && !!user;
  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  return {
    token,
    user,
    isAuthenticated,
    isDoctor,
    isPatient,
    login,
    logout,
  };
};

export default useAuth;

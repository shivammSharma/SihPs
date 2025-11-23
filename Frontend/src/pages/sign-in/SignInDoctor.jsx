// src/pages/sign-in/SignInDoctor.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const AuthInput = ({
  placeholder,
  value,
  onChange,
  type = "text",
  name,
  autoComplete,
}) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    autoComplete={autoComplete}
    aria-label={placeholder}
    className="w-full border-2 border-border rounded-md py-2.5 px-3 text-sm text-center placeholder:text-primary/60 focus:outline-none focus:ring-0 focus:border-primary"
  />
);

const BrandLogo = () => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
      <Icon name="Leaf" size={18} className="text-primary" />
    </div>
    <div>
      <div className="text-xl lg:text-2xl font-display font-semibold text-primary leading-tight">
        AyurNutri
      </div>
      <div className="text-xs text-text-secondary">
        Doctor Portal Login
      </div>
    </div>
  </div>
);

const SignInDoctor = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in as doctor, redirect
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (token && user?.role === "doctor") {
      navigate("/professional-dashboard-portal", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!emailOrPhone || !password) {
      setErrorMsg("Please enter email / phone and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE}/api/auth/login/doctor`, {
        emailOrPhone,
        password,
      });

      const { token, user } = res.data || {};

      if (token) {
        localStorage.setItem("authToken", token);
      }
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
      }

      if (user?.role === "doctor") {
        navigate("/professional-dashboard-portal");
      } else {
        setErrorMsg("Not authorized as doctor.");
      }
    } catch (err) {
      console.error("DOCTOR LOGIN ERROR:", err);
      const msg =
        err?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/60 py-12">
      <div className="w-full px-4 max-w-xl">
        <div className="bg-card rounded-2xl border-4 border-border p-6 sm:p-8 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <BrandLogo />
          </div>

          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="px-5 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground shadow">
              DOCTOR LOGIN
            </span>
          </div>

          {errorMsg && (
            <div className="mb-3 text-center text-xs sm:text-sm text-red-600 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <AuthInput
              name="emailOrPhone"
              placeholder="EMAIL / PHONE NUMBER"
              value={emailOrPhone}
              onChange={setEmailOrPhone}
              autoComplete="username"
            />
            <AuthInput
              name="password"
              placeholder="PASSWORD"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground px-6 py-2 disabled:opacity-60"
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </Button>

            <div className="text-center text-sm mt-2">
              Not a doctor?{" "}
              <Link to="/signin" className="text-primary font-medium">
                Go to patient login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInDoctor;

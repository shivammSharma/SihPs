// src/pages/sign-in/SignInPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const MODE = "patientLogin"; // reserved for future expansion

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

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
        Ancient Wisdom • Modern Precision
      </div>
    </div>
  </div>
);

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

const SignInPage = () => {
  const [lang, setLang] = useState("EN");
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // inside SignInPage.jsx
const handleSubmit = async (e) => {
  e?.preventDefault();
  setErrorMsg("");

  if (!emailOrPhone || !password) {
    setErrorMsg("Please enter email / phone and password.");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(`${API_BASE}/api/auth/login`, {
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

    console.log("LOGIN SUCCESS:", user);

    if (user?.role === "doctor") {
      // doctor dashboard
      navigate("/professional-dashboard-portal");
    } else if (user?.role === "patient") {
      // patient dashboard
      navigate("/personal-wellness-hub");
    } else {
      navigate("/"); // fallback
    }
  } catch (err) {
    console.error("SIGNIN ERROR:", err);
    const msg =
      err?.response?.data?.message ||
      "Login failed. Please check your email / phone and password.";
    setErrorMsg(msg);
  } finally {
    setLoading(false);
  }
};


  const isEnglish = lang === "EN";
  const identifierPlaceholder = isEnglish
    ? "EMAIL / PHONE NUMBER"
    : "ईमेल / फोन नंबर";
  const passwordPlaceholder = isEnglish ? "PASSWORD" : "पासवर्ड";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/60 py-12">
      <div className="w-full px-4">
        <div className="mx-auto max-w-xl">
          <div className="bg-card rounded-2xl border-4 border-border p-6 sm:p-8 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <BrandLogo />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLang("HI")}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    lang === "HI"
                      ? "bg-brand-gold text-white"
                      : "bg-white border border-border text-primary"
                  }`}
                >
                  HINDI
                </button>
                <button
                  type="button"
                  onClick={() => setLang("EN")}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    lang === "EN"
                      ? "bg-white border-2 border-border text-primary"
                      : "bg-white text-primary/80"
                  }`}
                >
                  ENGLISH
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-center gap-4 mb-5">
              <button
                type="button"
                className="px-5 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground shadow"
              >
                LOGIN
              </button>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-full text-sm font-semibold bg-white border-2 border-border text-text-secondary"
              >
                SIGNUP
              </Link>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="mb-3 text-center text-xs sm:text-sm text-red-600 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <AuthInput
                name="emailOrPhone"
                placeholder={identifierPlaceholder}
                value={emailOrPhone}
                onChange={setEmailOrPhone}
                autoComplete="username"
              />

              <AuthInput
                name="password"
                placeholder={passwordPlaceholder}
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />

              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mt-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-primary text-primary-foreground px-6 py-2 disabled:opacity-60"
                >
                  {loading ? "LOGGING IN..." : "LOGIN"}
                </Button>

                <Link
                  to="/signup/doctor"
                  className="w-full sm:w-auto flex items-center justify-center border-2 border-border px-4 py-2 rounded-md text-sm"
                >
                  DOCTOR SIGNUP
                </Link>
              </div>

              <div className="text-center mt-2">
                <Link to="/reset" className="text-primary text-sm font-medium">
                  FORGOT PASSWORD?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SignInDoctor = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!emailOrPhone || !password) {
      setErrorMsg("Please enter your email / phone and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE}/api/auth/login/doctor`, {
        emailOrPhone,
        password,
      });

      const { token, user } = res.data || {};

      if (token) localStorage.setItem("authToken", token);
      if (user) localStorage.setItem("currentUser", JSON.stringify(user));

      // Doctor portal redirect
      navigate("/professional-dashboard-portal");
    } catch (err) {
      console.error("DOCTOR SIGNIN ERROR:", err);
      const msg =
        err?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7ee] bg-gradient-to-b from-[#fdf7ee] via-[#f6f0e5] to-[#f3ecdf] flex flex-col">
      <div className="h-20" />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-fadeInUp">
          {/* Left info */}
          <div className="hidden md:block">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-700/80 font-semibold mb-3">
              For Doctors
            </p>
            <h1 className="text-3xl font-serif font-semibold text-[#1f2933] mb-4">
              Log in to your{" "}
              <span className="text-emerald-700">professional portal</span>.
            </h1>
            <p className="text-[#4b5563] text-base mb-4">
              Access your patient panel, generate precision diet plans, and
              review practice analytics powered by Ayurvedic intelligence.
            </p>
            <ul className="text-sm text-[#374151] space-y-1">
              <li>• Manage cases and follow-up schedules</li>
              <li>• Generate evidence-backed plans</li>
              <li>• Track outcomes at a glance</li>
            </ul>
          </div>

          {/* Right form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-emerald-900/5 p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-700/80 font-semibold mb-2">
                Sign In
              </p>
              <h2 className="text-2xl font-semibold text-[#111827]">
                Doctor account
              </h2>
              <p className="text-sm text-[#6b7280] mt-1">
                Use your registered professional email or phone.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email or Phone"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="doctor@example.com or 98xxxxxx"
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#6b7280]">
                  New to AyurNutri?{" "}
                  <Link
                    to="/signup/doctor"
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    Create a doctor account
                  </Link>
                </span>
                <Link
                  to="/reset"
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                className="mt-2 bg-[#0f766e] hover:bg-[#115e59] shadow-md shadow-emerald-700/30"
              >
                Sign In as Doctor
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInDoctor;

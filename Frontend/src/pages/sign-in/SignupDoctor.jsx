import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SignupDoctor = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName || !email || !password) {
      setErrorMsg("Name, email, and password are required.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password should be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE}/api/auth/signup/doctor`, {
        fullName,
        email,
        password,
        phoneNumber: phoneNumber || undefined,
        gender: gender || undefined,
      });

      const { token, user } = res.data || {};
      if (token) localStorage.setItem("authToken", token);
      if (user) localStorage.setItem("currentUser", JSON.stringify(user));

      // Doctor portal
      navigate("/professional-dashboard-portal");
    } catch (err) {
      console.error("DOCTOR SIGNUP ERROR:", err);
      const msg =
        err?.response?.data?.message ||
        "Sign up failed. Please check your details and try again.";
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
          {/* Left text */}
          <div className="hidden md:block">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-700/80 font-semibold mb-3">
              For Doctors
            </p>
            <h1 className="text-3xl font-serif font-semibold text-[#1f2933] mb-4">
              Join the{" "}
              <span className="text-emerald-700">AyurNutri clinical network</span>.
            </h1>
            <p className="text-[#4b5563] text-base mb-4">
              Build evidence-backed nutrition plans, monitor outcomes, and
              collaborate with a growing ecosystem of Ayurvedic professionals.
            </p>
            <ul className="text-sm text-[#374151] space-y-1">
              <li>• Structured patient management workflows</li>
              <li>• Precision nutrition recommendations</li>
              <li>• Integrated clinical research tools</li>
            </ul>
          </div>

          {/* Right form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-emerald-900/5 p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-700/80 font-semibold mb-2">
                Create account
              </p>
              <h2 className="text-2xl font-semibold text-[#111827]">
                Doctor profile
              </h2>
              <p className="text-sm text-[#6b7280] mt-1">
                Share a few details to set up your professional workspace.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@example.com"
              />

              <Input
                label="Phone Number (optional)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="98xxxxxx"
              />

              <Input
                label="Gender (optional)"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="e.g. Male, Female, Non-binary"
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />

              <Input
                label="Confirm Password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
              />

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#6b7280]">
                  Already part of AyurNutri?{" "}
                  <Link
                    to="/signin/doctor"
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </span>
              </div>

              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                className="mt-2 bg-[#0f766e] hover:bg-[#115e59] shadow-md shadow-emerald-700/30"
              >
                Create Doctor Account
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupDoctor;

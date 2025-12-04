// src/pages/sign-in/SignupDoctor.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const SignupDoctor = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");

  const [regNo, setRegNo] = useState(""); 
  const [council, setCouncil] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClassName =
    "border border-gray-300 rounded-xl bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName || !email || !password || !regNo || !council) {
      setErrorMsg("Full name, email, password, registration number, and council are required.");
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
        reg_no: regNo,
        council: council
      });

      const { token, user } = res.data || {};

      if (token) localStorage.setItem("authToken", token);
      if (user) localStorage.setItem("currentUser", JSON.stringify(user));

      navigate("/professional-dashboard-portal");
    } catch (err) {
      console.error("DOCTOR SIGNUP ERROR:", err);
      const msg =
        err?.response?.data?.message || "Sign up failed. Please check your details.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7ee] bg-gradient-to-b from-[#fdf7ee] via-[#f6f0e5] to-[#f3ecdf] flex items-center justify-center px-4 py-10">
      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start md:items-center animate-fadeInUp">

        {/* Left Section */}
        <div className="md:pr-6">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-700/80 font-semibold mb-3">
            For Doctors
          </p>

          <h1 className="text-4xl font-serif font-semibold text-[#1f2933] leading-tight mb-4">
            Join the <span className="text-emerald-700">AyurNutri clinical network</span>.
          </h1>

          <p className="text-[#4b5563] text-base leading-relaxed mb-4">
            Build evidence-backed nutrition plans, monitor outcomes,
            and collaborate with a growing ecosystem of Ayurvedic professionals.
          </p>

          <ul className="text-sm text-[#374151] space-y-1">
            <li>• Structured patient management workflows</li>
            <li>• Precision nutrition recommendations</li>
            <li>• Integrated clinical research tools</li>
          </ul>
        </div>

        {/* Right Form */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-emerald-900/10 p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-700/80 font-semibold mb-2">
              Create Account
            </p>
            <h2 className="text-2xl font-semibold text-[#111827]">Doctor Profile</h2>
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
              placeholder="Dr. Aarav Sharma"
              className={inputClassName}
            />

            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@example.com"
              className={inputClassName}
            />

            <Input
              label="Phone Number (optional)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="9876543210"
              className={inputClassName}
            />

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender (optional)
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Registration Number */}
            <Input
              label="Registration Number"
              required
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="e.g., UPMC12345"
              className={inputClassName}
            />

            {/* Medical Council */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Council
              </label>
              <select
                required
                value={council}
                onChange={(e) => setCouncil(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              >
                <option value="">Select Council</option>
                <option value="Uttar Pradesh Medical Council">Uttar Pradesh Medical Council</option>
                <option value="Punjab Medical Council">Punjab Medical Council</option>
                <option value="Gujarat Medical Council">Gujarat Medical Council</option>
                <option value="Kerala Medical Council">Kerala Medical Council</option>
                <option value="Maharashtra Medical Council">Maharashtra Medical Council</option>
                <option value="West Bengal Medical Council">West Bengal Medical Council</option>
              </select>
            </div>

            {/* Password */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
                className={inputClassName}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 mt-3 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className={inputClassName}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 mt-3 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="text-xs sm:text-sm">
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
      </main>
    </div>
  );
};

export default SignupDoctor;

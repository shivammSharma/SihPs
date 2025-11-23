// src/pages/sign-up/PatientSignup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "../../components/ui/Button";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const PatientSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.phoneNumber ||
      !form.gender
    ) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE}/api/auth/signup/patient`,
        form
      );

      const { token, user } = res.data || {};

      if (token) {
        localStorage.setItem("authToken", token);
      }
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
      }

      navigate("/personal-wellness-hub");
    } catch (err) {
      console.error("PATIENT SIGNUP ERROR:", err);
      const msg =
        err?.response?.data?.message || "Signup failed. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/60 py-12">
      <div className="w-full max-w-lg bg-card rounded-2xl border-4 border-border p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Patient Signup
        </h2>

        {errorMsg && (
          <div className="mb-3 text-center text-xs sm:text-sm text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border-2 border-border rounded-md py-2.5 px-3 text-sm"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => handleChange("fullName")(e.target.value)}
          />
          <input
            className="w-full border-2 border-border rounded-md py-2.5 px-3 text-sm"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email")(e.target.value)}
          />
          <input
            className="w-full border-2 border-border rounded-md py-2.5 px-3 text-sm"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={(e) => handleChange("phoneNumber")(e.target.value)}
          />
          <select
            className="w-full border-2 border-border rounded-md py-2.5 px-3 text-sm"
            value={form.gender}
            onChange={(e) => handleChange("gender")(e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            className="w-full border-2 border-border rounded-md py-2.5 px-3 text-sm"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password")(e.target.value)}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground px-6 py-2 disabled:opacity-60"
          >
            {loading ? "SIGNING UP..." : "SIGNUP"}
          </Button>

          {/* Existing: patient already has account */}
          <div className="text-center text-sm mt-2">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary font-medium">
              Login
            </Link>
          </div>

          {/* NEW: Doctor login section */}
          <div className="text-center text-sm mt-2 border-t border-border pt-3">
            Are you a doctor?{" "}
            <Link to="/signin/doctor" className="text-primary font-medium">
              Login to Doctor Portal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientSignup;

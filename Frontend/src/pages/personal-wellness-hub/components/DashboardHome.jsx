// src/pages/personal-wellness-hub/components/DashboardHome.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../components/ui/Button";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const DashboardHome = () => {
  const [profile, setProfile] = useState(null);        // logged-in patient basic info
  const [latestRecord, setLatestRecord] = useState(null); // clinical record (from doctor)
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch overview for the logged in patient
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const token = localStorage.getItem("authToken");
        if (!token) {
          setErrorMsg("You are not logged in. Please sign in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/api/patient/overview`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data || {};
        setProfile(data.profile || null);
        setLatestRecord(data.latestRecord || null);
        setNextAppointment(data.nextAppointment || null);
      } catch (err) {
        console.error("PATIENT OVERVIEW ERROR:", err);
        const msg =
          err?.response?.data?.message ||
          "Failed to load your dashboard. Please try again.";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const patientName = profile?.fullName || "there";
  const prakriti = latestRecord?.dosha || "Not set";
  const currentState = latestRecord?.currentState || "—";
  const doctorName =
    latestRecord?.doctorId?.fullName || latestRecord?.doctorName || "Not assigned";

  const diet = latestRecord?.dietPlan || {};
  const breakfast = Array.isArray(diet.breakfast) ? diet.breakfast : [];
  const lunch = Array.isArray(diet.lunch) ? diet.lunch : [];
  const dinner = Array.isArray(diet.dinner) ? diet.dinner : [];

  const formatFoodName = (item) =>
    item["Food Item"] || item.name || item.title || "Food item";

  const formatFoodSubtitle = (item) =>
    item["Category"] || item["Key Benefit"] || item.benefit || "";

  const formatDateTime = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div className="w-full">
      {/* Error banner */}
      {errorMsg && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errorMsg}
        </div>
      )}

      {/* Header Greeting Card */}
      <div className="bg-[#E8E2D9] p-6 rounded-xl shadow-sm mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Namaste, {patientName}! 🙏
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome to your Ayurvedic wellness journey
            </p>

            {nextAppointment && (
              <p className="text-sm text-gray-700 mt-3">
                <span className="font-medium">Next session:</span>{" "}
                {formatDateTime(nextAppointment.date)}{" "}
                {nextAppointment.doctor && (
                  <>
                    · with{" "}
                    <span className="font-semibold">
                      {nextAppointment.doctor.fullName}
                    </span>
                  </>
                )}
              </p>
            )}
          </div>

          <div className="border rounded-xl p-4 bg-white shadow-sm text-center min-w-[180px]">
            <p className="text-sm text-gray-600">Prakriti</p>
            <p className="text-lg font-semibold text-green-700">
              {prakriti}
            </p>
            <p className="text-xs text-gray-500">
              Current State: {currentState}
            </p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xl">📷</span>
            </div>
          </div>
          <h3 className="font-semibold text-gray-800">Scan Food</h3>
          <p className="text-sm text-gray-600">
            Analyze meals with Ayurvedic principles
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
          <h3 className="font-semibold text-gray-800 mt-3">Analytics</h3>
          <p className="text-sm text-gray-600">View your nutrition insights</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-xl">🍎</span>
          </div>
          <h3 className="font-semibold text-gray-800 mt-3">Diet Plans</h3>
          <p className="text-sm text-gray-600">
            See what your doctor has prescribed
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-xl">📅</span>
          </div>
          <h3 className="font-semibold text-gray-800 mt-3">Sessions</h3>
          <p className="text-sm text-gray-600">Track upcoming consultations</p>
        </div>
      </div>

      {/* Doctor + Nutrition Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Doctor */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">
            Your Ayurvedic Doctor
          </h2>

          <div className="bg-white rounded-xl p-4 border shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                🧑‍⚕️
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {doctorName}
                </h3>
                <p className="text-sm text-gray-600">
                  {latestRecord?.primaryFocus || "Ayurvedic Physician"}
                </p>
                {latestRecord?.doctorExperience && (
                  <p className="text-xs text-blue-600">
                    {latestRecord.doctorExperience} years experience
                  </p>
                )}
              </div>
            </div>

            <Button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
              Book Consultation
            </Button>
          </div>
        </div>

        {/* Simple Nutrition Overview (placeholder, can hook to real data later) */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">
            Today&apos;s Nutrition Overview
          </h2>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="font-medium text-gray-800 mb-1">Calories</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-orange-500 h-3 rounded-full"
                style={{ width: "70%" }}
              ></div>
            </div>
            <p className="text-right text-sm mt-1">Approximate from diet plan</p>

            <p className="font-medium text-gray-800 mt-4 mb-1">Vata</p>
            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div
                className="bg-blue-400 h-3 rounded-full"
                style={{ width: "35%" }}
              ></div>
            </div>

            <p className="font-medium text-gray-800 mt-4 mb-1">Pitta</p>
            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div
                className="bg-orange-500 h-3 rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>

            <p className="font-medium text-gray-800 mt-4 mb-1">Kapha</p>
            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: "25%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Diet Plan (from doctor) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">Breakfast</h2>
          {breakfast.length === 0 && (
            <p className="text-sm text-gray-600">
              No breakfast items prescribed yet.
            </p>
          )}
          {breakfast.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border rounded-xl shadow-sm p-3 mb-3"
            >
              <p className="font-medium text-gray-800">
                {formatFoodName(item)}
              </p>
              <p className="text-xs text-gray-500">
                {formatFoodSubtitle(item)}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">Lunch</h2>
          {lunch.length === 0 && (
            <p className="text-sm text-gray-600">
              No lunch items prescribed yet.
            </p>
          )}
          {lunch.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border rounded-xl shadow-sm p-3 mb-3"
            >
              <p className="font-medium text-gray-800">
                {formatFoodName(item)}
              </p>
              <p className="text-xs text-gray-500">
                {formatFoodSubtitle(item)}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">Dinner</h2>
          {dinner.length === 0 && (
            <p className="text-sm text-gray-600">
              No dinner items prescribed yet.
            </p>
          )}
          {dinner.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border rounded-xl shadow-sm p-3 mb-3"
            >
              <p className="font-medium text-gray-800">
                {formatFoodName(item)}
              </p>
              <p className="text-xs text-gray-500">
                {formatFoodSubtitle(item)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

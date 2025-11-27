// src/pages/personal-wellness-hub/components/DashboardHome.jsx
import React, { useEffect, useMemo, useState } from "react";
import Button from "../../../components/ui/Button";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [profile, setProfile] = useState(null);
  const [primaryRecord, setPrimaryRecord] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);

  // ---- Fetch /api/patient/overview on mount ----
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

        const res = await fetch(`${API_BASE}/api/patient/overview`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "Failed to load your dashboard.");
        }

        const data = await res.json();


const primary =
  data.primaryRecord ||
  data.latestRecord ||
  data.record ||
  null;

setProfile(data.profile || null);
setPrimaryRecord(primary);
setNextAppointment(data.nextAppointment || null);

      } catch (err) {
        console.error("Patient dashboard error:", err);
        setErrorMsg(err.message || "Failed to load your dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  // ---- Helpers ----
  const patientName = useMemo(() => {
    if (profile?.fullName) return profile.fullName;
    return "AyurNutri User";
  }, [profile]);

  const prakritiLabel = primaryRecord?.dosha || "Not assessed yet";
  const currentStateLabel =
    primaryRecord?.status || "No active clinical record";

  const doctorInfo = useMemo(() => {
    const doc = primaryRecord?.doctorId;
    if (!doc) return null;
    return {
      name: doc.fullName || "Your Ayurvedic Doctor",
      email: doc.email || "",
      phone: doc.phoneNumber || "",
    };
  }, [primaryRecord]);

  const dietPlan = primaryRecord?.dietPlan || {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  // Try to compute calories from food objects (if present)
  const nutritionSummary = useMemo(() => {
    const sections = ["breakfast", "lunch", "dinner"];
    let totalCalories = 0;
    const perMeal = {};

    sections.forEach((meal) => {
      const items = Array.isArray(dietPlan[meal]) ? dietPlan[meal] : [];
      const mealCalories = items.reduce((sum, item) => {
        const raw = item["Calories (per 100g)"] ?? item.calories ?? 0;
        const n = Number(raw);
        return Number.isFinite(n) ? sum + n : sum;
      }, 0);
      perMeal[meal] = {
        count: items.length,
        calories: mealCalories,
      };
      totalCalories += mealCalories;
    });

    return { totalCalories, perMeal };
  }, [dietPlan]);

  const formatDateTime = (val) => {
    if (!val) return "-";
    const d = new Date(val);
    return d.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const hasDiet =
    (dietPlan.breakfast?.length || 0) +
      (dietPlan.lunch?.length || 0) +
      (dietPlan.dinner?.length || 0) >
    0;

  // ---- UI ----
  if (loading && !profile && !primaryRecord) {
    return (
      <div className="w-full py-10 text-center text-gray-600">
        Loading your wellness hub…
      </div>
    );
  }

  if (errorMsg && !profile) {
    return (
      <div className="w-full py-10 text-center text-red-600 text-sm">
        {errorMsg}
      </div>
    );
  }

  return (
    <div className="w-full">
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

            {nextAppointment ? (
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-medium">Next appointment:</span>{" "}
                {formatDateTime(nextAppointment.date)}{" "}
                {nextAppointment.doctor?.fullName
                  ? `· with ${nextAppointment.doctor.fullName}`
                  : ""}
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                No upcoming appointment yet. Stay consistent with your
                routine, and book a follow-up when needed.
              </p>
            )}
          </div>

          <div className="border rounded-xl p-4 bg-white shadow-sm text-center min-w-[180px]">
            <p className="text-sm text-gray-600">Prakriti</p>
            <p className="text-lg font-semibold text-green-700">
              {prakritiLabel}
            </p>
            <p className="text-xs text-gray-500">
              Current State: {currentStateLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
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
          <p className="text-sm text-gray-600">
            View your nutrition & progress
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-xl">🍎</span>
          </div>
          <h3 className="font-semibold text-gray-800 mt-3">Diet Plans</h3>
          <p className="text-sm text-gray-600">
            Personalized recommendations from your doctor
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-xl">📅</span>
          </div>
          <h3 className="font-semibold text-gray-800 mt-3">Sessions</h3>
          <p className="text-sm text-gray-600">Book consultations</p>
        </div>
      </div>

      {/* Doctor + Nutrition Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Doctor */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">
            Your Ayurvedic Doctor
          </h2>

          {doctorInfo ? (
            <div className="bg-white rounded-xl p-4 border shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  🧑‍⚕️
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {doctorInfo.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {doctorInfo.email || "Ayurvedic practitioner"}
                  </p>
                  {doctorInfo.phone && (
                    <p className="text-xs text-blue-600">
                      {doctorInfo.phone}
                    </p>
                  )}
                </div>
              </div>

              <Button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Book Consultation
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4 border shadow-sm text-sm text-gray-600">
              No doctor has been assigned to you yet. Once a practitioner
              adds you to their panel, you&apos;ll see their details here.
            </div>
          )}
        </div>

        {/* Nutrition Overview (from diet plan) */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">
            Today&apos;s Nutrition Overview
          </h2>

          {!hasDiet ? (
            <div className="bg-white p-4 rounded-xl shadow-sm border text-sm text-gray-600">
              Your doctor hasn&apos;t assigned a diet plan yet. Once a diet
              is created, you&apos;ll see your meals and summary here.
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              {/* Calories summary (rough, based on food data) */}
              <p className="font-medium text-gray-800 mb-1">Calories</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (nutritionSummary.totalCalories / 2000) * 100 || 5
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-right text-sm mt-1">
                {nutritionSummary.totalCalories || 0} / 2000 (approx.)
              </p>

              {/* Per meal summary */}
              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                {["breakfast", "lunch", "dinner"].map((meal) => {
                  const label =
                    meal === "breakfast"
                      ? "Breakfast"
                      : meal === "lunch"
                      ? "Lunch"
                      : "Dinner";
                  const info = nutritionSummary.perMeal[meal] || {
                    count: 0,
                    calories: 0,
                  };
                  return (
                    <div key={meal}>
                      <p className="font-medium text-gray-800 mb-1">
                        {label}
                      </p>
                      <p className="text-xs text-gray-600">
                        {info.count} items · {info.calories} cal
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Diet details + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Diet Plan Details */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">
              Your Current Diet Plan
            </h2>
          </div>

          {!hasDiet ? (
            <div className="bg-white border rounded-xl shadow-sm p-4 text-sm text-gray-600">
              No diet items added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {["breakfast", "lunch", "dinner"].map((meal) => {
                const label =
                  meal === "breakfast"
                    ? "Breakfast"
                    : meal === "lunch"
                    ? "Lunch"
                    : "Dinner";
                const items = Array.isArray(dietPlan[meal])
                  ? dietPlan[meal]
                  : [];
                return (
                  <div
                    key={meal}
                    className="bg-white border rounded-xl shadow-sm p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-800">{label}</p>
                      <span className="text-xs text-gray-500">
                        {items.length} item(s)
                      </span>
                    </div>

                    {items.length === 0 ? (
                      <p className="text-xs text-gray-500">
                        No items assigned for {label.toLowerCase()}.
                      </p>
                    ) : (
                      <ul className="space-y-1 text-sm text-gray-700">
                        {items.map((it, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center"
                          >
                            <span>
                              {it["Food Item"] ||
                                it.name ||
                                it.title ||
                                "Food item"}
                            </span>
                            {it["Calories (per 100g)"] && (
                              <span className="text-xs text-gray-500">
                                {it["Calories (per 100g)"]} cal
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ayurvedic Recommendations (still mostly static, can later be AI/personalized) */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">
            Ayurvedic Recommendations
          </h2>

          {primaryRecord?.lifestyleNotes && (
            <div className="bg-white border rounded-xl shadow-sm p-4 mb-3">
              <p className="font-medium text-gray-800 flex items-center space-x-2 text-lg">
                <span>🧾</span>
                <span>Your Doctor&apos;s Notes</span>
              </p>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                {primaryRecord.lifestyleNotes}
              </p>
            </div>
          )}

          {[
            {
              icon: "🌅",
              title: "Morning Routine",
              text:
                "Start your day with warm water and gentle movement. " +
                "Follow any specific guidance shared by your practitioner.",
            },
            {
              icon: "🥗",
              title: "Diet Tip",
              text:
                primaryRecord?.dietPreferences
                  ? `Keep your meals aligned with your preference: ${primaryRecord.dietPreferences}. Avoid overeating and keep regular meal timings.`
                  : "Favour freshly cooked, warm, lightly spiced meals. Avoid heavy, overly oily or very cold foods.",
            },
            {
              icon: "🧘‍♂️",
              title: "Mindfulness",
              text:
                "Practice slow, mindful eating. Sit down, avoid screens, and chew thoroughly to support digestion (Agni).",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl shadow-sm p-4 mb-3"
            >
              <p className="font-medium text-gray-800 flex items-center space-x-2 text-lg">
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </p>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

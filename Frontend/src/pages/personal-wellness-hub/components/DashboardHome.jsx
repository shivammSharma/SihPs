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
  const [appointments, setAppointments] = useState([]);


  // ⭐ REQUIRED FOR MODAL (your missing variable)
  const [selectedReport, setSelectedReport] = useState(null);

  // =========================================================
  // FETCH PATIENT OVERVIEW
  // =========================================================
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
        console.log("🔍 OVERVIEW DATA:", data);

        const primary =
          data.primaryRecord ||
          data.latestRecord ||
          data.record ||
          null;

        setProfile(data.profile || null);
        setPrimaryRecord(primary);
        setNextAppointment(data.nextAppointment || null);
        setAppointments(data.appointments || []);

      } catch (err) {
        console.error("Patient dashboard error:", err);
        setErrorMsg(err.message || "Failed to load your dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  // =========================================================
  // HELPERS
  // =========================================================

  const patientName = useMemo(() => {
    if (profile?.fullName) return profile.fullName;
    return "AyurNutri User";
  }, [profile]);

  const prakritiLabel = primaryRecord?.dosha || "Not assessed yet";
  const currentStateLabel = primaryRecord?.status || "No active clinical record";

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

  const nutritionSummary = useMemo(() => {
    const meals = ["breakfast", "lunch", "dinner"];
    let total = 0;
    const perMeal = {};

    meals.forEach((m) => {
      const items = dietPlan[m] || [];
      const cal = items.reduce((sum, item) => {
        const raw = item.nutritionPerServing?.caloriesKcal || 0;
        return sum + (Number(raw) || 0);
      }, 0);
      total += cal;
      perMeal[m] = { count: items.length, calories: cal };
    });

    return { totalCalories: total, perMeal };
  }, [dietPlan]);

  const hasDiet =
    (dietPlan.breakfast?.length || 0) +
    (dietPlan.lunch?.length || 0) +
    (dietPlan.dinner?.length || 0) >
    0;

  const formatDateTime = (val) => {
    if (!val) return "-";
    return new Date(val).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =========================================================
  // LOADING / ERROR UI
  // =========================================================

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

  // =========================================================
  // MAIN DASHBOARD UI
  // =========================================================
  return (
    <div className="w-full">

      {/* HEADER SECTION */}
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
                {nextAppointment.doctor?.fullName &&
                  `· with ${nextAppointment.doctor.fullName}`}
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                No upcoming appointment yet.
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

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
        {[
          { icon: "📷", title: "Scan Food", desc: "Analyze meals" },
          { icon: "📊", title: "Analytics", desc: "Track your progress" },
          { icon: "🍎", title: "Diet Plans", desc: "Doctor's meal guidance" },
          { icon: "📅", title: "Sessions", desc: "Book consultations" },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <span className="text-xl">{card.icon}</span>
            </div>
            <h3 className="font-semibold text-gray-800">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* DOCTOR + NUTRITION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* DOCTOR INFO CARD */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">Your Ayurvedic Doctor</h2>

          {doctorInfo ? (
            <div className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  🧑‍⚕️
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {doctorInfo.name}
                  </h3>
                  <p className="text-sm text-gray-600">{doctorInfo.email}</p>
                  {doctorInfo.phone && (
                    <p className="text-xs text-blue-600">{doctorInfo.phone}</p>
                  )}
                </div>
              </div>

              <Button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Book Consultation
              </Button>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl border shadow-sm text-gray-600 text-sm">
              No doctor assigned yet.
            </div>
          )}
        </div>

        {/* NUTRITION OVERVIEW */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">

          <h2 className="font-semibold text-gray-800 mb-3">
            Today's Nutrition Overview
          </h2>

          {!hasDiet ? (
            <div className="bg-white p-4 rounded-xl border shadow-sm text-sm text-gray-600">
              No diet plan assigned yet.
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="font-medium text-gray-800 mb-1">Calories</p>

              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-orange-500 h-3 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (nutritionSummary.totalCalories / 2000) * 100
                    )}%`,
                  }}
                ></div>
              </div>

              <p className="text-right text-sm mt-1">
                {nutritionSummary.totalCalories} / 2000 kcal
              </p>

              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <div key={meal}>
                    <p className="font-medium text-gray-800">
                      {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {nutritionSummary.perMeal[meal].count} items ·{" "}
                      {nutritionSummary.perMeal[meal].calories} cal
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DIET + CLINICAL REPORTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

        {/* DIET DETAILS */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Your Current Diet Plan</h2>

          {!hasDiet ? (
            <div className="bg-white p-4 rounded-xl border shadow-sm text-sm text-gray-600">
              No diet items added yet.
            </div>
          ) : (
            ["breakfast", "lunch", "dinner"].map((meal) => {
              const items = dietPlan[meal] || [];

              return (
                <div key={meal} className="bg-white p-4 rounded-xl border shadow-sm mb-4">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-gray-800">
                      {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </p>
                    <p className="text-xs text-gray-500">{items.length} item(s)</p>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-xs text-gray-500">No items for this meal.</p>
                  ) : (
                    <ul className="text-sm space-y-1">
                      {items.map((food, i) => (
                        <li
                          key={i}
                          className="flex justify-between text-gray-700"
                        >
                          {food.name || food.title}
                          {food.nutritionPerServing?.caloriesKcal && (
                            <span className="text-xs text-gray-500">
                              {food.nutritionPerServing.caloriesKcal} kcal
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* CLINICAL REPORTS */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">

          <h2 className="font-semibold text-gray-800 mb-3">
            Medical Reports & Prescriptions
          </h2>

          {!primaryRecord?.clinicalReports?.length ? (
            <div className="bg-white border rounded-xl shadow-sm p-4 text-sm text-gray-600">
              No consultation notes available yet.
            </div>
          ) : (
            primaryRecord.clinicalReports.map((rep, idx) => (
              <div
                key={rep._id || idx}
                className="bg-white border rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition mb-4"
              >
                <div className="flex justify-between">
                  <p className="font-semibold text-gray-800">
                    {rep.title || `Visit ${idx + 1}`}
                  </p>

                  <span className="text-xs text-gray-500">
                    {new Date(rep.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {rep.summary || "Tap to view details"}
                </p>

                <button
                  onClick={() => setSelectedReport(rep)}
                  className="text-green-700 underline text-sm mt-2"
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {/* -----------------------------------------------------------
   📌 FULL-WIDTH HEALTH TIMELINE (Appointments + Reports)
------------------------------------------------------------ */}
<div className="mt-12 bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
    Your Health Timeline
  </h2>

  {/* Build unified timeline */}
  {(() => {
    const reports = primaryRecord?.clinicalReports || [];
    const appts = appointments || [];

    const combined = [
      ...reports.map((r) => ({
        type: "report",
        date: r.createdAt,
        title: r.title || "Clinical Report",
        description: r.summary || r.diagnosis || "Doctor’s note added",
        data: r,
      })),
      ...appts.map((a) => ({
        type: "appointment",
        date: a.createdAt,
        title: a.condition || "Appointment",
        description: `Consultation with doctor`,
        data: a,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)); // latest first

    if (combined.length === 0) {
      return (
        <p className="text-gray-600 bg-white p-4 rounded-xl border shadow-sm">
          No medical activity recorded yet.
        </p>
      );
    }

    return (
      <div className="relative border-l-2 border-green-600 pl-6 space-y-8">
        {combined.map((event, i) => (
          <div key={i} className="relative">
            {/* Dot */}
            <div className="absolute -left-[11px] w-5 h-5 bg-green-600 rounded-full border-2 border-white"></div>

            {/* Content */}
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="text-xs text-gray-500">
                {new Date(event.date).toLocaleString()}
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-1 flex items-center gap-2">
                {event.type === "report" ? "📝" : "📅"} {event.title}
              </h3>

              <p className="text-sm text-gray-600 mt-1">{event.description}</p>

              {/* View button for reports */}
              {event.type === "report" && (
                <button
                  onClick={() => setSelectedReport(event.data)}
                  className="text-green-700 underline text-sm mt-2"
                >
                  View Report
                </button>
              )}

              {/* For appointments (future extensions) */}
              {event.type === "appointment" && (
                <p className="text-sm text-blue-700 mt-2">
                  Appointment booked
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  })()}
</div>


      {/* REPORT POPUP MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-xl w-full relative">

            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setSelectedReport(null)}
            >
              ✖
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedReport.title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {new Date(selectedReport.createdAt).toLocaleString()}
            </p>

            <div className="mt-4 space-y-3 text-gray-700 text-sm">

              {selectedReport.diagnosis && (
                <div>
                  <p className="font-medium text-gray-800">Diagnosis</p>
                  <p>{selectedReport.diagnosis}</p>
                </div>
              )}

              {selectedReport.notes && (
                <div>
                  <p className="font-medium text-gray-800">Notes</p>
                  <p className="whitespace-pre-line">{selectedReport.notes}</p>
                </div>
              )}

              {selectedReport.testsRecommended && (
                <div>
                  <p className="font-medium text-gray-800">Tests Recommended</p>
                  <p>{selectedReport.testsRecommended}</p>
                </div>
              )}

              {selectedReport.plan && (
                <div>
                  <p className="font-medium text-gray-800">Treatment Plan</p>
                  <p className="whitespace-pre-line">{selectedReport.plan}</p>
                </div>
              )}
            </div>

            {/* DOWNLOAD BUTTON */}
            <button
              className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={() => downloadReport(selectedReport)}
            >
              Download Prescription
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================
// DOWNLOAD TXT REPORT (CAN BE UPGRADED TO PDF LATER)
// =========================================================

function downloadReport(rep) {
  const content = `
📄 Ayurvedic Consultation Report
--------------------------------------
Title: ${rep.title}
Date: ${new Date(rep.createdAt).toLocaleString()}

Diagnosis:
${rep.diagnosis || "-"}

Notes:
${rep.notes || "-"}

Tests Recommended:
${rep.testsRecommended || "-"}

Treatment / Plan:
${rep.plan || "-"}

Follow-up Date:
${rep.followUpDate ? new Date(rep.followUpDate).toLocaleDateString() : "-"}
`;

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${rep.title || "prescription"}.txt`;
  a.click();

  URL.revokeObjectURL(url);
}

export default DashboardHome;

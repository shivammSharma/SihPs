import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import PatientWeekPlan from "./PatientWeekPlan";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const DashboardHome = () => {
  const { token, user } = useAuth();

  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState("");

  const [clinicalPatientId, setClinicalPatientId] = useState(null);
  const [latestPlanId, setLatestPlanId] = useState(null);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [weeklyError, setWeeklyError] = useState("");

  // 1) Fetch overview
  useEffect(() => {
    if (!token) return;

    const fetchOverview = async () => {
      try {
        setOverviewLoading(true);
        setOverviewError("");

        const res = await fetch(`${API_BASE}/api/patient/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => null);
        console.log("DEBUG: /api/patient/overview response:", data);

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load overview");
        }

        setOverview(data);
      } catch (e) {
        console.error("Overview error:", e);
        setOverviewError(e.message || "Failed to load your dashboard");
      } finally {
        setOverviewLoading(false);
      }
    };

    fetchOverview();
  }, [token]);

  const profile = overview?.profile;
  const latestRecord = overview?.latestRecord || null;
  const doctor =
    overview?.nextAppointment?.doctor || latestRecord?.doctorId || null;
  const diet = latestRecord?.dietPlan || {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  // 2) Fetch weekly plans once we know clinical patient id
  useEffect(() => {
    if (!token) return;
    if (!latestRecord?._id) {
      setClinicalPatientId(null);
      setLatestPlanId(null);
      return;
    }

    const cpId = latestRecord._id;
    setClinicalPatientId(cpId);

    const fetchWeeklyPlans = async () => {
      try {
        setWeeklyLoading(true);
        setWeeklyError("");

        const res = await fetch(
          `${API_BASE}/api/patients/${cpId}/week-plans`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const body = await res.json().catch(() => null);
        console.log(
          `DEBUG: /api/patients/${cpId}/week-plans response:`,
          body
        );

        if (!res.ok) {
          throw new Error(body?.message || "Failed to load weekly plans");
        }

        const plans = body.weeklyPlans || [];
        if (!plans.length) {
          setLatestPlanId(null);
          return;
        }

        plans.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime()
        );
        setLatestPlanId(plans[0]._id);
      } catch (e) {
        console.error("Weekly plans error:", e);
        setWeeklyError(e.message || "Failed to load weekly plan");
      } finally {
        setWeeklyLoading(false);
      }
    };

    fetchWeeklyPlans();
  }, [token, latestRecord?._id]);

  if (overviewLoading && !overview) {
    return (
      <div className="w-full p-6 text-sm text-gray-600">
        Loading your wellness hub…
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-[#E8E2D9] p-6 rounded-xl shadow-sm mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Namaste, {profile?.fullName || user?.fullName || "Friend"}! 🙏
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome to your Ayurvedic wellness journey.
            </p>
            {latestRecord?.dosha && (
              <p className="text-xs text-gray-500 mt-1">
                Current dosha focus: <b>{latestRecord.dosha}</b>
              </p>
            )}
          </div>

          <div className="border rounded-xl p-4 bg-white shadow-sm text-center">
            <p className="text-sm text-gray-600">Prakriti</p>
            <p className="text-lg font-semibold text-green-700">
              {latestRecord?.dosha || "—"}
            </p>
            <p className="text-xs text-gray-500">
              {latestRecord?.status
                ? `Status: ${latestRecord.status}`
                : "Awaiting doctor assessment"}
            </p>
          </div>
        </div>
      </div>

      {/* Doctor + Today’s diet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Doctor card */}
        <div className="bg-white border rounded-xl shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">
            Your Ayurvedic Doctor
          </h2>
          {doctor ? (
            <>
              <p className="text-sm text-gray-800">{doctor.fullName}</p>
              <p className="text-xs text-gray-500">{doctor.email}</p>
              {doctor.phoneNumber && (
                <p className="text-xs text-gray-500">
                  {doctor.phoneNumber}
                </p>
              )}
            </>
          ) : (
            <p className="text-xs text-gray-500">
              No doctor linked yet. Please contact your clinic.
            </p>
          )}
        </div>

        {/* Today's diet summary */}
        <div className="bg-white border rounded-xl shadow-sm p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">
            Today&apos;s Diet Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {["breakfast", "lunch", "dinner"].map((meal) => (
              <div key={meal} className="border rounded-lg p-3 bg-[#FAF5EE]">
                <div className="font-semibold capitalize mb-1">
                  {meal}
                </div>
                <ul className="space-y-1">
                  {diet[meal] && diet[meal].length > 0 ? (
                    diet[meal].map((item, idx) => (
                      <li key={idx} className="text-gray-700">
                        {item["Food Item"] ||
                          item.name ||
                          "Food item"}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic">
                      No items assigned.
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly plan */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Weekly Diet & Exercise Plan
        </h2>

        {weeklyLoading && (
          <div className="text-sm text-gray-600">
            Loading weekly plan…
          </div>
        )}

        {!weeklyLoading && weeklyError && (
          <div className="text-sm text-red-600">{weeklyError}</div>
        )}

        {!weeklyLoading &&
          !weeklyError &&
          clinicalPatientId &&
          latestPlanId && (
            <PatientWeekPlan
              patientId={clinicalPatientId}
              planId={latestPlanId}
            />
          )}

        {!weeklyLoading &&
          !weeklyError &&
          clinicalPatientId &&
          !latestPlanId && (
            <div className="text-sm text-gray-500">
              Your doctor has not assigned a weekly plan yet.
            </div>
          )}

        {!clinicalPatientId && (
          <div className="text-sm text-gray-500">
            Your account is not yet linked to a clinical record. Weekly
            plans will appear here once your doctor adds you.
          </div>
        )}
      </div>

      {overviewError && (
        <div className="mt-4 text-sm text-red-600">{overviewError}</div>
      )}
    </div>
  );
};

export default DashboardHome;

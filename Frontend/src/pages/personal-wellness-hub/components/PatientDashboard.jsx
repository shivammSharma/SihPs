import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";


const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const PatientDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // optional: read currentUser from localStorage for greeting
  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const token = localStorage.getItem("authToken");
        if (!token) {
          setErrorMsg("Please sign in to view your dashboard.");
          return;
        }

        const res = await api.get("/api/patient/overview", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOverview(res.data);
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

  const profile = overview?.profile || {};
  const appointments = overview?.appointments || [];
  const nextAppointment = overview?.nextAppointment || null;
  const latestRecord = overview?.latestRecord || null;

  const healthSummary = useMemo(() => {
    if (!latestRecord) return null;
    return {
      bmi: latestRecord.bmi,
      heightCm: latestRecord.heightCm,
      weightKg: latestRecord.weightKg,
      bloodPressure: latestRecord.bloodPressure,
      heartRate: latestRecord.heartRate,
      chronicConditions: latestRecord.chronicConditions,
      allergies: latestRecord.allergies,
    };
  }, [latestRecord]);

  const getGreetingName = () => {
    return (
      currentUser?.fullName ||
      profile?.fullName ||
      currentUser?.name ||
      "there"
    );
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    return d.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .filter(
        (a) => a.nextAppointment && new Date(a.nextAppointment) >= now
      )
      .sort(
        (a, b) =>
          new Date(a.nextAppointment) - new Date(b.nextAppointment)
      );
  }, [appointments]);

  const pastAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .filter(
        (a) => a.nextAppointment && new Date(a.nextAppointment) < now
      )
      .sort(
        (a, b) =>
          new Date(b.nextAppointment) - new Date(a.nextAppointment)
      );
  }, [appointments]);

  return (
    <div className="min-h-screen bg-[#fdf7ee] bg-gradient-to-b from-[#fdf7ee] via-[#f6f0e5] to-[#f3ecdf]">
      {/* Top spacing / could be navbar area */}
      <div className="h-20" />

      <main className="max-w-6xl mx-auto px-4 pb-10 space-y-6">
        {/* Header */}
        <section className="bg-white/80 backdrop-blur-xl border border-emerald-900/5 rounded-3xl shadow-md p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-700/80 font-semibold mb-1">
                Personal Wellness Hub
              </p>
              <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#1f2933] mb-1">
                Namaste,{" "}
                <span className="text-emerald-700">
                  {getGreetingName()}
                </span>
              </h1>
              <p className="text-sm text-[#4b5563]">
                Track your Ayurvedic journey, upcoming sessions, and
                health profile in one place.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                <Icon name="Mail" size={16} className="text-emerald-700" />
                <span>{profile?.email || currentUser?.email || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                <Icon
                  name="Phone"
                  size={16}
                  className="text-emerald-700"
                />
                <span>
                  {profile?.phoneNumber ||
                    currentUser?.phoneNumber ||
                    "-"}
                </span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errorMsg}
            </div>
          )}
        </section>

        {/* Grid: Health summary + Next appointment */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Health Summary */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl border border-emerald-900/5 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-[#111827]">
                Health Summary
              </h2>
            </div>

            {!latestRecord && (
              <p className="text-sm text-[#6b7280]">
                Your doctor hasn&apos;t added detailed health records yet.
                Once they do, your profile will appear here.
              </p>
            )}

            {latestRecord && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100">
                  <div className="text-[11px] uppercase tracking-wide text-emerald-700 font-semibold">
                    BMI
                  </div>
                  <div className="text-xl font-semibold text-emerald-900">
                    {healthSummary?.bmi ?? "-"}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-100">
                  <div className="text-[11px] uppercase tracking-wide text-amber-700 font-semibold">
                    Height / Weight
                  </div>
                  <div className="text-sm text-amber-900">
                    {healthSummary?.heightCm || "-"} cm •{" "}
                    {healthSummary?.weightKg || "-"} kg
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-sky-50/80 border border-sky-100">
                  <div className="text-[11px] uppercase tracking-wide text-sky-700 font-semibold">
                    Blood Pressure
                  </div>
                  <div className="text-sm text-sky-900">
                    {healthSummary?.bloodPressure || "-"}
                  </div>
                  <div className="text-[11px] text-sky-700 mt-1">
                    HR: {healthSummary?.heartRate || "-"} bpm
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-[11px] uppercase tracking-wide text-slate-600 font-semibold mb-1">
                      Chronic Conditions
                    </div>
                    <div className="text-xs text-slate-700 whitespace-pre-line">
                      {healthSummary?.chronicConditions || "None noted"}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-[11px] uppercase tracking-wide text-slate-600 font-semibold mb-1">
                      Allergies
                    </div>
                    <div className="text-xs text-slate-700 whitespace-pre-line">
                      {healthSummary?.allergies || "None noted"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Next Appointment */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-emerald-900/5 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-[#111827]">
                  Next Appointment
                </h2>
                <Icon
                  name="Calendar"
                  size={18}
                  className="text-emerald-700"
                />
              </div>

              {!nextAppointment && (
                <p className="text-sm text-[#6b7280]">
                  You don&apos;t have any upcoming appointment scheduled.
                  Please contact your doctor if needed.
                </p>
              )}

              {nextAppointment && (
                <div className="space-y-2 text-sm">
                  <div className="text-emerald-800 font-semibold">
                    {formatDateTime(nextAppointment.nextAppointment)}
                  </div>
                  <div className="text-[#374151]">
                    {nextAppointment.condition || "General consultation"}
                  </div>
                  <div className="text-xs text-[#6b7280] mt-1">
                    With{" "}
                    <span className="font-semibold text-emerald-800">
                      {nextAppointment.doctorId?.fullName ||
                        "Your doctor"}
                    </span>
                    <br />
                    {nextAppointment.doctorId?.email}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Appointments list */}
        <section className="bg-white/80 backdrop-blur-xl rounded-3xl border border-emerald-900/5 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[#111827]">
              Your Appointments
            </h2>
          </div>

          {loading && (
            <p className="text-sm text-[#6b7280]">Loading…</p>
          )}

          {!loading && appointments.length === 0 && (
            <p className="text-sm text-[#6b7280]">
              No appointments found yet.
            </p>
          )}

          {!loading && appointments.length > 0 && (
            <div className="space-y-4">
              {upcomingAppointments.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-wide text-emerald-800 font-semibold mb-2">
                    Upcoming
                  </h3>
                  <div className="space-y-2">
                    {upcomingAppointments.map((a) => (
                      <div
                        key={a._id}
                        className="p-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 flex items-center justify-between text-sm"
                      >
                        <div>
                          <div className="font-semibold text-emerald-900">
                            {formatDateTime(a.nextAppointment)}
                          </div>
                          <div className="text-[#374151]">
                            {a.condition || "Consultation"}
                          </div>
                          <div className="text-xs text-[#6b7280] mt-1">
                            With{" "}
                            <span className="font-medium">
                              {a.doctorId?.fullName || "Doctor"}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] px-2 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800">
                          {a.status || "scheduled"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pastAppointments.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-wide text-slate-600 font-semibold mb-2 mt-3">
                    Past
                  </h3>
                  <div className="space-y-2">
                    {pastAppointments.map((a) => (
                      <div
                        key={a._id}
                        className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between text-sm"
                      >
                        <div>
                          <div className="font-medium text-slate-900">
                            {formatDateTime(a.nextAppointment)}
                          </div>
                          <div className="text-[#374151]">
                            {a.condition || "Consultation"}
                          </div>
                          <div className="text-xs text-[#6b7280] mt-1">
                            With {a.doctorId?.fullName || "Doctor"}
                          </div>
                        </div>
                        <span className="text-[11px] px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
                          {a.status || "completed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;

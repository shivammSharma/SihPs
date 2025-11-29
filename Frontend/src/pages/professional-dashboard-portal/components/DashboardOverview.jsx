// src/pages/professional-dashboard-portal/components/DashboardOverview.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Icon from "../../../components/AppIcon";
import useAuth from "../../../hooks/useAuth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const DashboardOverview = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  // axios instance for this component
  const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Not authenticated. Please log in as a doctor.");
          setPatients([]);
          return;
        }

        const res = await api.get("/api/patients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPatients(res.data || []);
      } catch (err) {
        console.error("Failed to load patients", err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load patients";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: same-day comparison
  const isSameDay = (dateA, dateB) => {
    if (!dateA || !dateB) return false;
    const a = new Date(dateA);
    const b = new Date(dateB);
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const { todayStats, todaysAppointments, recentActivities } = useMemo(() => {
    const now = new Date();
    const stats = {
      appointments: 0,
      pendingReviews: 0,
      progressAlerts: 0,
      newPatients: 0,
    };

    const todays = [];
    const activities = [];

    patients.forEach((p) => {
      const createdAt = p.createdAt ? new Date(p.createdAt) : null;
      const updatedAt = p.updatedAt ? new Date(p.updatedAt) : null;

      // Today’s appointments
      if (p.nextAppointment && isSameDay(p.nextAppointment, now)) {
        stats.appointments += 1;
        const nextDate = new Date(p.nextAppointment);

        todays.push({
          id: p._id || p.id,
          patient: p.name,
          timeISO: p.nextAppointment,
          timeLabel: nextDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: p.type || "Follow-up",
          dosha: p.dosha || "",
          condition: p.condition || "",
          nextAppointmentDate: nextDate,
        });
      }

      // Pending reviews (you can adjust this rule)
      if (String(p.status).toLowerCase() === "followup") {
        stats.pendingReviews += 1;
      }

      // Progress alerts (low progress)
      if (typeof p.progress === "number" && p.progress < 30) {
        stats.progressAlerts += 1;
      }

      // New patients: status 'new' or created in last 7 days
      const daysSinceCreated = createdAt
        ? (now - createdAt) / (1000 * 60 * 60 * 24)
        : 999;

      if (String(p.status).toLowerCase() === "new" || daysSinceCreated <= 7) {
        stats.newPatients += 1;
      }

      // Recent activity feed
      if (createdAt && now - createdAt <= 1000 * 60 * 60 * 24 * 7) {
        activities.push({
          id: `new-${p._id || p.id}`,
          type: "new",
          patient: p.name,
          action: "New patient registered",
          timeLabel: createdAt.toLocaleString(),
          dosha: p.dosha || "",
          when: createdAt,
        });
      } else if (
        updatedAt &&
        (now - updatedAt) / (1000 * 60 * 60 * 24) <= 7
      ) {
        activities.push({
          id: `upd-${p._id || p.id}`,
          type: "update",
          patient: p.name,
          action: "Profile updated",
          timeLabel: updatedAt.toLocaleString(),
          dosha: p.dosha || "",
          when: updatedAt,
        });
      }
    });

    // Sort / trim results
    todays.sort((a, b) => a.nextAppointmentDate - b.nextAppointmentDate);
    activities.sort((a, b) => b.when - a.when);
    const recentTop = activities.slice(0, 5);

    return {
      todayStats: stats,
      todaysAppointments: todays,
      recentActivities: recentTop,
    };
  }, [patients]);

  const quickStats = [
    {
      id: 1,
      title: "Today's Appointments",
      value: todayStats.appointments,
      icon: "Calendar",
      color: "text-primary",
      bgColor: "bg-primary/10",
      chip: "Live schedule",
    },
    {
      id: 2,
      title: "Pending Plan Reviews",
      value: todayStats.pendingReviews,
      icon: "FileText",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      chip: "Needs attention",
    },
    {
      id: 3,
      title: "Progress Alerts",
      value: todayStats.progressAlerts,
      icon: "TrendingUp",
      color: "text-emerald-700",
      bgColor: "bg-emerald-100",
      chip: "Low progress",
    },
    {
      id: 4,
      title: "New Patients",
      value: todayStats.newPatients,
      icon: "UserPlus",
      color: "text-sky-700",
      bgColor: "bg-sky-100",
      chip: "Last 7 days",
    },
  ];

  const getDoctorDisplayName = () => {
    const baseName = user?.fullName || user?.name || "Doctor";
    if (/^dr\.?/i.test(baseName.trim())) return baseName;
    return `Dr. ${baseName}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-emerald-50 via-primary/5 to-emerald-100 organic-shadow">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-200/60 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-emerald-300/40 blur-2xl" />
        <div className="relative p-6 md:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/80 border border-emerald-100 flex items-center justify-center shadow-sm">
              <Icon name="User" size={22} className="text-emerald-700" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-700/80 font-semibold mb-1">
                Professional Dashboard
              </p>
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-primary mb-1">
                Welcome back, {getDoctorDisplayName()}
              </h2>
              <p className="text-sm text-text-secondary">
                {loading ? (
                  <span>Loading your patients and appointments…</span>
                ) : (
                  <>
                    You have{" "}
                    <span className="font-semibold text-emerald-700">
                      {todayStats.appointments}
                    </span>{" "}
                    appointment{todayStats.appointments === 1 ? "" : "s"}{" "}
                    scheduled today.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 text-xs">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-emerald-100 shadow-sm">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-emerald-800">
                Clinic overview in real-time
              </span>
            </div>
            <div className="text-[11px] text-text-secondary">
              Last refreshed: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((s) => (
          <div
            key={s.id}
            className="group p-4 rounded-xl border border-border bg-card organic-shadow-sm flex flex-col justify-between hover:-translate-y-0.5 hover:border-emerald-500/70 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] uppercase tracking-wide text-text-secondary">
                    {s.title}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <div className="text-2xl font-semibold text-text-primary">
                    {s.value ?? 0}
                  </div>
                </div>
              </div>
              <div
                className={`rounded-2xl p-2 ${s.bgColor} flex items-center justify-center`}
              >
                <Icon
                  name={s.icon}
                  size={20}
                  className={`${s.color} group-hover:scale-110 transition-transform`}
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-text-secondary">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
                {s.chip}
              </span>
              <span className="italic opacity-80">
                Updated from patient records
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid: Appointments + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Appointments */}
        <div className="bg-card rounded-xl border border-border organic-shadow flex flex-col h-full">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40 rounded-t-xl">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                Today&apos;s Appointments
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Auto-highlighted for the current day
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={20} className="text-text-secondary" />
            </div>
          </div>

          <div className="p-4 space-y-3 flex-1">
            {loading && (
              <div className="flex items-center gap-2 p-3 text-text-secondary text-sm rounded-lg bg-muted/40 border border-dashed border-border">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Loading appointments…</span>
              </div>
            )}

            {!loading && todaysAppointments.length === 0 && (
              <div className="p-4 text-text-secondary text-sm rounded-lg bg-muted/40 border border-dashed border-border">
                No appointments scheduled for today.{" "}
                <span className="italic">
                  New appointments will automatically appear here.
                </span>
              </div>
            )}

            {todaysAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-gradient-to-r from-white via-muted/20 to-emerald-50/40 hover:border-emerald-500/70 organic-transition"
              >
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h4 className="font-medium text-text-primary">
                      {appointment.patient}
                    </h4>
                    {appointment.dosha && (
                      <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
                        {appointment.dosha}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2">
                    {appointment.condition || "No condition specified"}
                  </p>
                </div>
                <div className="text-right ml-3 min-w-[82px]">
                  <p className="text-sm font-semibold text-text-primary">
                    {appointment.timeLabel}
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5 px-2 py-0.5 inline-block rounded-full bg-muted/60">
                    {appointment.type}
                  </p>
                </div>
              </div>
            ))}

            <button
              className="w-full mt-3 p-2 text-sm text-primary hover:bg-primary/5 rounded-lg border border-transparent hover:border-emerald-400/60 organic-transition flex items-center justify-center gap-2"
              onClick={() => console.log("View all appointments clicked")}
            >
              <Icon name="ArrowRight" size={16} className="text-primary" />
              <span>View all appointments</span>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-card rounded-xl border border-border organic-shadow flex flex-col h-full">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40 rounded-t-xl">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                Recent Activities
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Last 7 days of patient updates
              </p>
            </div>
            <Icon name="Clock" size={20} className="text-text-secondary" />
          </div>

          <div className="p-4 space-y-4 flex-1">
            {recentActivities.length === 0 && (
              <div className="text-text-secondary text-sm p-4 rounded-lg bg-muted/40 border border-dashed border-border">
                No recent activities.{" "}
                <span className="italic">
                  New registrations and updates will show up here.
                </span>
              </div>
            )}

            {recentActivities.length > 0 && (
              <div className="relative pl-4">
                <div className="absolute left-[8px] top-0 bottom-0 w-px bg-border" />
                <div className="space-y-3">
                  {recentActivities.map((act, idx) => (
                    <div
                      key={act.id}
                      className="relative flex items-start justify-between gap-3 p-3 rounded-lg border border-border bg-white/70 hover:bg-muted/40 organic-transition"
                    >
                      <div className="absolute -left-[10px] top-4 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-text-primary">
                            {act.patient}
                          </h4>
                          {act.dosha && (
                            <span className="text-[11px] px-2 py-0.5 bg-primary/5 text-primary rounded-full">
                              {act.dosha}
                            </span>
                          )}
                          <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-muted/60 text-text-secondary">
                            {act.type === "new" ? "New" : "Updated"}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary">
                          {act.action}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-text-secondary">
                          {act.timeLabel}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 flex items-start gap-2">
          <Icon name="AlertCircle" size={16} className="mt-0.5 text-red-500" />
          <div>
            <div className="font-medium">Something went wrong</div>
            <div>{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;

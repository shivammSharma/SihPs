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
    },
    {
      id: 2,
      title: "Pending Plan Reviews",
      value: todayStats.pendingReviews,
      icon: "FileText",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      id: 3,
      title: "Progress Alerts",
      value: todayStats.progressAlerts,
      icon: "TrendingUp",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      id: 4,
      title: "New Patients",
      value: todayStats.newPatients,
      icon: "UserPlus",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
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
      <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-6 md:p-7 border border-border organic-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-700/80 font-semibold mb-1">
              Dashboard Overview
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-primary mb-1">
              Welcome back, {getDoctorDisplayName()}
            </h2>
            <p className="text-sm text-text-secondary">
              <b>{loading ? "Loading..." : todayStats.appointments}</b>{" "}
              appointments scheduled today.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl border border-border bg-card organic-shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-text-secondary mb-1">
                  {s.title}
                </div>
                <div className="text-2xl font-semibold">{s.value ?? 0}</div>
              </div>
              <div className={`rounded-full p-2 ${s.bgColor}`}>
                <Icon name={s.icon} size={20} className={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="bg-card rounded-xl border border-border organic-shadow">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            Today&apos;s Appointments
          </h3>
          <Icon name="Calendar" size={20} className="text-text-secondary" />
        </div>

        <div className="p-4 space-y-3">
          {loading && (
            <div className="p-3 text-text-secondary">
              Loading appointments…
            </div>
          )}

          {!loading && todaysAppointments.length === 0 && (
            <div className="p-3 text-text-secondary">
              No appointments for today
            </div>
          )}

          {todaysAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:border-green-700 organic-transition"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-text-primary">
                    {appointment.patient}
                  </h4>
                  {appointment.dosha && (
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {appointment.dosha}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary">
                  {appointment.condition}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">
                  {appointment.timeLabel}
                </p>
                <p className="text-xs text-text-secondary">
                  {appointment.type}
                </p>
              </div>
            </div>
          ))}

          <button
            className="w-full mt-3 p-2 text-sm text-primary hover:bg-primary/5 rounded-lg organic-transition"
            onClick={() => console.log("View all appointments clicked")}
          >
            View All Appointments
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-card rounded-xl border border-border organic-shadow">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            Recent Activities
          </h3>
          <Icon name="Clock" size={20} className="text-text-secondary" />
        </div>

        <div className="p-4 space-y-3">
          {recentActivities.length === 0 && (
            <div className="text-text-secondary">No recent activities</div>
          )}
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border"
            >
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-text-primary">
                    {act.patient}
                  </h4>
                  {act.dosha && (
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {act.dosha}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary">{act.action}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-secondary">
                  {act.timeLabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;

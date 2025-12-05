// src/pages/professional-dashboard-portal/components/DoctorAppointmentsWidget.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import Icon from "../../../components/AppIcon";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const DoctorAppointmentsWidget = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("today"); // "today" | "upcoming" | "all"
  const [updatingId, setUpdatingId] = useState(null);

  const api = axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Normalize any date value to "YYYY-MM-DD"
  const normalizeDate = (val) => {
    if (!val) return "";
    // If it's a Date object
    if (val instanceof Date) {
      const y = val.getFullYear();
      const m = String(val.getMonth() + 1).padStart(2, "0");
      const d = String(val.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    // If it's already a string (e.g. "2025-12-05" or "2025-12-05T00:00:00.000Z")
    const str = String(val);
    return str.slice(0, 10); // "YYYY-MM-DD"
  };

  // Today as "YYYY-MM-DD" in local time
  const getTodayString = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const todayStr = getTodayString();

  // Fetch doctor's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          setError("Not authenticated");
          return;
        }

        const res = await api.get("/api/appointments/doctor/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAppointments(res.data?.appointments || []);
      } catch (err) {
        console.error("DoctorAppointmentsWidget load error:", err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load appointments";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredAppointments = useMemo(() => {
    // 1. Attach normalized date to each
    const withNorm = appointments.map((apt) => {
      const normDate = normalizeDate(apt.date);
      return { ...apt, _normDate: normDate };
    });

    // 2. Filter based on selected tab
    const filtered = withNorm.filter((apt) => {
      const d = apt._normDate;

      if (!d) {
        // If date is missing and filter is strict, hide it
        if (filter === "today" || filter === "upcoming") return false;
        return true; // "all"
      }

      if (filter === "today") {
        // SIMPLE: same string as today
        return d === todayStr;
      }

      if (filter === "upcoming") {
        // All appointments from today onward
        return d >= todayStr;
      }

      // "all"
      return true;
    });

    // 3. Sort by (date, time) as strings
    filtered.sort((a, b) => {
      const da = a._normDate || "";
      const db = b._normDate || "";
      if (da !== db) return da.localeCompare(db);
      const ta = (a.time || "").padStart(5, "0");
      const tb = (b.time || "").padStart(5, "0");
      return ta.localeCompare(tb);
    });

    return filtered;
  }, [appointments, filter, todayStr]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      setError("");

      const res = await api.patch(
        `/api/appointments/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = res.data?.appointment;
      if (updated) {
        setAppointments((prev) =>
          prev.map((apt) => (apt._id === id ? updated : apt))
        );
      }
    } catch (err) {
      console.error("Update appointment status error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to update status";
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border organic-shadow mt-6">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Icon name="Calendar" size={18} className="text-primary" />
            Appointments
          </h3>
          <p className="text-xs text-text-secondary">
            View and manage your sessions
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 text-xs">
          {["today", "upcoming", "all"].map((key) => {
            const label =
              key === "today"
                ? "Today"
                : key === "upcoming"
                ? "Upcoming"
                : "All";

            const active = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-full border text-xs ${
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-text-secondary border-border hover:bg-muted/60"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {loading && (
          <div className="text-sm text-text-secondary">
            Loading appointments…
          </div>
        )}

        {!loading && filteredAppointments.length === 0 && (
          <div className="text-sm text-text-secondary">
            {filter === "today"
              ? "No appointments scheduled for today."
              : filter === "upcoming"
              ? "No upcoming appointments."
              : "No appointments found."}
          </div>
        )}

        {!loading &&
          filteredAppointments.map((apt) => {
            const patientName =
              apt.patientId?.fullName ||
              apt.patientId?.name ||
              "Patient";

            const dateLabel = apt._normDate || "-";
            const timeLabel = apt.time || "-";
            const status = apt.status || "Scheduled";

            return (
              <div
                key={apt._id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:border-primary/70 organic-transition"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-text-primary">
                    {patientName}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {apt.sessionType || "Consultation"}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {dateLabel} · {timeLabel}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary">
                    Status:
                  </span>
                  <select
                    className="text-xs border border-border rounded-md px-2 py-1 bg-background"
                    value={status}
                    disabled={updatingId === apt._id}
                    onChange={(e) =>
                      handleStatusChange(apt._id, e.target.value)
                    }
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            );
          })}

        {error && (
          <div className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2 mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentsWidget;

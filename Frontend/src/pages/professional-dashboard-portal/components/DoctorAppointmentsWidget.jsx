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

  // Reschedule modal state
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");

  const api = axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Normalize any date value to "YYYY-MM-DD"
  const normalizeDate = (val) => {
    if (!val) return "";
    if (val instanceof Date) {
      const y = val.getFullYear();
      const m = String(val.getMonth() + 1).padStart(2, "0");
      const d = String(val.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    const str = String(val);
    return str.slice(0, 10); // handles "2025-12-05" or "2025-12-05T..."
  };

  // Today as "YYYY-MM-DD"
  const getTodayString = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const todayStr = getTodayString();

  // Fetch doctor's appointments once
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

        const list = res.data?.appointments || [];
        console.log("[DoctorAppointmentsWidget] fetched:", list);
        setAppointments(list);
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
    const withNorm = (appointments || []).map((apt) => {
      const normDate = normalizeDate(apt.date);
      return { ...apt, _normDate: normDate };
    });

    const filtered = withNorm.filter((apt) => {
      const d = apt._normDate;

      if (!d) {
        if (filter === "today" || filter === "upcoming") return false;
        return true; // "all"
      }

      if (filter === "today") {
        return d === todayStr;
      }

      if (filter === "upcoming") {
        return d >= todayStr;
      }

      return true;
    });

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
          (prev || []).map((apt) =>
            apt._id === updated._id ? updated : apt
          )
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

  // Open reschedule modal for an appointment
  const openReschedule = (apt) => {
    setActiveAppointment(apt);
    setNewDate(normalizeDate(apt.date)); // pre-fill
    setNewTime(apt.time || "");
    setRescheduleError("");
    setRescheduleOpen(true);
  };

  const closeReschedule = () => {
    setRescheduleOpen(false);
    setActiveAppointment(null);
    setNewDate("");
    setNewTime("");
    setRescheduleError("");
  };

  const handleRescheduleSubmit = async (e) => {
    e?.preventDefault();
    if (!activeAppointment) return;

    try {
      setUpdatingId(activeAppointment._id);
      setRescheduleError("");

      const res = await api.patch(
        `/api/appointments/${activeAppointment._id}/reschedule`,
        { date: newDate, time: newTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = res.data?.appointment;
      if (!updated) {
        throw new Error("No updated appointment returned");
      }

      setAppointments((prev) =>
        (prev || []).map((apt) =>
          apt._id === updated._id ? updated : apt
        )
      );

      closeReschedule();
    } catch (err) {
      console.error("Reschedule error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to reschedule appointment";
      setRescheduleError(msg);
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
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 bg-muted/30 rounded-lg border border-border hover:border-primary/70 organic-transition"
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
                  <div className="flex items-center gap-2">
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

                  <button
                    type="button"
                    className="text-xs px-3 py-1 rounded-md border border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                    onClick={() => openReschedule(apt)}
                  >
                    Reschedule
                  </button>
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

      {/* RESCHEDULE MODAL */}
      {rescheduleOpen && activeAppointment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">
                Reschedule Appointment
              </h4>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800 text-lg"
                onClick={closeReschedule}
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-600">
              {activeAppointment.patientId?.fullName ||
                activeAppointment.patientId?.name ||
                "Patient"}{" "}
              · {activeAppointment.sessionType}
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  New Time
                </label>
                <input
                  type="time"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="text-xs px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={closeReschedule}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    updatingId === activeAppointment._id || loading
                  }
                  className="text-xs px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {updatingId === activeAppointment._id
                    ? "Saving..."
                    : "Save changes"}
                </button>
              </div>
            </form>

            {rescheduleError && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {rescheduleError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentsWidget;
  
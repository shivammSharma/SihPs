// src/pages/professional-dashboard-portal/components/DashboardOverview.jsx

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Icon from "../../../components/AppIcon";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const DashboardOverview = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
  });

  /* ---------------------------------------------------------
      FETCH DOCTOR'S APPOINTMENTS
  --------------------------------------------------------- */
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");
      const doctorId = user?._id || user?.id;

      if (!token || !doctorId) {
        setError("Not authenticated as doctor.");
        return;
      }

      const res = await api.get(`/api/appointments/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(res.data?.appointments || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  /* UTIL TO CHECK TODAY'S DATE */
  const isToday = (dateString) => {
    const today = new Date();
    const [dd, mm, yyyy] = dateString.split("-");
    const d = new Date(`${yyyy}-${mm}-${dd}`);

    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  /* ---------------------------------------------------------
      FILTER ONLY TODAY + PENDING APPOINTMENTS
  --------------------------------------------------------- */
  const todaysAppointments = useMemo(() => {
    return appointments.filter(
      (apt) =>
        apt.date &&
        isToday(apt.date) &&
        apt.status === "Scheduled" // ONLY show not-handled appointments
    );
  }, [appointments]);

  /* ---------------------------------------------------------
      ACCEPT APPOINTMENT
  --------------------------------------------------------- */
  const acceptAppointment = async (apt) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await api.post(
        `/api/appointments/${apt._id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("Appointment accepted & patient added!");

        // Remove from our local UI
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === apt._id ? { ...a, status: "Accepted" } : a
          )
        );
      }
    } catch (err) {
      console.error(err);
      alert("Error accepting appointment");
    }
  };

  /* ---------------------------------------------------------
      REJECT APPOINTMENT
  --------------------------------------------------------- */
  const rejectAppointment = async (apt) => {
    try {
      const token = localStorage.getItem("authToken");

      await api.post(
        `/api/appointments/${apt._id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Appointment rejected");

      setAppointments((prev) =>
        prev.map((a) =>
          a._id === apt._id ? { ...a, status: "Rejected" } : a
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error rejecting appointment");
    }
  };

  /* ---------------------------------------------------------
      OPEN FULL PATIENT PROFILE
  --------------------------------------------------------- */
  const openPatientProfile = (id) => {
    navigate(`/professional-dashboard-portal/patient/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-6 border border-border">
        <h2 className="text-2xl font-display font-semibold text-primary">
          Welcome back, Dr. {user?.fullName}
        </h2>
      </div>

      {/* Today's Appointments */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Today's Appointments</h3>
          <Icon name="Calendar" size={20} />
        </div>

        <div className="p-4 space-y-3">
          {loading && <p>Loading…</p>}

          {!loading && todaysAppointments.length === 0 && (
            <p className="text-text-secondary">No appointments for today</p>
          )}

          {todaysAppointments.map((apt) => (
            <div
              key={apt._id}
              className="p-4 bg-white rounded-lg border hover:border-green-700"
            >
              {/* Top Section */}
              <div
                className="flex justify-between cursor-pointer"
                onClick={() => openPatientProfile(apt.patientId?._id)}
              >
                <div>
                  <h4 className="font-medium">{apt.patientId?.fullName}</h4>
                  <p className="text-xs text-gray-500">{apt.sessionType}</p>
                </div>
                <p className="text-sm font-medium">{apt.time}</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => acceptAppointment(apt)}
                  className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                >
                  Accept
                </button>

                <button
                  onClick={() => rejectAppointment(apt)}
                  className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;

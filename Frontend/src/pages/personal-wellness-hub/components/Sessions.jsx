import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingModal from "./BookingModal";
import useAuth from "../../../hooks/useAuth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const SessionCard = ({ title, price, desc, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`p-5 rounded-xl shadow-sm border transition-all cursor-pointer 
      ${
        selected
          ? "border-emerald-600 bg-emerald-50 shadow-md"
          : "border-gray-300 bg-white hover:shadow-md"
      }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-[1.05rem]">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      <div className="text-emerald-700 text-lg font-bold">{price}</div>
    </div>
  </div>
);

const Sessions = () => {
  const { user, token } = useAuth();

  const [selected, setSelected] = useState("Initial Consultation");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("book");
  const [loading, setLoading] = useState(false);

  const types = [
    {
      title: "Initial Consultation",
      price: "₹500",
      desc: "Detailed assessment for first-time patients",
    },
    {
      title: "Follow-up Session",
      price: "₹300",
      desc: "Review progress and update plan",
    },
    {
      title: "Emergency Consultation",
      price: "₹800",
      desc: "Urgent health concern (same day)",
    },
  ];


const formatDate = (val) => {
  if (!val) return "";

  // If already ISO format, keep it as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;

  // Otherwise assume DD-MM-YYYY
  const [dd, mm, yyyy] = val.split("-");
  return `${yyyy}-${mm}-${dd}`;
};

  // Helper: axios instance with auth header
  const api = axios.create({
    baseURL: API_BASE,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1) Fetch doctors (you must have /api/doctors defined on backend)
        const resDocs = await api.get("/api/doctors");
        setDoctors(resDocs.data || []);

        // 2) Fetch appointments for logged-in patient
        const patientId = user?.id;
        if (patientId) {
          const resApt = await api.get(
            `/api/appointments/patient/${patientId}`
          );
          setAppointments(resApt.data.appointments || []);
        }
      } catch (err) {
        console.error("Error loading sessions data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user?.id]);

  const handleBookClick = (doc) => {
    setSelectedDoctor(doc);
    setShowModal(true);
  };

  const handleConfirmBooking = async () => {
    try {
      const patientId = user?.id;
      if (!patientId) {
        alert("Patient ID missing. Please login again.");
        return;
      }
      if (!selectedDoctor) {
        alert("Select a doctor first.");
        return;
      }
      if (!date || !time) {
        alert("Please select date and time.");
        return;
      }

      await api.post("/api/appointments", {
        patientId,
        doctorId: selectedDoctor._id,
        sessionType: selected,
        date: formatDate(date),
        time,
      });

      alert("Appointment booked successfully!");
      setShowModal(false);
      setDate("");
      setTime("");
      setSelectedDoctor(null);

      // Refresh appointments
      const res = await api.get(`/api/appointments/patient/${patientId}`);
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error("BOOKING ERROR:", err);
      const msg =
        err?.response?.data?.message ||
        "Error booking appointment. Please try again.";
      alert(msg);
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status !== "completed" && apt.status !== "cancelled"
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed" || apt.status === "cancelled"
  );

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-[#f5efe6] p-6 md:p-10 rounded-2xl shadow-sm">
          <h2 className="text-3xl font-semibold text-gray-900">Sessions</h2>
          <p className="text-gray-600 mt-1">
            Book consultations and manage your appointments
          </p>

          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
            {/* Tabs */}
            <div className="mb-6">
              <ul className="flex gap-8 border-b pb-3 text-sm md:text-base">
                <li
                  className={`cursor-pointer pb-2 ${
                    activeTab === "book"
                      ? "text-emerald-700 font-semibold border-b-2 border-emerald-700"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("book")}
                >
                  Book Session
                </li>

                <li
                  className={`cursor-pointer pb-2 ${
                    activeTab === "scheduled"
                      ? "text-emerald-700 font-semibold border-b-2 border-emerald-700"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("scheduled")}
                >
                  Scheduled Sessions
                </li>

                <li
                  className={`cursor-pointer pb-2 ${
                    activeTab === "history"
                      ? "text-emerald-700 font-semibold border-b-2 border-emerald-700"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  Session History
                </li>
              </ul>
            </div>

            {loading && (
              <p className="text-sm text-gray-500">Loading…</p>
            )}

            {/* TAB 1 — BOOK SESSION */}
            {!loading && activeTab === "book" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
                  {types.map((t) => (
                    <SessionCard
                      key={t.title}
                      title={t.title}
                      price={t.price}
                      desc={t.desc}
                      selected={selected === t.title}
                      onClick={() => setSelected(t.title)}
                    />
                  ))}
                </div>

                <div className="mt-4 space-y-4">
                  {doctors.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No doctors available yet.
                    </p>
                  ) : (
                    doctors.map((doc) => (
                      <div
                        key={doc._id}
                        className="p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {doc.fullName}
                            </h3>
                            {doc.specialization && (
                              <p className="text-xs text-gray-500">
                                {doc.specialization}
                              </p>
                            )}
                          </div>

                          {doc.verified && (
                            <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-medium">
                              Verified
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleBookClick(doc)}
                            className="px-6 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* TAB 2 — SCHEDULED SESSIONS */}
            {!loading && activeTab === "scheduled" && (
              <div className="mt-4 space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <p className="text-gray-500">No scheduled sessions.</p>
                ) : (
                  upcomingAppointments.map((apt) => (
                    <div
                      key={apt._id}
                      className="p-5 border rounded-xl shadow-sm bg-emerald-50"
                    >
                      <h3 className="font-semibold text-lg">
                        {apt.sessionType}
                      </h3>

                      <p className="text-gray-700 mt-1">
                        Doctor: {apt.doctorId?.fullName}
                      </p>

                      <p className="text-gray-600 mt-1">
                        Date: {apt.date} • Time: {apt.time}
                      </p>

                      <span className="text-sm text-emerald-700 font-medium">
                        Status: {apt.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3 — HISTORY */}
            {!loading && activeTab === "history" && (
              <div className="mt-4 space-y-4">
                {pastAppointments.length === 0 ? (
                  <p className="text-gray-500">
                    No past sessions recorded yet.
                  </p>
                ) : (
                  pastAppointments.map((apt) => (
                    <div
                      key={apt._id}
                      className="p-5 border rounded-xl shadow-sm bg-gray-50"
                    >
                      <h3 className="font-semibold text-lg">
                        {apt.sessionType}
                      </h3>

                      <p className="text-gray-700 mt-1">
                        Doctor: {apt.doctorId?.fullName}
                      </p>

                      <p className="text-gray-600 mt-1">
                        Date: {apt.date} • Time: {apt.time}
                      </p>

                      <span
                        className={`text-sm font-medium ${
                          apt.status === "completed"
                            ? "text-emerald-700"
                            : "text-red-600"
                        }`}
                      >
                        Status: {apt.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showModal && (
        <BookingModal
          doctor={selectedDoctor}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </>
  );
};

export default Sessions;

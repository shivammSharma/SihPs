import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

export default function PatientCaseProfile() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const res = await axios.get(
          `${API_BASE}/api/patients/by-account/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPatient(res.data.patient);
      } catch (err) {
        setError("Patient not found.");
      }
    };

    load();
  }, [patientId]);

  if (error) return <p className="text-red-600 p-6">{error}</p>;
  if (!patient) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">
        Patient Case Profile — {patient.name}
      </h2>

      <div className="p-4 bg-white rounded-xl border">
        <h3 className="font-medium mb-2">Patient Info</h3>
        <p><b>Name:</b> {patient.name}</p>
        <p><b>Age:</b> {patient.age || "-"}</p>
        <p><b>Condition:</b> {patient.condition}</p>
        <p><b>Dosha:</b> {patient.dosha || "-"}</p>
      </div>

      <div className="p-4 bg-white rounded-xl border">
        <h3 className="font-medium mb-2">Clinical Reports</h3>
        {patient.clinicalReports.length === 0 && <p>No reports yet.</p>}

        {patient.clinicalReports.map((r) => (
          <div key={r._id} className="border p-3 rounded-lg mb-2">
            <h4 className="font-semibold">{r.title}</h4>
            <p className="text-sm">{r.summary}</p>
            <p className="text-xs text-gray-600">{new Date(r.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

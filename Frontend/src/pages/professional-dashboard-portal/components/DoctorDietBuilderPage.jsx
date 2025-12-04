// src/pages/professional-dashboard-portal/components/DoctorDietBuilderPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FoodCardList from "./FoodCardList";
import Button from "../../../components/ui/Button";
import useAuth from "../../../hooks/useAuth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const DoctorDietBuilderPage = () => {
  const { patientId } = useParams() || {};
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth() || {};

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const patientNameFromNav = location.state?.patientName;

  useEffect(() => {
    // Defensive: avoid running fetch when hooks are not available
    if (!patientId) {
      console.error("DoctorDietBuilderPage: missing route patientId");
      setError("No patient id provided in route.");
      return;
    }

    if (!token) {
      console.error("DoctorDietBuilderPage: missing auth token (not authenticated)");
      setError("Not authenticated. Please sign in as a doctor.");
      return;
    }

    let cancelled = false;

    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError("");
        console.info(`DoctorDietBuilderPage: fetching patient ${patientId}`);

        const res = await fetch(`${API_BASE}/api/patients/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Log raw response status for debugging
        console.info(`GET /api/patients/${patientId} status:`, res.status);

        if (!res.ok) {
          // Attempt to read JSON body for message
          let body = null;
          try {
            body = await res.json();
          } catch (e) {
            console.warn("Failed to parse error body from /api/patients/:id", e);
          }
          const errMsg =
            (body && (body.message || body.error)) ||
            `Failed to load patient (status ${res.status})`;
          throw new Error(errMsg);
        }

        const found = await res.json();

        // Normalize backend shapes: may be patient object or { message, patient }
        const normalized = found?.patient ? found.patient : found;

        if (!normalized) {
          throw new Error("Server returned empty patient data.");
        }

        if (!cancelled) {
          setPatient(normalized);
          console.info("DoctorDietBuilderPage: loaded patient", normalized._id || normalized.id);
        }
      } catch (err) {
        console.error("DoctorDietBuilderPage fetchPatient error:", err);
        if (!cancelled) {
          setError(err.message || "Error loading patient");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPatient();

    return () => {
      cancelled = true;
    };
  }, [patientId, token]);

  // Render: guarded so nothing throws
  return (
    <div className="min-h-screen bg-[#fdf7ee] flex flex-col">
      <header className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-primary">
            Diet Planner for{" "}
            {patientNameFromNav || (patient && patient.name) || user?.fullName || "Patient"}
          </h1>
          <p className="text-xs text-text-secondary">
            Assign breakfast, lunch, and dinner foods from the Ayurvedic food library.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-6 text-sm text-text-secondary">Loading…</div>
        )}

        {!loading && error && (
          <div className="p-6 text-sm text-red-600">
            <strong>Error:</strong> {error}
            <div className="text-xs text-gray-600 mt-2">
              Check browser console & network tab for details.
            </div>
          </div>
        )}

        {!loading && !error && !patient && (
          <div className="p-6 text-sm text-text-secondary">
            Patient not loaded yet.
          </div>
        )}

        {patient && (
          <FoodCardList
            patientId={patient._id || patient.id}
            initialDietPlan={patient.dietPlan || { breakfast: [], lunch: [], dinner: [] }}
            onDietSaved={(updated) => {
              // Backend may return { message, patient } or patient directly
              const newPatient = (updated && updated.patient) ? updated.patient : updated;
              if (newPatient && typeof newPatient === "object") {
                setPatient(newPatient);
                console.info("DoctorDietBuilderPage: diet saved — patient updated");
              } else {
                // If backend returned message only, re-fetch patient to be safe
                console.info("DoctorDietBuilderPage: diet save returned no patient object — re-fetching");
                // naive re-fetch:
                (async () => {
                  try {
                    setLoading(true);
                    const res = await fetch(`${API_BASE}/api/patients/${patientId}`, {
                      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    });
                    if (res.ok) {
                      const body = await res.json();
                      const normalized = body?.patient ? body.patient : body;
                      setPatient(normalized);
                    } else {
                      console.warn("Re-fetch after save failed:", res.status);
                    }
                  } catch (e) {
                    console.error("Re-fetch after save error:", e);
                  } finally {
                    setLoading(false);
                  }
                })();
              }
            }}
          />
        )}
      </main>
    </div>
  );
};

export default DoctorDietBuilderPage;

// src/pages/.../PatientManagement.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import WeeklyPlanSummaryCard from "./WeeklyPlanSummaryCard";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const PatientManagement = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDosha, setSelectedDosha] = useState("all");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    dosha: "vata",
    condition: "",
    status: "new",
    patientIdentifier: "", // registered email or phone
    nextAppointment: "", // datetime-local string
  });

  const [errorMsg, setErrorMsg] = useState("");

  // details/edit modal
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editFields, setEditFields] = useState({
    condition: "",
    status: "",
    nextAppointment: "",
    heightCm: "",
    weightKg: "",
    bmi: "",
    bloodPressure: "",
    heartRate: "",
    allergies: "",
    medications: "",
    chronicConditions: "",
    lifestyleNotes: "",
    dietPreferences: "",

    // clinical report fields
    reportTitle: "",
    reportSummary: "",
    reportDiagnosis: "",
    reportNotes: "",
    reportTestsRecommended: "",
    reportPlan: "",
    reportFollowUpDate: "",
  });

  const filterOptions = [
    { value: "all", label: "All Patients" },
    { value: "active", label: "Active Treatment" },
    { value: "followup", label: "Follow-up Required" },
    { value: "new", label: "New Patients" },
    { value: "completed", label: "Treatment Completed" },
  ];

  const doshaOptions = [
    { value: "all", label: "All Doshas" },
    { value: "vata", label: "Vata" },
    { value: "pitta", label: "Pitta" },
    { value: "kapha", label: "Kapha" },
    { value: "vata-pitta", label: "Vata-Pitta" },
    { value: "pitta-kapha", label: "Pitta-Kapha" },
    { value: "kapha-vata", label: "Kapha-Vata" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "followup":
        return "bg-warning/10 text-warning";
      case "new":
        return "bg-secondary/10 text-secondary";
      case "completed":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-text-secondary";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "followup":
        return "Follow-up";
      case "new":
        return "New";
      case "completed":
        return "Completed";
      default:
        return status || "—";
    }
  };

  const getDoshaColor = (dosha) => {
    if (dosha?.toLowerCase().includes("vata"))
      return "bg-blue-100 text-blue-800";
    if (dosha?.toLowerCase().includes("pitta"))
      return "bg-red-100 text-red-800";
    if (dosha?.toLowerCase().includes("kapha"))
      return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatDateTimeLocal = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  /**
   * Normalize nextAppointment from backend.
   * Supports:
   *  1) nextAppointment = ISO date string
   *  2) nextAppointment = { date, time, status, sessionType }
   */
  const getNextAppointmentDisplay = (patient) => {
    const na = patient?.nextAppointment;
    if (!na) return null;

    let dateObj = null;
    let status = "";
    let sessionType = "";

    if (typeof na === "object" && na !== null && ("date" in na || "time" in na)) {
      const dateStr = na.date;
      if (!dateStr) return null;
      const timeStr = na.time || "00:00";
      const iso = `${dateStr}T${timeStr}:00`;
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return null;
      dateObj = d;
      status = na.status || "Scheduled";
      sessionType = na.sessionType || "";
    } else {
      const d = new Date(na);
      if (Number.isNaN(d.getTime())) return null;
      dateObj = d;
    }

    const datetimeLabel = dateObj.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });

    return {
      datetimeLabel,
      status,
      sessionType,
    };
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const token = localStorage.getItem("authToken");
      if (!token) {
        setPatients([]);
        setErrorMsg("Not authenticated. Please log in as a doctor.");
        return;
      }

      const qParams = new URLSearchParams();
      if (selectedFilter && selectedFilter !== "all")
        qParams.set("status", selectedFilter);
      if (selectedDosha && selectedDosha !== "all")
        qParams.set("dosha", selectedDosha);
      if (searchTerm) qParams.set("q", searchTerm);

      const res = await fetch(
        `${API_BASE}/api/patients?${qParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error("Patients API non-200:", res.status, errBody);
        throw new Error(
          errBody.message || errBody.error || "Failed to fetch patients"
        );
      }

      const data = await res.json();
      console.log("🩺 /api/patients response:", data);

      const list = Array.isArray(data) ? data : data.patients || [];
      setPatients(list);
    } catch (err) {
      console.error("Fetch patients error:", err);
      setErrorMsg(err.message || "Failed to load patients.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const recalcBmi = (heightCm, weightKg) => {
    const h = Number(heightCm);
    const w = Number(weightKg);
    if (!h || !w) return "";
    const m = h / 100;
    const bmi = w / (m * m);
    return Number(bmi.toFixed(1));
  };

  useEffect(() => {
    // Auto-refresh when status or dosha filter changes
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, selectedDosha]);

  const handleNewPatient = () => setShowNewPatientModal(true);

  const handleSavePatient = async () => {
    try {
      if (!newPatient.age || !newPatient.condition || !newPatient.name) {
        alert("Please fill all fields.");
        return;
      }

      if (!newPatient.patientIdentifier) {
        alert("Please enter the patient's registered email or phone number.");
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in as a doctor to add patients.");
        return;
      }

      const payload = {
        ...newPatient,
        age: Number(newPatient.age),
        lastVisit: new Date().toISOString(),
        progress: 0,
        nextAppointment: newPatient.nextAppointment || null,
      };

      const res = await fetch(`${API_BASE}/api/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || "Failed to save patient");
      }

      const saved = await res.json();

      setPatients((prev) => [saved, ...prev]);

      setNewPatient({
        name: "",
        age: "",
        dosha: "vata",
        condition: "",
        status: "new",
        patientIdentifier: "",
        nextAppointment: "",
      });
      setShowNewPatientModal(false);
    } catch (err) {
      console.error("Save patient error:", err);
      alert(err.message || "Error saving patient");
    }
  };

  const openDetails = (patient) => {
    // Compute nextAppointment value for datetime-local input
    let nextApptLocal = "";
    const na = patient?.nextAppointment;

    if (na) {
      if (typeof na === "object" && na !== null && ("date" in na || "time" in na)) {
        const dateStr = na.date;
        if (dateStr) {
          const timeStr = na.time || "00:00";
          const iso = `${dateStr}T${timeStr}:00`;
          nextApptLocal = formatDateTimeLocal(iso);
        }
      } else {
        nextApptLocal = formatDateTimeLocal(na);
      }
    }

    setSelectedPatient(patient);
    setEditFields((prev) => ({
      ...prev,
      condition: patient?.condition || "",
      status: patient?.status || "new",
      nextAppointment: nextApptLocal,
      heightCm: patient?.heightCm ?? "",
      weightKg: patient?.weightKg ?? "",
      bmi: patient?.bmi ?? "",
      bloodPressure: patient?.bloodPressure || "",
      heartRate: patient?.heartRate ?? "",
      allergies: patient?.allergies || "",
      medications: patient?.medications || "",
      chronicConditions: patient?.chronicConditions || "",
      lifestyleNotes: patient?.lifestyleNotes || "",
      dietPreferences: patient?.dietPreferences || "",
      // keep report fields unchanged
    }));
    setShowDetails(true);
  };

  const handleUpdatePatient = async () => {
    if (!selectedPatient?._id) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in as a doctor.");
        return;
      }

      const payload = {
        condition: editFields.condition,
        status: editFields.status,
        nextAppointment: editFields.nextAppointment || null,
        heightCm: editFields.heightCm ? Number(editFields.heightCm) : null,
        weightKg: editFields.weightKg ? Number(editFields.weightKg) : null,
        bmi: editFields.bmi ? Number(editFields.bmi) : null,
        bloodPressure: editFields.bloodPressure,
        heartRate: editFields.heartRate ? Number(editFields.heartRate) : null,
        allergies: editFields.allergies,
        medications: editFields.medications,
        chronicConditions: editFields.chronicConditions,
        lifestyleNotes: editFields.lifestyleNotes,
        dietPreferences: editFields.dietPreferences,
      };

      const res = await fetch(
        `${API_BASE}/api/patients/${selectedPatient._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err.error || err.message || "Failed to update patient"
        );
      }

      const updated = await res.json();

      setPatients((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );

      setSelectedPatient(updated);
      alert("Patient updated.");
    } catch (err) {
      console.error("Update patient error:", err);
      alert(err.message || "Error updating patient");
    }
  };

  const handleCreateReport = async () => {
    if (!selectedPatient?._id) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in as a doctor.");
        return;
      }

      const payload = {
        title: editFields.reportTitle,
        summary: editFields.reportSummary,
        diagnosis: editFields.reportDiagnosis,
        notes: editFields.reportNotes,
        testsRecommended: editFields.reportTestsRecommended,
        plan: editFields.reportPlan,
        followUpDate: editFields.reportFollowUpDate || null,
      };

      const res = await fetch(
        `${API_BASE}/api/patients/${selectedPatient._id}/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err.message || err.error || "Failed to create report"
        );
      }

      const data = await res.json();
      const updated = data.patient;

      setPatients((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      setSelectedPatient(updated);

      setEditFields((prev) => ({
        ...prev,
        reportTitle: "",
        reportSummary: "",
        reportDiagnosis: "",
        reportNotes: "",
        reportTestsRecommended: "",
        reportPlan: "",
        reportFollowUpDate: "",
      }));

      alert("Report saved successfully.");
    } catch (err) {
      console.error("Create report error:", err);
      alert(err.message || "Error creating report");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Toolbar with gradient */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-emerald-50 via-primary/5 to-emerald-100 organic-shadow">
        {/* Soft blobs */}
        <div className="absolute -left-16 top-10 h-32 w-32 rounded-full bg-emerald-200/60 blur-2xl" />
        <div className="absolute -right-20 -bottom-10 h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl" />

        <div className="relative p-4 md:p-5 space-y-4">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-800/80 font-semibold mb-1">
                Patient Management
              </p>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-emerald-950 mb-1">
                Clinical patient panel
              </h2>
              <p className="text-sm text-emerald-900/80">
                Search, filter and review active clinical records.
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1 text-xs">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-emerald-100 shadow-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-emerald-900">
                  {loading ? "Syncing patients…" : "Patients in sync"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-emerald-900/80">
                <span>
                  Total:{" "}
                  <span className="font-semibold text-emerald-950">
                    {patients.length}
                  </span>
                </span>
                {selectedFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 px-2 py-[2px] bg-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="capitalize text-emerald-900/90">
                      {filterOptions.find((f) => f.value === selectedFilter)
                        ?.label || "Filtered"}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white/80 backdrop-blur rounded-xl border border-emerald-100 p-3 md:p-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="flex-1 flex flex-col md:flex-row gap-2 md:items-center">
              <Input
                placeholder="Search by name or condition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchPatients();
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPatients}
                className="mt-1 md:mt-0"
              >
                Apply
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:items-center text-xs md:text-[13px]">
              <div className="flex items-center gap-2">
                <span className="text-emerald-900/70 hidden md:inline">
                  Status
                </span>
                <Select
                  options={filterOptions}
                  value={selectedFilter}
                  onChange={(val) => setSelectedFilter(val)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-900/70 hidden md:inline">
                  Dosha
                </span>
                <Select
                  options={doshaOptions}
                  value={selectedDosha}
                  onChange={(val) => setSelectedDosha(val)}
                />
              </div>
            </div>
          </div>

          {/* Error inline */}
          {errorMsg && (
            <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50/90 border border-red-200 rounded-md px-3 py-2">
              <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-card rounded-2xl border border-border organic-shadow overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/40">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Patients ({patients?.length})
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Select a patient to view or update clinical details.
            </p>
          </div>
          {loading && (
            <span className="text-sm text-text-secondary flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Loading…
            </span>
          )}
        </div>

        <div className="divide-y divide-border">
          {patients?.map((patient) => {
            const nextAppt = getNextAppointmentDisplay(patient);
            return (
              <button
                key={patient?._id || patient?.id}
                className="w-full text-left p-4 hover:bg-muted/20 organic-transition"
                onClick={() => openDetails(patient)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <h4 className="font-semibold text-text-primary">
                        {patient?.name || "Unnamed"}
                      </h4>
                      {patient?.age && (
                        <span className="text-sm text-text-secondary">
                          {patient.age}y
                        </span>
                      )}
                      {patient?.dosha && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getDoshaColor(
                            patient?.dosha
                          )}`}
                        >
                          {patient?.dosha}
                        </span>
                      )}
                    </div>
                    {patient?.condition && (
                      <p className="text-xs text-text-secondary line-clamp-1">
                        {patient.condition}
                      </p>
                    )}
                    {patient?.patientAccountId && (
                      <p className="text-[11px] text-text-secondary">
                        {patient.patientAccountId.fullName} ·{" "}
                        {patient.patientAccountId.email} ·{" "}
                        {patient.patientAccountId.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="text-right space-y-1 shrink-0">
                    <span
                      className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusColor(
                        patient?.status
                      )}`}
                    >
                      {getStatusLabel(patient?.status)}
                    </span>
                    {nextAppt && (
                      <div className="text-[11px] text-text-secondary">
                        <span className="font-medium">Next:</span>{" "}
                        {nextAppt.datetimeLabel}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          {patients?.length === 0 && !loading && (
            <div className="p-6 text-center text-text-secondary text-sm">
              No patients found. Adjust filters or search criteria.
            </div>
          )}
        </div>
      </div>

      {/* New Patient Modal (no button in header, but kept for now) */}
      {showNewPatientModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md organic-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Add new patient
                </h3>
                <p className="text-xs text-text-secondary">
                  Link this clinical file to an existing account by email or
                  phone.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewPatientModal(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-3 mb-4 text-sm">
              <Input
                placeholder="Full name"
                value={newPatient.name}
                onChange={(e) =>
                  setNewPatient((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <Input
                type="number"
                placeholder="Age"
                value={newPatient.age}
                onChange={(e) =>
                  setNewPatient((prev) => ({
                    ...prev,
                    age: e.target.value,
                  }))
                }
              />
              <Select
                options={doshaOptions.filter((o) => o.value !== "all")}
                value={newPatient.dosha}
                onChange={(val) =>
                  setNewPatient((prev) => ({
                    ...prev,
                    dosha: val,
                  }))
                }
                placeholder="Select dosha"
              />
              <Input
                placeholder="Primary condition"
                value={newPatient.condition}
                onChange={(e) =>
                  setNewPatient((prev) => ({
                    ...prev,
                    condition: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Patient's registered email or phone"
                value={newPatient.patientIdentifier}
                onChange={(e) =>
                  setNewPatient((prev) => ({
                    ...prev,
                    patientIdentifier: e.target.value,
                  }))
                }
              />
              <Input
                type="datetime-local"
                placeholder="Next appointment"
                value={newPatient.nextAppointment}
                onChange={(e) =>
                  setNewPatient((prev) => ({
                    ...prev,
                    nextAppointment: e.target.value,
                  }))
                }
              />
              <Select
                options={filterOptions.filter((o) => o.value !== "all")}
                value={newPatient.status}
                onChange={(val) =>
                  setNewPatient((prev) => ({
                    ...prev,
                    status: val,
                  }))
                }
                placeholder="Select status"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowNewPatientModal(false)}
              >
                Cancel
              </Button>
              <Button variant="default" onClick={handleSavePatient}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Details / Edit Modal - centered clinical sheet */}
      {showDetails && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="relative border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-primary/5 to-emerald-100 px-5 py-4">
              {/* subtle blobs */}
              <div className="pointer-events-none absolute -left-10 top-6 h-24 w-24 rounded-full bg-emerald-200/50 blur-2xl" />
              <div className="pointer-events-none absolute -right-16 -bottom-8 h-28 w-28 rounded-full bg-emerald-300/40 blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg md:text-xl font-semibold text-emerald-950">
                      {selectedPatient.name}
                    </h3>
                    <span className="text-[11px] px-2 py-[2px] rounded-full bg-white/70 border border-emerald-200 text-emerald-800">
                      {getStatusLabel(selectedPatient.status)}
                    </span>
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-800/80 font-semibold">
                    Clinical record
                  </p>
                  <p className="mt-1 text-xs text-emerald-900/80">
                    Review health profile, notes and diet plan for this
                    patient.
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                  >
                    Close
                  </Button>
                  <div className="text-[11px] text-emerald-900/80">
                    Age:{" "}
                    <span className="font-medium">
                      {selectedPatient.age || "—"}
                    </span>{" "}
                    · Dosha:{" "}
                    <span className="font-medium">
                      {selectedPatient.dosha || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body: scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-sm">
                {/* Left column: profile + health */}
                <div className="space-y-4">
                  {/* Basic info */}
                  <div className="rounded-xl border border-border bg-muted/10 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-text-primary">
                        Patient overview
                      </span>
                    </div>
                    <div className="text-xs text-text-secondary space-y-1">
                      <div>Age: {selectedPatient.age || "—"}</div>
                      <div>Dosha: {selectedPatient.dosha || "—"}</div>
                    </div>

                    {selectedPatient.patientAccountId && (
                      <div className="mt-2 border-t border-border pt-2">
                        <div className="text-[11px] font-medium text-text-secondary mb-1">
                          Linked account
                        </div>
                        <div className="text-xs text-text-secondary space-y-0.5">
                          <div>
                            {selectedPatient.patientAccountId.fullName}
                          </div>
                          <div>
                            {selectedPatient.patientAccountId.email}
                          </div>
                          <div>
                            {selectedPatient.patientAccountId.phoneNumber}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Condition + status */}
                  <div className="rounded-xl border border-border bg-muted/10 p-3">
                    <div className="font-medium text-text-primary mb-1.5">
                      Condition / presenting complaint
                    </div>
                    <textarea
                      className="w-full border border-border rounded-md p-2 text-sm min-h-[90px]"
                      rows={3}
                      value={editFields.condition}
                      onChange={(e) =>
                        setEditFields((prev) => ({
                          ...prev,
                          condition: e.target.value,
                        }))
                      }
                    />
                    <div className="mt-2">
                      <div className="text-xs font-medium text-text-secondary mb-1">
                        Status
                      </div>
                      <Select
                        options={filterOptions.filter((o) => o.value !== "all")}
                        value={editFields.status}
                        onChange={(val) =>
                          setEditFields((prev) => ({
                            ...prev,
                            status: val,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Health profile */}
                  <div className="rounded-xl border border-border bg-muted/10 p-3 space-y-3">
                    <div className="font-medium text-text-primary">
                      Health profile
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        label="Height (cm)"
                        type="number"
                        value={editFields.heightCm}
                        onChange={(e) => {
                          const heightCm = e.target.value;
                          const bmi = recalcBmi(
                            heightCm,
                            editFields.weightKg
                          );
                          setEditFields((prev) => ({
                            ...prev,
                            heightCm,
                            bmi: bmi || "",
                          }));
                        }}
                      />
                      <Input
                        label="Weight (kg)"
                        type="number"
                        value={editFields.weightKg}
                        onChange={(e) => {
                          const weightKg = e.target.value;
                          const bmi = recalcBmi(
                            editFields.heightCm,
                            weightKg
                          );
                          setEditFields((prev) => ({
                            ...prev,
                            weightKg,
                            bmi: bmi || "",
                          }));
                        }}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        label="BMI"
                        type="number"
                        value={editFields.bmi}
                        onChange={(e) =>
                          setEditFields((prev) => ({
                            ...prev,
                            bmi: e.target.value,
                          }))
                        }
                      />
                      <Input
                        label="Blood pressure"
                        placeholder="120/80"
                        value={editFields.bloodPressure}
                        onChange={(e) =>
                          setEditFields((prev) => ({
                            ...prev,
                            bloodPressure: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        label="Heart rate (bpm)"
                        type="number"
                        value={editFields.heartRate}
                        onChange={(e) =>
                          setEditFields((prev) => ({
                            ...prev,
                            heartRate: e.target.value,
                          }))
                        }
                      />
                      <Input
                        label="Diet preferences"
                        placeholder="Veg / Non-veg / Satvik…"
                        value={editFields.dietPreferences}
                        onChange={(e) =>
                          setEditFields((prev) => ({
                            ...prev,
                            dietPreferences: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <div className="text-xs font-medium text-text-secondary mb-1">
                          Allergies
                        </div>
                        <textarea
                          className="w-full border border-border rounded-md p-2 text-sm"
                          rows={2}
                          value={editFields.allergies}
                          onChange={(e) =>
                            setEditFields((prev) => ({
                              ...prev,
                              allergies: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div>
                        <div className="text-xs font-medium text-text-secondary mb-1">
                          Medications
                        </div>
                        <textarea
                          className="w-full border border-border rounded-md p-2 text-sm"
                          rows={2}
                          value={editFields.medications}
                          onChange={(e) =>
                            setEditFields((prev) => ({
                              ...prev,
                              medications: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div>
                        <div className="text-xs font-medium text-text-secondary mb-1">
                          Chronic conditions
                        </div>
                        <textarea
                          className="w-full border border-border rounded-md p-2 text-sm"
                          rows={2}
                          value={editFields.chronicConditions}
                          onChange={(e) =>
                            setEditFields((prev) => ({
                              ...prev,
                              chronicConditions: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div>
                        <div className="text-xs font-medium text-text-secondary mb-1">
                          Lifestyle notes
                        </div>
                        <textarea
                          className="w-full border border-border rounded-md p-2 text-sm"
                          rows={3}
                          placeholder="Sleep, stress, work type, exercise, etc."
                          value={editFields.lifestyleNotes}
                          onChange={(e) =>
                            setEditFields((prev) => ({
                              ...prev,
                              lifestyleNotes: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column: reports, appointment, diet plan */}
                <div className="space-y-4">
                  {/* Next appointment */}
                  <div className="rounded-xl border border-border bg-muted/10 p-3">
                    <div className="font-medium text-text-primary mb-1">
                      Next appointment
                    </div>
                    <Input
                      type="datetime-local"
                      value={editFields.nextAppointment}
                      onChange={(e) =>
                        setEditFields((prev) => ({
                          ...prev,
                          nextAppointment: e.target.value,
                        }))
                      }
                    />
                    {getNextAppointmentDisplay(selectedPatient) && (
                      <p className="mt-1 text-[11px] text-text-secondary">
                        Current:{" "}
                        {
                          getNextAppointmentDisplay(selectedPatient)
                            .datetimeLabel
                        }
                      </p>
                    )}
                  </div>

                  {/* Clinical reports */}
                  <div className="rounded-xl border border-border bg-muted/10 p-3 space-y-3">
                    <div className="font-medium text-text-primary">
                      Clinical reports & notes
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {(selectedPatient?.clinicalReports || []).length ===
                        0 && (
                        <p className="text-xs text-text-secondary">
                          No reports created yet for this patient.
                        </p>
                      )}

                      {(selectedPatient?.clinicalReports || [])
                        .slice()
                        .reverse()
                        .map((rep, idx) => (
                          <div
                            key={rep._id || idx}
                            className="border border-border rounded-md p-2 bg-white"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-sm font-semibold text-text-primary">
                                {rep.title || "Clinical note"}
                              </div>
                              <div className="text-[10px] text-text-secondary">
                                {rep.createdAt
                                  ? new Date(
                                      rep.createdAt
                                    ).toLocaleString([], {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    })
                                  : ""}
                              </div>
                            </div>
                            {rep.summary && (
                              <div className="text-xs text-text-secondary mb-1">
                                {rep.summary}
                              </div>
                            )}
                            {rep.diagnosis && (
                              <div className="text-[11px] text-text-secondary">
                                <span className="font-semibold">Dx: </span>
                                {rep.diagnosis}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>

                    {/* New report form */}
                    <div className="space-y-2 rounded-xl border border-border bg-white p-3">
                      <Input
                        placeholder="Report title (e.g. Initial assessment)"
                        value={editFields.reportTitle}
                        onChange={(e) =>
                          setEditFields((prev) => ({
                            ...prev,
                            reportTitle: e.target.value,
                          }))
                        }
                      />
                      <Input
                        placeholder="Short summary"
                        value={editFields.reportSummary}
                        onChange={(e) =>
                          setEditFields((prev) => ({
                            ...prev,
                            reportSummary: e.target.value,
                          }))
                        }
                      />
                      <div>
                        <div className="text-xs font-medium text-text-secondary mb-1">
                          Diagnosis / clinical impression
                        </div>
                        <textarea
                          className="w-full border border-border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          rows={2}
                          value={editFields.reportDiagnosis}
                          onChange={(e) =>
                            setEditFields((prev) => ({
                              ...prev,
                              reportDiagnosis: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-text-secondary mb-1">
                          Detailed notes
                        </div>
                        <textarea
                          className="w-full border border-border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          rows={3}
                          value={editFields.reportNotes}
                          onChange={(e) =>
                            setEditFields((prev) => ({
                              ...prev,
                              reportNotes: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-text-secondary mb-1">
                          Tests / investigations recommended
                        </div>
                        <textarea
                          className="w-full border border-border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          rows={2}
                          value={editFields.reportTestsRecommended}
                          onChange={(e) =>
                            setEditFields((prev) => ({
                              ...prev,
                              reportTestsRecommended: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-text-secondary mb-1">
                          Plan / recommendations
                        </div>
                        <textarea
                          className="w-full border border-border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          rows={3}
                          value={editFields.reportPlan}
                          onChange={(e) =>
                            setEditFields((prev) => ({
                              ...prev,
                              reportPlan: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-text-secondary mb-1">
                          Follow-up date (optional)
                        </div>
                        <Input
                          type="date"
                          value={editFields.reportFollowUpDate}
                          onChange={(e) =>
                            setEditFields((prev) => ({
                              ...prev,
                              reportFollowUpDate: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleCreateReport}
                        >
                          Save report
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Diet plan */}
                  <div className="rounded-xl border border-border bg-muted/10 p-3 space-y-3">
                    <div className="font-medium text-text-primary">
                      Diet plan
                    </div>
                    <p className="text-xs text-text-secondary">
                      Open the diet planner to design or edit this
                      patient&apos;s weekly meal structure.
                    </p>
                    <Button
                      variant="default"
                      className="w-full bg-green-700 text-white hover:bg-green-800 text-sm"
                      onClick={() => {
                        navigate(
                          `/doctor/diet-builder/${selectedPatient._id}`,
                          {
                            state: {
                              patientName: selectedPatient.name,
                            },
                          }
                        );
                      }}
                    >
                      Open diet planner
                    </Button>
                    <div className="mt-1">
                      <WeeklyPlanSummaryCard
                        clinicalPatientId={selectedPatient._id}
                        onOpenPlanner={() =>
                          navigate(
                            `/doctor/week-planner/${selectedPatient._id}`,
                            {
                              state: { patientName: selectedPatient.name },
                            }
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-border bg-white px-5 py-3 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleUpdatePatient}
              >
                Save changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;

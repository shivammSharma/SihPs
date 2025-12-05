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

    // NEW – ayurvedic assessment (stored inside lifestyleNotes when saving)
    prakriti: "",
    vikriti: "",
    agni: "",
    appetite: "",
    bowelHabits: "",
    sleepQuality: "",
    stressLevel: "",
    exercisePattern: "",

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

  const agniOptions = [
    { value: "", label: "Select Agni" },
    { value: "sama", label: "Samagni (balanced)" },
    { value: "manda", label: "Mandagni (slow)" },
    { value: "tikshna", label: "Tikshnagni (sharp)" },
    { value: "vishama", label: "Vishamagni (irregular)" },
  ];

  const appetiteOptions = [
    { value: "", label: "Select Appetite" },
    { value: "low", label: "Low" },
    { value: "moderate", label: "Moderate" },
    { value: "high", label: "High" },
    { value: "variable", label: "Variable" },
  ];

  const yesNoOptions = [
    { value: "", label: "Select" },
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const sleepOptions = [
    { value: "", label: "Select Sleep" },
    { value: "sound", label: "Sound / Refreshing" },
    { value: "disturbed", label: "Disturbed" },
    { value: "difficultyOnset", label: "Difficulty in Onset" },
    { value: "earlyAwakening", label: "Early Awakening" },
  ];

  const stressOptions = [
    { value: "", label: "Select Stress Level" },
    { value: "low", label: "Low" },
    { value: "moderate", label: "Moderate" },
    { value: "high", label: "High" },
    { value: "veryHigh", label: "Very High" },
  ];

  const exerciseOptions = [
    { value: "", label: "Select Activity" },
    { value: "sedentary", label: "Sedentary" },
    { value: "light", label: "Light Activity" },
    { value: "moderate", label: "Moderate Activity" },
    { value: "intense", label: "Intense / Athlete" },
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
        return status;
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
   * Helper to normalize the next appointment coming from backend.
   *
   * Supports:
   *  1) Old shape: nextAppointment = ISO date string
   *  2) New shape: nextAppointment = { date, time, status, sessionType }
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
      setPatients(data);
    } catch (err) {
      console.error("Fetch patients error:", err);
      setErrorMsg(err.message || "Failed to load patients.");
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
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, selectedDosha]);

  const handleNewPatient = () => setShowNewPatientModal(true);

  const handleSavePatient = async () => {
    try {
      if (!newPatient.age || !newPatient.condition) {
        alert("Please fill all fields!");
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
      // report fields stay as they were (empty unless doctor typed)
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

      // Build an Ayurvedic block that gets appended into lifestyleNotes
      const ayuBlockLines = [
        editFields.prakriti && `Prakriti: ${editFields.prakriti}`,
        editFields.vikriti && `Vikriti (current): ${editFields.vikriti}`,
        editFields.agni && `Agni: ${editFields.agni}`,
        editFields.appetite && `Appetite: ${editFields.appetite}`,
        editFields.bowelHabits && `Bowel habits: ${editFields.bowelHabits}`,
        editFields.sleepQuality && `Sleep: ${editFields.sleepQuality}`,
        editFields.stressLevel && `Stress level: ${editFields.stressLevel}`,
        editFields.exercisePattern &&
          `Physical activity: ${editFields.exercisePattern}`,
      ].filter(Boolean);

      const ayuBlock =
        ayuBlockLines.length > 0
          ? `\n\n--- Ayurvedic Assessment ---\n${ayuBlockLines.join("\n")}`
          : "";

      const lifestyleCombined = `${editFields.lifestyleNotes || ""}${ayuBlock}`;

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
        lifestyleNotes: lifestyleCombined.trim(),
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
      alert("Patient updated");
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">
            Patient Management
          </h2>
          <p className="text-text-secondary">
            Manage your patients and track their progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchPatients();
            }}
          />
          <Select
            options={filterOptions}
            value={selectedFilter}
            onChange={(val) => setSelectedFilter(val)}
          />
          <Select
            options={doshaOptions}
            value={selectedDosha}
            onChange={(val) => setSelectedDosha(val)}
          />
          <Button
            variant="default"
            iconName="UserPlus"
            iconPosition="left"
            onClick={handleNewPatient}
          >
            Add New Patient
          </Button>
        </div>
      </div>

      {/* Error */}
      {errorMsg && patients.length === 0 && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {errorMsg}
        </div>
      )}

      {/* Patient List */}
      <div className="bg-card rounded-lg border border-border organic-shadow">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold text-text-primary">
            Patients ({patients?.length})
          </h3>
          {loading && (
            <span className="text-sm text-text-secondary">Loading...</span>
          )}
        </div>

        <div className="divide-y divide-border">
          {patients?.map((patient) => {
            const nextApptInfo = getNextAppointmentDisplay(patient);

            return (
              <button
                key={patient?._id || patient?.id}
                className="w-full text-left p-4 hover:bg-muted/30 organic-transition"
                onClick={() => openDetails(patient)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-text-primary">
                        {patient?.name}
                      </h4>
                      <span className="text-sm text-text-secondary">
                        ({patient?.age}y)
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getDoshaColor(
                          patient?.dosha
                        )}`}
                      >
                        {patient?.dosha}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {patient?.condition}
                    </p>

                    {patient?.patientAccountId && (
                      <p className="text-xs text-text-secondary mt-1">
                        Account:{" "}
                        <span className="font-medium">
                          {patient.patientAccountId.fullName}
                        </span>{" "}
                        · {patient.patientAccountId.email} ·{" "}
                        {patient.patientAccountId.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="text-right space-y-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        patient?.status
                      )}`}
                    >
                      {getStatusLabel(patient?.status)}
                    </span>

                    {nextApptInfo && (
                      <div className="text-xs text-text-secondary">
                        <div>
                          Next: {nextApptInfo.datetimeLabel}
                          {nextApptInfo.sessionType &&
                            ` · ${nextApptInfo.sessionType}`}
                        </div>
                        {nextApptInfo.status && (
                          <span className="inline-flex mt-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px]">
                            {nextApptInfo.status}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          {patients?.length === 0 && !loading && (
            <div className="p-4 text-center text-text-secondary">
              No patients found
            </div>
          )}
        </div>
      </div>

      {/* New Patient Modal */}
      {showNewPatientModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Patient</h3>

            <Input
              type="number"
              placeholder="Age"
              value={newPatient.age}
              onChange={(e) =>
                setNewPatient({ ...newPatient, age: e.target.value })
              }
              className="mb-3"
            />
            <Select
              options={doshaOptions.filter((o) => o.value !== "all")}
              value={newPatient.dosha}
              onChange={(val) =>
                setNewPatient({ ...newPatient, dosha: val })
              }
              placeholder="Select Dosha"
              className="mb-3"
            />
            <Input
              placeholder="Presenting complaint / condition"
              value={newPatient.condition}
              onChange={(e) =>
                setNewPatient({ ...newPatient, condition: e.target.value })
              }
              className="mb-3"
            />
            <Input
              placeholder="Patient's registered Email or Phone"
              value={newPatient.patientIdentifier}
              onChange={(e) =>
                setNewPatient({
                  ...newPatient,
                  patientIdentifier: e.target.value,
                })
              }
              className="mb-3"
            />
            <Input
              type="datetime-local"
              placeholder="Next Appointment"
              value={newPatient.nextAppointment}
              onChange={(e) =>
                setNewPatient({
                  ...newPatient,
                  nextAppointment: e.target.value,
                })
              }
              className="mb-3"
            />

            <Select
              options={filterOptions.filter((o) => o.value !== "all")}
              value={newPatient.status}
              onChange={(val) =>
                setNewPatient({ ...newPatient, status: val })
              }
              placeholder="Select Status"
              className="mb-3"
            />

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

      {/* Centered Details / Edit Modal */}
      {showDetails && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-border flex flex-col">
            {/* Profile Header Card */}
            <div className="px-6 pt-5 pb-4 border-b bg-gradient-to-r from-emerald-50 to-emerald-100/40">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-700 text-white flex items-center justify-center font-semibold">
                    {selectedPatient?.name?.[0]?.toUpperCase() || "P"}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary capitalize">
                      {selectedPatient.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                      <span className="text-text-secondary">
                        {selectedPatient.age || "-"}y
                      </span>
                      {selectedPatient.dosha && (
                        <span
                          className={`px-2 py-0.5 rounded-full ${getDoshaColor(
                            selectedPatient.dosha
                          )}`}
                        >
                          {selectedPatient.dosha}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full ${getStatusColor(
                          editFields.status || selectedPatient.status
                        )}`}
                      >
                        {getStatusLabel(
                          editFields.status || selectedPatient.status
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 text-sm">
              {/* BASIC INFO */}
              <section className="border border-border/60 rounded-xl p-4 bg-muted/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-text-primary">
                    Patient Snapshot
                  </h4>
                  {selectedPatient.patientAccountId && (
                    <span className="text-[11px] text-text-secondary">
                      {selectedPatient.patientAccountId.email} •{" "}
                      {selectedPatient.patientAccountId.phoneNumber}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-text-secondary text-xs">
                  <div>Age: {selectedPatient.age || "-"}</div>
                  <div>Dosha focus: {selectedPatient.dosha || "-"}</div>
                  <div>
                    Last Visit:{" "}
                    {selectedPatient.lastVisit
                      ? new Date(selectedPatient.lastVisit).toLocaleDateString()
                      : "-"}
                  </div>
                  <div>
                    Next Appointment:{" "}
                    {selectedPatient.nextAppointment
                      ? new Date(
                          selectedPatient.nextAppointment
                        ).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "-"}
                  </div>
                </div>
              </section>

              {/* PRESENTING COMPLAINT & STATUS */}
              <section className="border border-border/60 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-text-primary mb-3">
                  Presenting Complaint & Clinical Status
                </h4>
                <div className="grid md:grid-cols-3 gap-4 mb-3">
                  <div className="md:col-span-2">
                    <div className="text-xs font-medium text-text-secondary mb-1">
                      Chief complaint & brief history
                    </div>
                    <textarea
                      className="w-full border border-border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/30"
                      rows={3}
                      placeholder="Describe the main complaint, onset, duration, and aggravating/relieving factors…"
                      value={editFields.condition}
                      onChange={(e) =>
                        setEditFields({
                          ...editFields,
                          condition: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-text-secondary mb-1">
                      Current status
                    </div>
                    <Select
                      options={filterOptions.filter((o) => o.value !== "all")}
                      value={editFields.status}
                      onChange={(val) =>
                        setEditFields({ ...editFields, status: val })
                      }
                    />
                  </div>
                </div>
              </section>

              {/* AYURVEDIC ASSESSMENT */}
              <section className="border border-border/60 rounded-xl p-4 bg-emerald-50/40">
                <h4 className="text-sm font-semibold text-text-primary mb-3">
                  Ayurvedic Assessment
                </h4>
                <div className="grid md:grid-cols-3 gap-3 mb-3">
                  <Input
                    label="Prakriti (constitution)"
                    placeholder="e.g. Vata-Pitta"
                    value={editFields.prakriti}
                    onChange={(e) =>
                      setEditFields((prev) => ({
                        ...prev,
                        prakriti: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Vikriti (current imbalance)"
                    placeholder="e.g. Pitta aggravation"
                    value={editFields.vikriti}
                    onChange={(e) =>
                      setEditFields((prev) => ({
                        ...prev,
                        vikriti: e.target.value,
                      }))
                    }
                  />
                  <div>
                    <div className="text-xs font-medium text-text-secondary mb-1">
                      Agni (digestive fire)
                    </div>
                    <Select
                      options={agniOptions}
                      value={editFields.agni}
                      onChange={(val) =>
                        setEditFields((prev) => ({ ...prev, agni: val }))
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs font-medium text-text-secondary mb-1">
                      Appetite
                    </div>
                    <Select
                      options={appetiteOptions}
                      value={editFields.appetite}
                      onChange={(val) =>
                        setEditFields((prev) => ({ ...prev, appetite: val }))
                      }
                    />
                  </div>
                  <Input
                    label="Bowel habits"
                    placeholder="Regular / constipated / loose / alternate…"
                    value={editFields.bowelHabits}
                    onChange={(e) =>
                      setEditFields((prev) => ({
                        ...prev,
                        bowelHabits: e.target.value,
                      }))
                    }
                  />
                  <div>
                    <div className="text-xs font-medium text-text-secondary mb-1">
                      Sleep quality
                    </div>
                    <Select
                      options={sleepOptions}
                      value={editFields.sleepQuality}
                      onChange={(val) =>
                        setEditFields((prev) => ({
                          ...prev,
                          sleepQuality: val,
                        }))
                      }
                    />
                  </div>
                </div>
              </section>

              {/* VITALS & MEASUREMENTS */}
              <section className="border border-border/60 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-text-primary mb-3">
                  Vitals & Measurements
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <Input
                    label="Height (cm)"
                    type="number"
                    value={editFields.heightCm}
                    onChange={(e) => {
                      const heightCm = e.target.value;
                      const bmi = recalcBmi(heightCm, editFields.weightKg);
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
                      const bmi = recalcBmi(editFields.heightCm, weightKg);
                      setEditFields((prev) => ({
                        ...prev,
                        weightKg,
                        bmi: bmi || "",
                      }));
                    }}
                  />
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
                    label="Blood Pressure"
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

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Input
                    label="Heart Rate (bpm)"
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
                    label="Diet preference"
                    placeholder="Veg / Non-veg / Satvik / Jain…"
                    value={editFields.dietPreferences}
                    onChange={(e) =>
                      setEditFields((prev) => ({
                        ...prev,
                        dietPreferences: e.target.value,
                      }))
                    }
                  />
                  <div>
                    <div className="text-xs font-medium text-text-secondary mb-1">
                      Physical activity
                    </div>
                    <Select
                      options={exerciseOptions}
                      value={editFields.exercisePattern}
                      onChange={(val) =>
                        setEditFields((prev) => ({
                          ...prev,
                          exercisePattern: val,
                        }))
                      }
                    />
                  </div>
                </div>
              </section>

              {/* LIFESTYLE & HISTORY */}
              <section className="border border-border/60 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-text-primary mb-3">
                  History, Allergies & Lifestyle
                </h4>

                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs font-medium text-text-secondary mb-1">
                      Allergies
                    </div>
                    <textarea
                      className="w-full border border-border rounded-md p-2 text-sm"
                      rows={2}
                      placeholder="Drug / food / environmental allergies…"
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
                      Current medications / supplements
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
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs font-medium text-text-secondary mb-1">
                      Past / chronic conditions
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
                      Stress level
                    </div>
                    <Select
                      options={stressOptions}
                      value={editFields.stressLevel}
                      onChange={(val) =>
                        setEditFields((prev) => ({
                          ...prev,
                          stressLevel: val,
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-text-secondary mb-1">
                    Daily routine, occupation, emotional notes, addictions,
                    other lifestyle factors
                  </div>
                  <textarea
                    className="w-full border border-border rounded-md p-2 text-sm"
                    rows={3}
                    placeholder="Briefly capture dinacharya (daily routine), raatricharya (sleep), work nature, addictions, stressors, family support etc."
                    value={editFields.lifestyleNotes}
                    onChange={(e) =>
                      setEditFields((prev) => ({
                        ...prev,
                        lifestyleNotes: e.target.value,
                      }))
                    }
                  />
                </div>
              </section>

              {/* Clinical Reports */}
              <section className="mt-2 border border-border/60 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-text-primary mb-2">
                  Clinical Reports & Doctor Notes
                </h4>

                {/* Existing reports list */}
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto bg-muted/20 rounded-md p-2 border border-border">
                  {(selectedPatient?.clinicalReports || []).length === 0 && (
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
                            {rep.title || "Clinical Note"}
                          </div>
                          <div className="text-[10px] text-text-secondary">
                            {rep.createdAt
                              ? new Date(rep.createdAt).toLocaleString([], {
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
                <div className="space-y-2">
                  <Input
                    placeholder="Report title (e.g. Initial Assessment)"
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
                      Diagnosis / Clinical Impression
                    </div>
                    <textarea
                      className="w-full border border-border rounded-md p-2 text-sm"
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
                      Detailed Notes
                    </div>
                    <textarea
                      className="w-full border border-border rounded-md p-2 text-sm"
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
                      Tests / Investigations Recommended
                    </div>
                    <textarea
                      className="w-full border border-border rounded-md p-2 text-sm"
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
                      Plan / Recommendations
                    </div>
                    <textarea
                      className="w-full border border-border rounded-md p-2 text-sm"
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
                      Follow-up Date (optional)
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
                      Save Clinical Report
                    </Button>
                  </div>
                </div>
              </section>

              {/* Next Appointment + Diet Plan */}
              
              
              
              {/* <section className="border border-border/60 rounded-xl p-4">
                <div className="grid md:grid-cols-2 gap-4 items-end">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-1">
                      Next Appointment
                    </h4>
                    <Input
                      type="datetime-local"
                      value={editFields.nextAppointment}
                      onChange={(e) =>
                        setEditFields({
                          ...editFields,
                          nextAppointment: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mt-4 md:mt-0">
                    <h4 className="text-sm font-semibold text-text-primary mb-2">
                      Diet Plan
                    </h4>
                    <p className="text-xs text-text-secondary mb-3">
                      Open the full-screen diet planner to design or edit this
                      patient's meal plan.
                    </p>

                <Button
                  variant="default"
                  className="w-full bg-green-700 text-white hover:bg-green-800 text-sm"
                  onClick={() => {
                    navigate(`/doctor/diet-builder/${selectedPatient._id}`, {
                      state: {
                        patientName: selectedPatient.name,
                      },
                    });
                  }}
                >
                  Open Diet Planner
                </Button>
               <WeeklyPlanSummaryCard
    clinicalPatientId={selectedPatient._id}
    onOpenPlanner={() =>
      navigate(`/doctor/week-planner/${selectedPatient._id}`, {
        state: { patientName: selectedPatient.name },
      })
    }
  />

              </section> */}
            </div>

            {/* Footer: Save button */}
            <div className="px-6 py-4 border-t border-border flex justify-end bg-white rounded-b-2xl">
              <Button variant="default" onClick={handleUpdatePatient}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;

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
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
    setSelectedPatient(patient);
    setEditFields((prev) => ({
      ...prev,
      condition: patient?.condition || "",
      status: patient?.status || "new",
      nextAppointment: formatDateTimeLocal(patient?.nextAppointment),

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

      const payload = {
        condition: editFields.condition,
        status: editFields.status,
        nextAppointment: editFields.nextAppointment || null,

        heightCm: editFields.heightCm ? Number(editFields.heightCm) : null,
        weightKg: editFields.weightKg ? Number(editFields.weightKg) : null,
        bmi: editFields.bmi ? Number(editFields.bmi) : null,
        bloodPressure: editFields.bloodPressure,
        heartRate: editFields.heartRate
          ? Number(editFields.heartRate)
          : null,
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
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-emerald-50 via-primary/5 to-emerald-100 organic-shadow">
        <div className="absolute -left-16 top-10 h-32 w-32 rounded-full bg-emerald-200/60 blur-2xl" />
        <div className="absolute -right-20 -bottom-10 h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl" />
        <div className="relative p-6 md:p-7 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-700/80 font-semibold mb-1">
                Patient Management
              </p>
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-primary mb-1">
                All your patients in one place
              </h2>
              <p className="text-sm text-text-secondary">
                Search, filter and update clinical details in a focused view.
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2 text-xs">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-emerald-100 shadow-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-emerald-800">
                  {loading ? "Syncing patient list…" : "Patients up to date"}
                </span>
              </div>
              <div className="text-[11px] text-text-secondary">
                Total patients:{" "}
                <span className="font-semibold text-emerald-700">
                  {patients.length}
                </span>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white/80 backdrop-blur rounded-xl border border-border/60 p-3 md:p-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="flex-1 flex flex-col md:flex-row gap-2 md:items-center">
              <Input
                placeholder="Search by name, condition…"
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

            <div className="flex flex-col md:flex-row gap-2 md:items-center">
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
                className="mt-1 md:mt-0"
              >
                Add New Patient
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {errorMsg && patients.length === 0 && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {errorMsg}
        </div>
      )}

      {/* Patient List */}
      <div className="bg-card rounded-2xl border border-border organic-shadow overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/40">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Patients ({patients?.length})
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Click any patient to view full clinical details
            </p>
          </div>
          {loading && (
            <span className="text-sm text-text-secondary flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Loading…
            </span>
          )}
        </div>

        <div className="divide-y divide-border max-h-[480px] overflow-y-auto">
          {patients?.map((patient) => (
            <button
              key={patient?._id || patient?.id}
              className="w-full text-left p-4 hover:bg-muted/30 organic-transition"
              onClick={() => openDetails(patient)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-semibold text-text-primary">
                      {patient?.name}
                    </h4>
                    {patient?.age && (
                      <span className="text-sm text-text-secondary">
                        ({patient?.age}y)
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
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {patient?.condition || "No condition recorded yet."}
                  </p>

                  {patient?.patientAccountId && (
                    <p className="text-xs text-text-secondary mt-2">
                      Account:{" "}
                      <span className="font-medium">
                        {patient.patientAccountId.fullName}
                      </span>{" "}
                      · {patient.patientAccountId.email} ·{" "}
                      {patient.patientAccountId.phoneNumber}
                    </p>
                  )}
                </div>

                <div className="text-right space-y-1 min-w-[120px]">
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded-full ${getStatusColor(
                      patient?.status
                    )}`}
                  >
                    {getStatusLabel(patient?.status)}
                  </span>
                  {patient?.nextAppointment && (
                    <div className="text-xs text-text-secondary">
                      <span className="block font-medium text-[11px]">
                        Next visit
                      </span>
                      {new Date(
                        patient.nextAppointment
                      ).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
          {patients?.length === 0 && !loading && (
            <div className="p-6 text-center text-text-secondary text-sm">
              No patients found. Try adjusting filters or search.
            </div>
          )}
        </div>
      </div>

      {/* New Patient Modal */}
      {showNewPatientModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md organic-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Add New Patient
                </h3>
                <p className="text-xs text-text-secondary">
                  Link to an existing user via email or phone.
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

            <div className="space-y-3 mb-4">
              <Input
                placeholder="Full name"
                value={newPatient.name}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, name: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Age"
                value={newPatient.age}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, age: e.target.value })
                }
              />
              <Select
                options={doshaOptions.filter((o) => o.value !== "all")}
                value={newPatient.dosha}
                onChange={(val) =>
                  setNewPatient({ ...newPatient, dosha: val })
                }
                placeholder="Select Dosha"
              />
              <Input
                placeholder="Primary condition"
                value={newPatient.condition}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, condition: e.target.value })
                }
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
              />
              <Select
                options={filterOptions.filter((o) => o.value !== "all")}
                value={newPatient.status}
                onChange={(val) =>
                  setNewPatient({ ...newPatient, status: val })
                }
                placeholder="Select Status"
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
                Save Patient
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Details / Edit Drawer */}
      {showDetails && selectedPatient && (
        <div className="fixed inset-0 flex justify-end bg-black/30 z-50">
          <div className="w-full max-w-md h-full bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {selectedPatient.name}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium text-text-primary">
                  Basic Info
                </div>
                <div className="text-text-secondary">
                  Age: {selectedPatient.age || "-"}
                </div>
                <div className="text-text-secondary">
                  Dosha: {selectedPatient.dosha || "-"}
                </div>
              </div>

              {selectedPatient.patientAccountId && (
                <div>
                  <div className="font-medium text-text-primary">
                    Account
                  </div>
                  <div className="text-text-secondary">
                    Name: {selectedPatient.patientAccountId.fullName}
                  </div>
                  <div className="text-text-secondary">
                    Email: {selectedPatient.patientAccountId.email}
                  </div>
                  <div className="text-text-secondary">
                    Phone: {selectedPatient.patientAccountId.phoneNumber}
                  </div>
                </div>
              )}

              <div>
                <div className="font-medium text-text-primary mb-1">
                  Condition
                </div>
                <textarea
                  className="w-full border border-border rounded-md p-2 text-sm"
                  rows={3}
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
                <div className="font-medium text-text-primary mb-1">
                  Status
                </div>
                <Select
                  options={filterOptions.filter((o) => o.value !== "all")}
                  value={editFields.status}
                  onChange={(val) =>
                    setEditFields({ ...editFields, status: val })
                  }
                />
              </div>

              {/* Health Profile */}
              <div>
                <div className="font-medium text-text-primary mb-1">
                  Health Profile
                </div>

            <div className="grid md:grid-cols-2 gap-3">
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

            <div className="grid md:grid-cols-2 gap-3">
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
                label="Diet Preferences"
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

                <div className="mb-3">
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

                <div className="mb-3">
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

                <div className="mb-3">
                  <div className="text-xs font-medium text-text-secondary mb-1">
                    Chronic Conditions
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

                <div className="mb-3">
                  <div className="text-xs font-medium text-text-secondary mb-1">
                    Lifestyle Notes
                  </div>
                  <textarea
                    className="w-full border border-border rounded-md p-2 text-sm"
                    rows={3}
                    placeholder="Sleep pattern, stress level, work type, exercise, etc."
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

              {/* Clinical Reports */}
              <div className="mt-6 border-t border-border pt-4">
                <div className="font-medium text-text-primary mb-2">
                  Clinical Reports & Doctor Notes
                </div>

                {/* Existing reports list */}
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
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
                        className="border border-border rounded-md p-2 bg-muted/20"
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
            <div className="space-y-2 rounded-xl border border-border bg-muted/10 p-4">
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
                  Detailed Notes
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
                  Tests / Investigations Recommended
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
                  Plan / Recommendations
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
              </div>

              {/* Next Appointment */}
              <div>
                <div className="font-medium text-text-primary mb-1">
                  Next Appointment
                </div>
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

              {/* Diet Plan Builder */}
              <div className="mt-6 border-t border-border pt-4">
                <div className="font-medium text-text-primary mb-2">
                  Diet Plan
                </div>
                <p className="text-xs text-text-secondary mb-3">
                  Open the full-screen diet planner to design or edit this patient&apos;s meal
                  plan.
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
              </div>

              {/* Save */}
              <div className="pt-4 flex justify-end">
                <Button variant="default" onClick={handleUpdatePatient}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;

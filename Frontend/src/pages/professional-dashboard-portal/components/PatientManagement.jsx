// src/pages/.../PatientManagement.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";


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

  // for details/edit drawer
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
        alert(
          "Please enter the patient's registered email or phone number."
        );
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
    setEditFields({
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
    });
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
      throw new Error(err.message || err.error || "Failed to create report");
    }

    const data = await res.json();
    const updated = data.patient;

    // Update patient list + selected patient
    setPatients((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );
    setSelectedPatient(updated);

    // Clear report form fields
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

      {/* Error (only when no data) */}
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
          {patients?.map((patient) => (
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

                  {/* linked account info */}
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
                  {patient?.nextAppointment && (
                    <div className="text-xs text-text-secondary">
                      Next:{" "}
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
              placeholder="Condition"
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

                <div className="grid grid-cols-2 gap-3 mb-3">
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

                <div className="grid grid-cols-2 gap-3 mb-3">
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

                <div className="grid grid-cols-2 gap-3 mb-3">
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
               Health Profile

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
    Open the full-screen diet planner to design or edit this patient&apos;s meal plan.
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

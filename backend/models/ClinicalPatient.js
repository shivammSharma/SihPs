import mongoose from "mongoose";

const ClinicalPatientSchema = new mongoose.Schema(
  {
    // Basic clinical info
    name: { type: String, required: true },
    age: { type: Number },
    dosha: { type: String },
    condition: { type: String },
    status: { type: String, default: "new" }, // new, active, followup, completed
    lastVisit: { type: Date, default: null },
    nextAppointment: { type: Date, default: null },
    progress: { type: Number, default: 0 },

    // 🔗 link to doctor
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // 🔗 link to auth patient account
    patientAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthPatient",
      required: false,
    },

    // 🧾 Health profile fields
    heightCm: { type: Number, default: null },
    weightKg: { type: Number, default: null },
    bmi: { type: Number, default: null },

    bloodPressure: { type: String, default: "" }, // e.g. "120/80"
    heartRate: { type: Number, default: null },

    allergies: { type: String, default: "" },
    medications: { type: String, default: "" },
    chronicConditions: { type: String, default: "" },

    lifestyleNotes: { type: String, default: "" }, // sleep, stress, habits
    dietPreferences: { type: String, default: "" }, // veg/non-veg, spicy, etc.
    dietPlan: {
  breakfast: { type: Array, default: [] },
  lunch: { type: Array, default: [] },
  dinner: { type: Array, default: [] },
},

  },
  { timestamps: true }
);

const ClinicalPatient =
  mongoose.models.ClinicalPatient ||
  mongoose.model("ClinicalPatient", ClinicalPatientSchema);

export default ClinicalPatient;

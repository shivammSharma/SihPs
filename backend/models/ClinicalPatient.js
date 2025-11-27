// backend/models/ClinicalPatient.js
import mongoose from "mongoose";

const { Schema } = mongoose;

// Sub-schema for clinical reports / doctor notes
const clinicalReportSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    title: { type: String },           // "Initial Assessment", "Week 2 Follow-up", etc.
    summary: { type: String },         // short summary shown in list
    diagnosis: { type: String },       // doctor's impression / diagnosis
    notes: { type: String },           // detailed notes
    testsRecommended: { type: String },// lab / imaging / investigations
    plan: { type: String },            // treatment / diet / lifestyle plan
    followUpDate: { type: Date },      // optional next follow-up date
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true } // allow auto _id
);

// Main ClinicalPatient schema
const ClinicalPatientSchema = new Schema(
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
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // 🔗 link to auth patient account
    patientAccountId: {
      type: Schema.Types.ObjectId,
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

    lifestyleNotes: { type: String, default: "" },   // sleep, stress, habits
    dietPreferences: { type: String, default: "" },  // veg/non-veg, spicy, etc.

    // 🥗 Per-doctor diet plan for this patient
    dietPlan: {
      breakfast: { type: Array, default: [] }, // store raw food objects for now
      lunch: { type: Array, default: [] },
      dinner: { type: Array, default: [] },
      updatedAt: { type: Date },
    },

    // 📄 Clinical reports / notes history
    clinicalReports: {
      type: [clinicalReportSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Avoid OverwriteModelError if hot-reloaded
const ClinicalPatient =
  mongoose.models.ClinicalPatient ||
  mongoose.model("ClinicalPatient", ClinicalPatientSchema);

export default ClinicalPatient;

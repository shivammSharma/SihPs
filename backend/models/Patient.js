// backend/models/patient.js
import mongoose from "mongoose";

// Subschema for clinical reports
const clinicalReportSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },

    title: { type: String, trim: true },          // e.g. "Initial Assessment"
    summary: { type: String, trim: true },        // short summary shown in UI

    diagnosis: { type: String, trim: true },      // doctor's impression / Dx
    notes: { type: String, trim: true },          // detailed notes
    testsRecommended: { type: String, trim: true }, // lab tests / imaging
    plan: { type: String, trim: true },           // diet + lifestyle + meds

    followUpDate: { type: Date },                 // when to come next
  },
  {
    timestamps: true, // gives createdAt / updatedAt per report
  }
);

const PatientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    // 🔹 Diet plan for this patient
    dietPlan: {
      breakfast: {
        type: [mongoose.Schema.Types.Mixed], // store raw food objects for now
        default: [],
      },
      lunch: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },
      dinner: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },
      lastUpdated: {
        type: Date,
      },
    },

    // 🔹 Clinical reports & doctor notes (ROOT LEVEL, not inside dietPlan)
    clinicalReports: [clinicalReportSchema],
  },
  {
    timestamps: true,
  }
);

// Avoid OverwriteModelError in dev / hot reload
const Patient =
  mongoose.models.Patient || mongoose.model("Patient", PatientSchema);

export default Patient;

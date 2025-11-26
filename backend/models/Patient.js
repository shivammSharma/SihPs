// backend/models/patient.js
import mongoose from "mongoose";

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
      clinicalReports: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },

        title: { type: String },          // e.g. "Initial Assessment", "Follow-up Week 2"
        summary: { type: String },        // short summary shown in UI

        diagnosis: { type: String },      // doctor's impression / Ayurvedic diagnosis
        notes: { type: String },          // detailed notes (SOAP style, etc.)
        testsRecommended: { type: String }, // lab tests / imaging etc.
        plan: { type: String },           // diet + lifestyle + medication plan

        followUpDate: { type: Date },     // when to come next
        createdAt: { type: Date, default: Date.now },
      },
    ],
      lastUpdated: {
        type: Date,
      },
    },

  },
  {
    timestamps: true,
  }
);

// ⬇ THIS LINE IS THE IMPORTANT CHANGE
const Patient =
  mongoose.models.Patient || mongoose.model("Patient", PatientSchema);

export default Patient;

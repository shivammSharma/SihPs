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

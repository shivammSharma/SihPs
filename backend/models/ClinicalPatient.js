// backend/models/ClinicalPatient.js
import mongoose from "mongoose";

const ClinicalPatientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    dosha: {
      type: String,
      default: "vata",
    },

    condition: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["new", "active", "followup", "completed"],
      default: "new",
    },

    lastVisit: {
      type: Date,
      default: null,
    },

    nextAppointment: {
      type: Date,
      default: null,
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ClinicalPatient ||
  mongoose.model("ClinicalPatient", ClinicalPatientSchema);

import mongoose from "mongoose";

// Subschema for clinical reports
const clinicalReportSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },

    title: { type: String, trim: true },
    summary: { type: String, trim: true },

    diagnosis: { type: String, trim: true },
    notes: { type: String, trim: true },
    testsRecommended: { type: String, trim: true },
    plan: { type: String, trim: true },

    followUpDate: { type: Date },
  },
  { timestamps: true }
);

const PatientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    passwordHash: { type: String, required: true },

    // Diet plan
    dietPlan: {
      breakfast: [{ type: mongoose.Schema.Types.Mixed }],
      lunch: [{ type: mongoose.Schema.Types.Mixed }],
      dinner: [{ type: mongoose.Schema.Types.Mixed }],
      lastUpdated: Date,
    },

    // Doctor reports
    clinicalReports: [clinicalReportSchema],
  },
  { timestamps: true }
);

// Avoid overwrite errors
export default mongoose.models.Patient ||
  mongoose.model("Patient", PatientSchema);

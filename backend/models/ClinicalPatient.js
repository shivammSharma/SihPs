import mongoose from "mongoose";

const { Schema } = mongoose;

// ---------------- Clinical Report Schema ----------------
const clinicalReportSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    title: String,
    summary: String,
    diagnosis: String,
    notes: String,
    testsRecommended: String,
    plan: String,
    followUpDate: Date,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// ---------------- Appointment History ----------------
const appointmentHistorySchema = new Schema(
  {
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    sessionType: String,
    date: Date,
    summary: String,
    clinicalReportId: { type: Schema.Types.ObjectId },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// ---------------- Diet Progress ----------------
const dietProgressSchema = new Schema({
  date: String, // YYYY-MM-DD
  breakfast: [String],
  lunch: [String],
  dinner: [String],
});

// ---------------- Clinical Patient Schema ----------------
const ClinicalPatientSchema = new Schema(
  {
    name: { type: String, required: true },
    age: Number,
    dosha: String,
    condition: String,
    status: { type: String, default: "new" },

    lastVisit: Date,
    nextAppointment: Date,
    progress: { type: Number, default: 0 },

    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientAccountId: { type: Schema.Types.ObjectId, ref: "AuthPatient" },

    // Health Profile
    heightCm: Number,
    weightKg: Number,
    bmi: Number,
    bloodPressure: String,
    heartRate: Number,

    allergies: String,
    medications: String,
    chronicConditions: String,
    lifestyleNotes: String,
    dietPreferences: String,

    // Diet plan
    dietPlan: {
      breakfast: { type: Array, default: [] },
      lunch: { type: Array, default: [] },
      dinner: { type: Array, default: [] },
      updatedAt: Date,
    },

    // Clinical reports
    clinicalReports: { type: [clinicalReportSchema], default: [] },

    // NEW FEATURE
    appointmentHistory: { type: [appointmentHistorySchema], default: [] },

    // NEW FEATURE
    dietProgress: { type: [dietProgressSchema], default: [] },
  },
  { timestamps: true }
);

const ClinicalPatient =
  mongoose.models.ClinicalPatient ||
  mongoose.model("ClinicalPatient", ClinicalPatientSchema);

export default ClinicalPatient;

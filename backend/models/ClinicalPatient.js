// backend/models/ClinicalPatient.js
import mongoose from "mongoose";

const ClinicalPatientSchema = new mongoose.Schema(
  {
    // Doctor who owns this clinical record
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // Link to AUTH PATIENT ACCOUNT
    // IMPORTANT: ref MUST match the model name for your auth patient,
    // which in your current project is "Patient" (from models/Patient.js)
    patientAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // Doctor-side fields (what shows in PatientManagement)
    name: { type: String, required: true },
    age: { type: Number },
    dosha: { type: String },
    condition: { type: String },
    status: { type: String, default: "new" }, // new | active | followup | completed

    lastVisit: { type: Date, default: null },
    nextAppointment: { type: Date, default: null },

    progress: { type: Number, default: 0 },

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

    // Simple diet plan (doctor's diet builder)
    dietPlan: {
      breakfast: { type: [mongoose.Schema.Types.Mixed], default: [] },
      lunch: { type: [mongoose.Schema.Types.Mixed], default: [] },
      dinner: { type: [mongoose.Schema.Types.Mixed], default: [] },
      updatedAt: { type: Date },
    },

    // Weekly plans (from week planner)
    weeklyPlans: [
      {
        title: String,
        weekStartDate: Date,
        durationDays: Number, // we allow flexible length
        days: [
          {
            date: Date,
            meals: {
              breakfast: [
                {
                  food: mongoose.Schema.Types.Mixed,
                  checked: { type: Boolean, default: false },
                },
              ],
              lunch: [
                {
                  food: mongoose.Schema.Types.Mixed,
                  checked: { type: Boolean, default: false },
                },
              ],
              dinner: [
                {
                  food: mongoose.Schema.Types.Mixed,
                  checked: { type: Boolean, default: false },
                },
              ],
            },
            exercises: [
              {
                name: String,
                reps: String,
                durationMinutes: Number,
                checked: { type: Boolean, default: false },
              },
            ],
          },
        ],
        progressPercent: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],

    // Clinical reports / notes
    clinicalReports: [
      {
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
        title: String,
        summary: String,
        diagnosis: String,
        notes: String,
        testsRecommended: String,
        plan: String,
        followUpDate: Date,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ClinicalPatient", ClinicalPatientSchema);

// backend/models/ClinicalPatient.js
import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Sub-schema: items inside a meal for a specific day
 */
const weekDayItemSchema = new Schema(
  {
    // food object as stored in dietPlan (allow flexible shape)
    food: { type: Object, default: {} },
    // checked by patient for this item
    checked: { type: Boolean, default: false },
  },
  { _id: true }
);

/**
 * Sub-schema: exercise item for a specific day
 */
const exerciseItemSchema = new Schema(
  {
    id: { type: String }, // optional id or name
    name: { type: String, required: true },
    reps: { type: String }, // e.g. "3x12"
    durationMinutes: { type: Number }, // optional
    notes: { type: String },
    checked: { type: Boolean, default: false },
  },
  { _id: true }
);

/**
 * Sub-schema: one day in a weekly plan
 */
const weekDaySchema = new Schema(
  {
    date: { type: Date, required: true }, // absolute date for the day
    meals: {
      breakfast: { type: [weekDayItemSchema], default: [] },
      lunch: { type: [weekDayItemSchema], default: [] },
      dinner: { type: [weekDayItemSchema], default: [] },
    },
    exercises: { type: [exerciseItemSchema], default: [] },
  },
  { _id: true }
);

/**
 * Sub-schema: weekly plan for a patient
 */
const weeklyPlanSchema = new Schema(
  {
    title: { type: String, default: "Weekly Plan" },
    // weekStartDate identifies the week (e.g., Monday)
    weekStartDate: { type: Date, required: true },

    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    // days: 7 entries, each with date, meals and exercises
    days: { type: [weekDaySchema], default: [] },

    // optional summary / progress cached (calculated server-side when saved/updated)
    progressPercent: { type: Number, default: 0 },
    durationDays: { type: Number, default: 7 },
  },
  { _id: true }
);

/**
 * Sub-schema: one clinical report / visit note
 * (per visit entry, not the full patient record)
 */
const clinicalReportSchema = new Schema(
  {
    visitDate: { type: Date, default: Date.now },

    notes: { type: String },
    diagnosis: { type: String },

    // Optional visit-level vitals
    heightCm: Number,
    weightKg: Number,
    bmi: Number,
    bloodPressure: String,
    heartRate: Number,

    // Optional context
    allergies: String,
    medications: String,
    chronicConditions: String,
    lifestyleNotes: String,
    dietPreferences: String,

    // Optional snapshot of diet plan at this visit
    dietPlanSnapshot: {
      breakfast: { type: [Schema.Types.Mixed], default: [] },
      lunch: { type: [Schema.Types.Mixed], default: [] },
      dinner: { type: [Schema.Types.Mixed], default: [] },
      updatedAt: { type: Date },
    },
  },
  { _id: true, timestamps: true }
);

/**
 * MAIN SCHEMA: ClinicalPatient
 * This is the doctor-specific clinical record linked to an AuthPatient.
 */
const clinicalPatientSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // Link to AUTH PATIENT ACCOUNT
    // Adjust `ref` to match your actual auth patient model name
    authPatientId: {
      type: Schema.Types.ObjectId,
      ref: "AuthPatient", // or "Patient" if that's the real model name
      required: true,
    },

    // Basic profile info
    name: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    dosha: { type: String },
    condition: { type: String },

    status: {
      type: String,
      enum: ["new", "active", "followup", "completed", "inactive"],
      default: "new",
    },

    lastVisit: { type: Date, default: null },
    nextAppointment: { type: Date, default: null },

    progress: { type: Number, default: 0 },

    // Health profile (current / latest)
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

    // Current active diet plan (doctor's diet builder)
    dietPlan: {
      breakfast: { type: [Schema.Types.Mixed], default: [] },
      lunch: { type: [Schema.Types.Mixed], default: [] },
      dinner: { type: [Schema.Types.Mixed], default: [] },
      updatedAt: { type: Date },
    },

    // History of clinical reports / visit notes
    clinicalReports: {
      type: [clinicalReportSchema],
      default: [],
    },

    // Weekly plans for this patient
    weeklyPlans: {
      type: [weeklyPlanSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Model export
const ClinicalPatient = mongoose.model(
  "ClinicalPatient",
  clinicalPatientSchema
);

export default ClinicalPatient;

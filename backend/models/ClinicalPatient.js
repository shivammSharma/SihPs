// backend/models/ClinicalPatient.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const MealItemSchema = new Schema(
  {
    food: { type: Schema.Types.Mixed, required: false }, // full food object from data.json
    notes: { type: String },
    checked: { type: Boolean, default: false },
  },
  { _id: false }
);

const ExerciseSchema = new Schema(
  {
    name: { type: String, required: true },
    reps: { type: String },
    durationMinutes: { type: Number },
    checked: { type: Boolean, default: false },
  },
  { _id: false }
);

const WeeklyDaySchema = new Schema(
  {
    date: { type: Date, required: true },
    meals: {
      breakfast: { type: [MealItemSchema], default: [] },
      lunch: { type: [MealItemSchema], default: [] },
      dinner: { type: [MealItemSchema], default: [] },
    },
    exercises: { type: [ExerciseSchema], default: [] },
  },
  { _id: false }
);
const WeeklyPlanDaySchema = new mongoose.Schema(
  {
    date: Date,
    meals: {
      breakfast: [
        {
          food: mongoose.Schema.Types.Mixed, // full food object
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
  { _id: false }
);

const WeeklyPlanSchema = new Schema(
  {
    title: { type: String, required: true },
    weekStartDate: { type: Date, required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    durationDays: { type: Number, default: 7 },
    days: { type: [WeeklyDaySchema], default: [] },
    progressPercent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ClinicalPatientSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Patient", // your auth patient model name
      required: true,
    },

    name: { type: String, required: true },
    age: { type: Number },
    dosha: { type: String },
    condition: { type: String },
    status: { type: String, default: "new" },
    lastVisit: { type: Date },
    nextAppointment: { type: Date },
    progress: { type: Number, default: 0 },

    // health profile
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

    // main diet plan
    dietPlan: {
      breakfast: { type: [Schema.Types.Mixed], default: [] },
      lunch: { type: [Schema.Types.Mixed], default: [] },
      dinner: { type: [Schema.Types.Mixed], default: [] },
      updatedAt: { type: Date },
    },

    // clinical reports
    clinicalReports: [
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
    ],

    // WEEKLY PLANS (important field)
    weeklyPlans: { type: [WeeklyPlanSchema], default: [] },
  },
  { timestamps: true }
);

const ClinicalPatient = mongoose.model(
  "ClinicalPatient",
  ClinicalPatientSchema
);

export default ClinicalPatient;

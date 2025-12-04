// backend/routes/patients.js
import express from "express";
import ClinicalPatient from "../models/ClinicalPatient.js";
import AuthPatient from "../models/authPatient.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Middleware: only allow doctor role
 */
function requireDoctor(req, res, next) {
  if (req.user?.role !== "doctor") {
    return res.status(403).json({ message: "Doctor access required" });
  }
  next();
}

/**
 * GET /api/patients
 * Doctor sees only their own patients
 */
router.get("/", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { status, dosha, q } = req.query;

    const filter = { doctorId };

    if (status && status !== "all") filter.status = status;
    if (dosha && dosha !== "all") filter.dosha = new RegExp(dosha, "i");
    if (q) filter.name = new RegExp(q, "i");

    const patients = await ClinicalPatient.find(filter)
      .sort({ createdAt: -1 })
      .populate("patientAccountId", "fullName email phoneNumber");

    res.json(patients);
  } catch (err) {
    console.error("GET /api/patients error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

/**
 * GET /api/patients/:id
 * Doctor fetches a single clinical patient (must be owner)
 */
router.get("/:id", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const clinicalPatientId = req.params.id;

    const patient = await ClinicalPatient.findOne({
      _id: clinicalPatientId,
      doctorId,
    })
      .populate("patientAccountId", "fullName email phoneNumber")
      .populate("doctorId", "fullName email phoneNumber");

    if (!patient) {
      return res
        .status(404)
        .json({ message: "Patient not found or not your patient" });
    }

    return res.json(patient);
  } catch (err) {
    console.error("GET /api/patients/:id error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

/**
 * POST /api/patients
 * Doctor creates a clinical-patient record linked to themselves
 * BUT ONLY if the patient has an auth account already
 */
router.post("/", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;

    const {
      age,
      dosha,
      condition,
      status,
      lastVisit,
      nextAppointment,
      progress,
      patientIdentifier,

      // health profile fields
      heightCm,
      weightKg,
      bmi,
      bloodPressure,
      heartRate,
      allergies,
      medications,
      chronicConditions,
      lifestyleNotes,
      dietPreferences,
    } = req.body;

    if (!condition) {
      return res.status(400).json({ error: "Condition is required" });
    }

    if (!patientIdentifier) {
      return res.status(400).json({
        error:
          "Patient identifier (registered email or phone) is required to link account",
      });
    }

    const identifier = String(patientIdentifier).trim();

    const authPatient = await AuthPatient.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phoneNumber: identifier }],
    });

    if (!authPatient) {
      return res.status(400).json({
        error:
          "No patient account found with this email/phone. Ask the patient to sign up first.",
      });
    }

    const patient = new ClinicalPatient({
      // from account
      name: authPatient.fullName,
      age,
      dosha,
      condition,
      status: status || "new",
      lastVisit: lastVisit ? new Date(lastVisit) : null,
      nextAppointment: nextAppointment ? new Date(nextAppointment) : null,
      progress: progress ?? 0,

      doctorId,
      patientAccountId: authPatient._id,

      heightCm,
      weightKg,
      bmi,
      bloodPressure,
      heartRate,
      allergies,
      medications,
      chronicConditions,
      lifestyleNotes,
      dietPreferences,
    });

    const saved = await patient.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST /api/patients error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

/**
 * PUT /api/patients/:id
 * Doctor can only update their own clinical-patient
 */
router.put("/:id", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const clinicalPatientId = req.params.id;
    const updates = req.body;

    const patient = await ClinicalPatient.findOneAndUpdate(
      { _id: clinicalPatientId, doctorId },
      updates,
      { new: true }
    ).populate("patientAccountId", "fullName email phoneNumber");

    if (!patient) {
      return res
        .status(404)
        .json({ error: "Patient not found or not your patient" });
    }

    res.json(patient);
  } catch (err) {
    console.error("PUT /api/patients/:id error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

/**
 * DELETE /api/patients/:id
 */
router.delete("/:id", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const clinicalPatientId = req.params.id;

    const patient = await ClinicalPatient.findOneAndDelete({
      _id: clinicalPatientId,
      doctorId,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ error: "Patient not found or not your patient" });
    }

    res.json({ message: "Deleted", id: clinicalPatientId });
  } catch (err) {
    console.error("DELETE /api/patients/:id error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

/**
 * POST /api/patients/:id/diet-plan
 * Save diet plan on the CLINICAL patient (per doctor)
 */
/**
 * POST /api/patients/:id/diet-plan
 * Save diet plan on the CLINICAL patient (per doctor)
 *
 * Validates payload shape (breakfast/lunch/dinner arrays) and minimal food item shape.
 * Returns the updated patient document (not { message, patient }).
 */
router.post("/:id/diet-plan", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const clinicalPatientId = req.params.id;

    // Acceptable body shape: { breakfast: [...], lunch: [...], dinner: [...] }
    const { breakfast = [], lunch = [], dinner = [] } = req.body || {};

    // Basic validation helpers
    const isArray = (v) => Array.isArray(v);
    const isValidFoodItem = (it) =>
      it && typeof it === "object" && (it.name || it["Food Item"] || it["FoodItem"] || it.id);

    if (!isArray(breakfast) || !isArray(lunch) || !isArray(dinner)) {
      return res.status(400).json({
        message:
          "Invalid dietPlan shape. Expect breakfast, lunch and dinner to be arrays.",
      });
    }

    // Validate contents lightly to avoid storing primitives/strings by mistake
    const invalid =
      [...breakfast, ...lunch, ...dinner].some((f) => !isValidFoodItem(f));

    if (invalid) {
      return res.status(400).json({
        message:
          "One or more food items are malformed. Each item should be an object with at least a name or id.",
      });
    }

    // Perform update (ensure doctor owns this clinical patient)
    const patient = await ClinicalPatient.findOneAndUpdate(
      { _id: clinicalPatientId, doctorId },
      {
        $set: {
          dietPlan: {
            breakfast,
            lunch,
            dinner,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    )
      .populate("patientAccountId", "fullName email phoneNumber")
      .populate("doctorId", "fullName email phoneNumber");

    if (!patient) {
      return res
        .status(404)
        .json({ message: "Patient not found for this doctor" });
    }

    // Return the updated patient document directly (clean API)
    return res.json(patient);
  } catch (err) {
    console.error("POST /api/patients/:id/diet-plan error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Server error" });
  }
});

/**
 * POST /api/patients/:id/week-plan
 * Create a new weekly plan for a clinical patient (doctor-only)
 *
 * Body shape:
 * {
 *   title: "Week 1 - Jan 2026",
 *   weekStartDate: "2026-01-12",
 *   days: [
 *     { date: "2026-01-12", meals: { breakfast: [{ food: {...} }], lunch: [...], dinner: [...] }, exercises: [{ name, reps, durationMinutes }] },
 *     ... (7 items)
 *   ]
 * }
 *
 * Returns updated patient document.
 */
/**
 * POST /api/patients/:id/week-plan
 * Create a new flexible-length plan for a clinical patient (doctor-only)
 */
router.post("/:id/week-plan", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const clinicalPatientId = req.params.id;

    const {
      title = "Weekly Plan",
      weekStartDate,
      days,
      durationDays,
    } = req.body || {};

    if (!weekStartDate || !Array.isArray(days) || days.length === 0) {
      return res.status(400).json({
        message:
          "Missing weekStartDate or days (expect array of daily plans).",
      });
    }

    // Validate each day has a date
    for (const d of days) {
      if (!d.date) {
        return res.status(400).json({
          message: "Each day must have a date field.",
        });
      }
    }

    const plan = {
      title,
      weekStartDate: new Date(weekStartDate),
      doctorId,
      days,
      durationDays: durationDays || days.length, // FLEXIBLE LENGTH
      createdAt: new Date(),
      updatedAt: new Date(),
      progressPercent: 0,
    };

    const patient = await ClinicalPatient.findOneAndUpdate(
      { _id: clinicalPatientId, doctorId },
      { $push: { weeklyPlans: plan } },
      { new: true }
    ).populate("patientAccountId", "fullName email phoneNumber");

    if (!patient) {
      return res
        .status(404)
        .json({ message: "Patient not found for this doctor" });
    }

    return res.json(patient);
  } catch (err) {
    console.error("POST /api/patients/:id/week-plan error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


/**
 * GET /api/patients/:id/week-plans
 * Get list of weekly plans for a clinical patient (doctor-only OR patient owner)
 */
router.get("/:id/week-plans", verifyToken, async (req, res) => {
  try {
    const requesterId = req.user.id;
    const role = req.user.role;
    const clinicalPatientId = req.params.id;

    const patient = await ClinicalPatient.findById(clinicalPatientId)
      .populate("doctorId", "fullName email phoneNumber")
      .populate("patientAccountId", "fullName email phoneNumber")
      .lean();

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // access control: doctor must own the patient, patient must be the linked auth account
    if (role === "doctor") {
      if (String(patient.doctorId?._id) !== String(requesterId)) {
        return res.status(403).json({ message: "Doctor access required for this patient" });
      }
    } else if (role === "patient") {
      if (String(patient.patientAccountId?._id) !== String(requesterId)) {
        return res.status(403).json({ message: "Access denied" });
      }
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.json({ weeklyPlans: patient.weeklyPlans || [] });
  } catch (err) {
    console.error("GET /api/patients/:id/week-plans error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/patients/:id/week-plans/:planId
 * Get single week plan (doctor or patient owner)
 */
router.get("/:id/week-plans/:planId", verifyToken, async (req, res) => {
  try {
    const requesterId = req.user.id;
    const role = req.user.role;
    const clinicalPatientId = req.params.id;
    const planId = req.params.planId;

    const patient = await ClinicalPatient.findById(clinicalPatientId)
      .populate("doctorId", "fullName email phoneNumber")
      .populate("patientAccountId", "fullName email phoneNumber")
      .lean();

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // same access control as above
    if (role === "doctor") {
      if (String(patient.doctorId?._id) !== String(requesterId)) {
        return res.status(403).json({ message: "Doctor access required for this patient" });
      }
    } else if (role === "patient") {
      if (String(patient.patientAccountId?._id) !== String(requesterId)) {
        return res.status(403).json({ message: "Access denied" });
      }
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const plan = (patient.weeklyPlans || []).find((p) => String(p._id) === String(planId));
    if (!plan) return res.status(404).json({ message: "Weekly plan not found" });

    return res.json({ plan });
  } catch (err) {
    console.error("GET single week plan error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /api/patients/:id/week-plans/:planId/check
 * Toggle/check an item for a day (patient-only)
 *
 * Body:
 * { dayIndex: 0..6, kind: 'meal'|'exercise', mealKey: 'breakfast'|'lunch'|'dinner' (if meal), itemIndex: integer, checked: true|false }
 *
 * Returns updated weekly plan and updated progressPercent.
 */
router.patch("/:id/week-plans/:planId/check", verifyToken, async (req, res) => {
  try {
    const requesterId = req.user.id;
    const role = req.user.role;
    const clinicalPatientId = req.params.id;
    const planId = req.params.planId;

    if (role !== "patient") {
      return res.status(403).json({ message: "Only patients can check/uncheck items" });
    }

    // find patient and ensure ownership
    const patient = await ClinicalPatient.findById(clinicalPatientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    if (String(patient.patientAccountId) !== String(requesterId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { dayIndex, kind, mealKey, itemIndex, checked } = req.body || {};

    if (typeof dayIndex !== "number" || dayIndex < 0 || dayIndex >= (patient.weeklyPlans?.[0]?.days?.length || 7)) {
      // we'll locate a plan and its days below; do a basic validation later
    }

    // locate plan
    const plan = patient.weeklyPlans.id(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // basic validation
    if (typeof dayIndex !== "number" || dayIndex < 0 || dayIndex >= plan.days.length) {
      return res.status(400).json({ message: "Invalid dayIndex" });
    }

    const day = plan.days[dayIndex];

    if (kind === "meal") {
      if (!["breakfast", "lunch", "dinner"].includes(mealKey)) {
        return res.status(400).json({ message: "Invalid mealKey" });
      }
      if (typeof itemIndex !== "number" || itemIndex < 0 || itemIndex >= (day.meals[mealKey]?.length || 0)) {
        return res.status(400).json({ message: "Invalid itemIndex" });
      }
      day.meals[mealKey][itemIndex].checked = !!checked;
    } else if (kind === "exercise") {
      if (typeof itemIndex !== "number" || itemIndex < 0 || itemIndex >= (day.exercises?.length || 0)) {
        return res.status(400).json({ message: "Invalid itemIndex for exercise" });
      }
      day.exercises[itemIndex].checked = !!checked;
    } else {
      return res.status(400).json({ message: "Invalid kind, expected 'meal' or 'exercise'" });
    }

    plan.updatedAt = new Date();

    // compute progress: percent of checked items across the plan
    let totalItems = 0;
    let checkedItems = 0;
    for (const d of plan.days) {
      for (const mk of ["breakfast", "lunch", "dinner"]) {
        const arr = d.meals[mk] || [];
        totalItems += arr.length;
        checkedItems += arr.filter((it) => it.checked).length;
      }
      const exArr = d.exercises || [];
      totalItems += exArr.length;
      checkedItems += exArr.filter((it) => it.checked).length;
    }
    plan.progressPercent = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);

    await patient.save();

    return res.json({ plan, progressPercent: plan.progressPercent });
  } catch (err) {
    console.error("PATCH week-plan check error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


/**
 * POST /api/patients/:id/report
 * Add clinical report / doctor notes on CLINICAL patient
 */
router.post("/:id/report", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const clinicalPatientId = req.params.id;
    const {
      title,
      summary,
      diagnosis,
      notes,
      testsRecommended,
      plan,
      followUpDate,
    } = req.body || {};

    const patient = await ClinicalPatient.findOne({
      _id: clinicalPatientId,
      doctorId, // ensure this doctor owns the patient
    });

    if (!patient) {
      return res
        .status(404)
        .json({ message: "Patient not found or not your patient" });
    }

    const report = {
      doctorId,
      title: title || "Clinical Note",
      summary: summary || "",
      diagnosis: diagnosis || "",
      notes: notes || "",
      testsRecommended: testsRecommended || "",
      plan: plan || "",
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      createdAt: new Date(),
    };

    // `clinicalReports` is defined in ClinicalPatientSchema
    patient.clinicalReports.push(report);
    await patient.save();

    return res.json({
      message: "Report added",
      patient,
    });
  } catch (err) {
    console.error("Create report error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

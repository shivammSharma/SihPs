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

/* =========================================================
   GET ALL CLINICAL PATIENTS FOR LOGGED-IN DOCTOR
   GET /api/patients
   ========================================================= */
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

/* =========================================================
   OPTIONAL: GET SINGLE CLINICAL PATIENT (legacy /single route)
   GET /api/patients/single/:id
   ========================================================= */
router.get("/single/:id", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const clinicalPatientId = req.params.id;

    const patient = await ClinicalPatient.findOne({
      _id: clinicalPatientId,
      doctorId,
    })
      .populate("patientAccountId", "fullName email phoneNumber")
      .populate("clinicalReports");

    if (!patient) {
      return res
        .status(404)
        .json({ message: "Patient not found or not your patient" });
    }

    res.json(patient);
  } catch (err) {
    console.error("GET /api/patients/single/:id error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

/* =========================================================
   CREATE CLINICAL RECORD (doctor links to existing auth patient)
   POST /api/patients
   ========================================================= */
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
      $or: [
        { email: identifier.toLowerCase() },
        { phoneNumber: identifier },
      ],
    });

    if (!authPatient) {
      return res.status(400).json({
        error:
          "No patient account found with this email/phone. Ask the patient to sign up first.",
      });
    }

    const patient = new ClinicalPatient({
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

/* =========================================================
   GET SINGLE CLINICAL PATIENT (doctor-owned)
   GET /api/patients/:id
   -> used by DoctorDietBuilderPage & DoctorWeekPlanner
   ========================================================= */
router.get("/:id", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const clinicalPatientId = req.params.id;

    const patient = await ClinicalPatient.findOne({
      _id: clinicalPatientId,
      doctorId,
    }).populate("patientAccountId", "fullName email phoneNumber");

    if (!patient) {
      return res
        .status(404)
        .json({ message: "Patient not found or not your patient" });
    }

    // Respond as { patient } for compatibility with existing frontend
    res.json({ patient });
  } catch (err) {
    console.error("GET /api/patients/:id error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

/* =========================================================
   UPDATE CLINICAL RECORD
   PUT /api/patients/:id
   ========================================================= */
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

/* =========================================================
   DELETE CLINICAL RECORD
   DELETE /api/patients/:id
   ========================================================= */
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

/* =========================================================
   DIET PLAN SAVE
   POST /api/patients/:id/diet-plan
   ========================================================= */
router.post("/:id/diet-plan", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const clinicalPatientId = req.params.id;
    const { breakfast = [], lunch = [], dinner = [] } = req.body || {};

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
    ).populate("patientAccountId", "fullName email phoneNumber");

    if (!patient) {
      return res
        .status(404)
        .json({ message: "Patient not found for this doctor" });
    }

    return res.json({
      message: "Diet plan updated",
      patient,
    });
  } catch (err) {
    console.error("POST /api/patients/:id/diet-plan error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Server error" });
  }
});

/* =========================================================
   CLINICAL REPORT ADD
   POST /api/patients/:id/report
   ========================================================= */
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
      doctorId,
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

    if (!Array.isArray(patient.clinicalReports)) {
      patient.clinicalReports = [];
    }

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

/* =========================================================
   WEEKLY PLAN - CREATE (DOCTOR)
   POST /api/patients/:id/week-plan
   ========================================================= */
router.post(
  "/:id/week-plan",
  verifyToken,
  requireDoctor,
  async (req, res) => {
    try {
      const doctorId = req.user.id;
      const clinicalPatientId = req.params.id;
      const { title, weekStartDate, days, durationDays } = req.body || {};

      if (!title || !weekStartDate || !Array.isArray(days) || !days.length) {
        return res.status(400).json({
          success: false,
          message: "title, weekStartDate and days[] are required",
        });
      }

      const patient = await ClinicalPatient.findOne({
        _id: clinicalPatientId,
        doctorId,
      });

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Clinical patient not found for this doctor",
        });
      }

      const normalizedDays = days.map((d) => ({
        date: d.date ? new Date(d.date) : null,
        meals: {
          breakfast: d.meals?.breakfast || [],
          lunch: d.meals?.lunch || [],
          dinner: d.meals?.dinner || [],
        },
        exercises: d.exercises || [],
      }));

      const plan = {
        title,
        weekStartDate: new Date(weekStartDate),
        doctorId,
        durationDays: durationDays || normalizedDays.length,
        days: normalizedDays,
        progressPercent: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedPatient = await ClinicalPatient.findOneAndUpdate(
        { _id: clinicalPatientId, doctorId },
        { $push: { weeklyPlans: plan } },
        { new: true }
      );

      if (!updatedPatient) {
        return res.status(404).json({
          success: false,
          message: "Clinical patient not found after update",
        });
      }

      const createdPlan =
        updatedPatient.weeklyPlans[
          updatedPatient.weeklyPlans.length - 1
        ];

      return res.json({
        success: true,
        message: "Weekly plan created",
        plan: createdPlan,
      });
    } catch (err) {
      console.error("Create weekly plan error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Server error creating weekly plan",
      });
    }
  }
);

/* =========================================================
   WEEKLY PLAN - LIST (DOCTOR OR PATIENT)
   GET /api/patients/:id/week-plans
   ========================================================= */
router.get("/:id/week-plans", verifyToken, async (req, res) => {
  try {
    const clinicalPatientId = req.params.id;
    const user = req.user;

    const patient = await ClinicalPatient.findById(clinicalPatientId);
    if (!patient) {
      return res
        .status(404)
        .json({ message: "Clinical patient not found" });
    }

    if (user.role === "doctor") {
      if (String(patient.doctorId) !== String(user.id)) {
        return res
          .status(403)
          .json({ message: "Not your patient" });
      }
    } else if (user.role === "patient") {
      if (String(patient.patientAccountId) !== String(user.id)) {
        return res
          .status(403)
          .json({ message: "Not your clinical record" });
      }
    } else {
      return res.status(403).json({
        message: "Only doctor or patient can access weekly plans",
      });
    }

    return res.json({
      weeklyPlans: patient.weeklyPlans || [],
    });
  } catch (err) {
    console.error("GET /api/patients/:id/week-plans error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Server error" });
  }
});

/* =========================================================
   WEEKLY PLAN - GET SINGLE PLAN (DOCTOR OR PATIENT)
   GET /api/patients/:id/week-plans/:planId
   ========================================================= */
router.get("/:id/week-plans/:planId", verifyToken, async (req, res) => {
  try {
    const clinicalPatientId = req.params.id;
    const planId = req.params.planId;
    const user = req.user;

    const patient = await ClinicalPatient.findById(clinicalPatientId);
    if (!patient) {
      return res
        .status(404)
        .json({ message: "Clinical patient not found" });
    }

    if (user.role === "doctor") {
      if (String(patient.doctorId) !== String(user.id)) {
        return res
          .status(403)
          .json({ message: "Not your patient" });
      }
    } else if (user.role === "patient") {
      if (String(patient.patientAccountId) !== String(user.id)) {
        return res
          .status(403)
          .json({ message: "Not your clinical record" });
      }
    } else {
      return res.status(403).json({
        message: "Only doctor or patient can access weekly plans",
      });
    }

    const plan =
      (patient.weeklyPlans || []).find(
        (p) => String(p._id) === String(planId)
      ) || null;

    if (!plan) {
      return res
        .status(404)
        .json({ message: "Weekly plan not found" });
    }

    return res.json({ plan });
  } catch (err) {
    console.error("GET /api/patients/:id/week-plans/:planId error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Server error" });
  }
});

/* =========================================================
   WEEKLY PLAN - PATIENT CHECK/UNCHECK + PROGRESS
   PATCH /api/patients/:id/week-plans/:planId/check
   Body: { dayIndex, kind, mealKey, itemIndex, checked }
   ========================================================= */
router.patch(
  "/:id/week-plans/:planId/check",
  verifyToken,
  async (req, res) => {
    try {
      const clinicalPatientId = req.params.id;
      const planId = req.params.planId;
      const { dayIndex, kind, mealKey, itemIndex, checked } = req.body || {};
      const user = req.user;

      if (user.role !== "patient") {
        return res
          .status(403)
          .json({ message: "Only patients can update their weekly plan" });
      }

      const patient = await ClinicalPatient.findById(clinicalPatientId);
      if (!patient) {
        return res
          .status(404)
          .json({ message: "Clinical patient not found" });
      }

      if (String(patient.patientAccountId) !== String(user.id)) {
        return res
          .status(403)
          .json({ message: "Not your clinical record" });
      }

      // 🔧 SAFETY: ensure all existing weeklyPlans have doctorId set,
      // because the schema requires weeklyPlans[*].doctorId.
      if (Array.isArray(patient.weeklyPlans)) {
        patient.weeklyPlans.forEach((p) => {
          if (!p.doctorId) {
            p.doctorId = patient.doctorId;
          }
        });
      }

      const plan = (patient.weeklyPlans || []).find(
        (p) => String(p._id) === String(planId)
      );
      if (!plan) {
        return res
          .status(404)
          .json({ message: "Weekly plan not found" });
      }

      // Validate day index
      if (
        typeof dayIndex !== "number" ||
        dayIndex < 0 ||
        dayIndex >= (plan.days || []).length
      ) {
        return res
          .status(400)
          .json({ message: "Invalid dayIndex" });
      }

      const day = plan.days[dayIndex];

      if (kind === "meal") {
        if (!["breakfast", "lunch", "dinner"].includes(mealKey)) {
          return res
            .status(400)
            .json({ message: "Invalid mealKey" });
        }
        const arr = day.meals?.[mealKey] || [];
        if (
          typeof itemIndex !== "number" ||
          itemIndex < 0 ||
          itemIndex >= arr.length
        ) {
          return res
            .status(400)
            .json({ message: "Invalid itemIndex for meal" });
        }
        arr[itemIndex].checked = !!checked;
      } else if (kind === "exercise") {
        const arr = day.exercises || [];
        if (
          typeof itemIndex !== "number" ||
          itemIndex < 0 ||
          itemIndex >= arr.length
        ) {
          return res
            .status(400)
            .json({ message: "Invalid itemIndex for exercise" });
        }
        arr[itemIndex].checked = !!checked;
      } else {
        return res.status(400).json({
          message: "Invalid kind; must be 'meal' or 'exercise'",
        });
      }

      // Recalculate progressPercent
      let totalItems = 0;
      let doneItems = 0;

      (plan.days || []).forEach((d) => {
        ["breakfast", "lunch", "dinner"].forEach((mk) => {
          (d.meals?.[mk] || []).forEach((item) => {
            totalItems += 1;
            if (item.checked) doneItems += 1;
          });
        });
        (d.exercises || []).forEach((ex) => {
          totalItems += 1;
          if (ex.checked) doneItems += 1;
        });
      });

      plan.progressPercent =
        totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;
      plan.updatedAt = new Date();

      patient.markModified("weeklyPlans");
      await patient.save();

      return res.json({
        plan,
        progressPercent: plan.progressPercent,
      });
    } catch (err) {
      console.error(
        "PATCH /api/patients/:id/week-plans/:planId/check error:",
        err
      );
      return res.status(500).json({
        message: err.message || "Server error updating weekly plan",
      });
    }
  }
);


export default router;

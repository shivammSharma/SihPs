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
 * ⭐ NEW ROUTE ADDED
 * GET /api/patients/single/:id
 * Fetch one clinical patient (for doctor case profile)
 */
router.get("/single/:id", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const clinicalPatientId = req.params.id;

    const patient = await ClinicalPatient.findOne({
      _id: clinicalPatientId,
      doctorId, // must belong to logged-in doctor
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
    console.error("GET clinical patient error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

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
 * POST /api/patients
 * Create clinical record linked to existing patient account
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

/**
 * PUT /api/patients/:id
 * Update clinical record (doctor-owned)
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
 */
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

/**
 * POST /api/patients/:id/report
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

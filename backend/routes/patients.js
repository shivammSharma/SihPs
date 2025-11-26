import express from "express";
import ClinicalPatient from "../models/ClinicalPatient.js";
import AuthPatient from "../models/authPatient.js";
import Patient from "../models/Patient.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

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
router.get("/", verifyToken, async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role !== "doctor") {
      return res
        .status(403)
        .json({ message: "Only doctors can view patients" });
    }

    const { status, dosha, q } = req.query;
    const filter = { doctorId: id };

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
 * Doctor creates a patient linked to themselves
 * BUT ONLY if the patient has an account already
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role !== "doctor") {
      return res
        .status(403)
        .json({ message: "Only doctors can create patients" });
    }

    const {
  // name (we’re using authPatient.fullName)
  age,
  dosha,
  condition,
  status,
  lastVisit,
  nextAppointment,
  progress,
  patientIdentifier,

  // 🔽 NEW health profile fields
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
  name: authPatient.fullName, // from account
  age,
  dosha,
  condition,
  status: status || "new",
  lastVisit: lastVisit ? new Date(lastVisit) : null,
  nextAppointment: nextAppointment ? new Date(nextAppointment) : null,
  progress: progress ?? 0,
  doctorId: id,
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
 * Doctor can only update their own patient
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role !== "doctor") {
      return res
        .status(403)
        .json({ message: "Only doctors can update patients" });
    }

    const updates = req.body;

    const patient = await ClinicalPatient.findOneAndUpdate(
      { _id: req.params.id, doctorId: id },
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
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role !== "doctor") {
      return res
        .status(403)
        .json({ message: "Only doctors can delete patients" });
    }

    const patient = await ClinicalPatient.findOneAndDelete({
      _id: req.params.id,
      doctorId: id,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ error: "Patient not found or not your patient" });
    }

    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    console.error("DELETE /api/patients/:id error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});
router.post(
  "/:id/diet-plan",
  verifyToken,
  async (req, res) => {
    try {
      const { id: doctorId, role } = req.user;
      if (role !== "doctor") {
        return res
          .status(403)
          .json({ message: "Only doctors can assign diet plans" });
      }

      const { breakfast = [], lunch = [], dinner = [] } = req.body;

      const patient = await ClinicalPatient.findOneAndUpdate(
        { _id: req.params.id, doctorId }, // ensure doctor owns this patient
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
      );

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
  }
);
//save diet plan
router.post("/:id/diet-plan", verifyToken, requireDoctor, async (req, res) => {
  try {
    const { id } = req.params;
    const { breakfast = [], lunch = [], dinner = [] } = req.body || {};

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // optionally ensure this doctor owns this patient
    if (patient.doctorId && patient.doctorId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not assigned to this patient" });
    }

    patient.dietPlan = {
      breakfast,
      lunch,
      dinner,
      lastUpdated: new Date(),
    };

    await patient.save();

    return res.json({
      message: "Diet plan saved",
      patient,
    });
  } catch (err) {
    console.error("Save diet plan error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/report", verifyToken, requireDoctor, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      summary,
      diagnosis,
      notes,
      testsRecommended,
      plan,
      followUpDate,
    } = req.body || {};

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Optional guard: ensure this doctor owns the patient
    if (patient.doctorId && patient.doctorId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not assigned to this patient" });
    }

    const report = {
      doctorId: req.user.id,
      title: title || "Clinical Note",
      summary: summary || "",
      diagnosis: diagnosis || "",
      notes: notes || "",
      testsRecommended: testsRecommended || "",
      plan: plan || "",
      followUpDate: followUpDate || null,
      createdAt: new Date(),
    };

    patient.clinicalReports.push(report);
    await patient.save();

    return res.json({
      message: "Report added",
      patient, // updated patient incl. clinicalReports
    });
  } catch (err) {
    console.error("Create report error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router;

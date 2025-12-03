// backend/routes/patientMe.js
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import Patient from "../models/Patient.js";          // ✅ NEW
import ClinicalPatient from "../models/ClinicalPatient.js";

const router = express.Router();

/**
 * GET /api/patient/overview
 * Used by PATIENT dashboard (not doctor)
 */
router.get("/overview", verifyToken, async (req, res) => {
  try {
    const { id: authUserId, role } = req.user;

    if (role !== "patient") {
      return res.status(403).json({ message: "Patient access only" });
    }

    // 1) Fetch patient profile from unified Patient model
    const authPatient = await Patient.findById(authUserId).lean();
    if (!authPatient) {
      return res.status(404).json({ message: "Patient account not found" });
    }

    // 2) Fetch clinical record
    const clinical = await ClinicalPatient.findOne({
      patientAccountId: authUserId,
    })
      .populate("doctorId", "fullName email phoneNumber")
      .lean();

    const profile = {
      fullName: authPatient.fullName,
      email: authPatient.email,
      phoneNumber: authPatient.phoneNumber,
      gender: authPatient.gender,
    };

    if (!clinical) {
      return res.json({
        profile,
        primaryRecord: null,
        nextAppointment: null,
      });
    }

    const nextAppointment = clinical.nextAppointment
      ? {
          date: clinical.nextAppointment,
          doctor: clinical.doctorId || null,
        }
      : null;

    return res.json({
      profile,
      primaryRecord: clinical,
      nextAppointment,
    });
  } catch (err) {
    console.error("patient overview error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

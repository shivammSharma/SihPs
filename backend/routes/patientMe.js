// backend/routes/patientMe.js
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import Patient from "../models/Patient.js";

const router = express.Router();

/**
 * GET /api/patient/overview
 * Used by PATIENT dashboard (not doctor)
 * - Reads logged-in user from JWT (req.user)
 * - Finds the linked clinical patient document
 * - Returns profile + latest clinical data (including dietPlan)
 */
router.get("/overview", verifyToken, async (req, res) => {
  try {
    // from JWT payload created at login/signup
    const authUserId = req.user.id;
    const role = req.user.role;

    if (role !== "patient") {
      return res.status(403).json({ message: "Patient access only" });
    }

    // Find clinical patient record linked to this logged in patient
    const clinical = await Patient.findOne({
      patientAccountId: authUserId, // 👈 this assumes you linked them when doctor added patient
    })
      .populate("doctorId", "fullName email")
      .lean();

    // If doctor hasn't created a clinical record yet:
    if (!clinical) {
      return res.json({
        profile: {
          fullName: req.user.fullName,
          email: req.user.email,
          phoneNumber: req.user.phoneNumber,
          gender: req.user.gender,
        },
        latestRecord: null,
        nextAppointment: null,
      });
    }

    const nextAppointment = clinical.nextAppointment
      ? {
          date: clinical.nextAppointment,
          doctor: clinical.doctorId || null,
        }
      : null;

    // Here latestRecord includes dietPlan!
    return res.json({
      profile: {
        fullName: req.user.fullName,
        email: req.user.email,
        phoneNumber: req.user.phoneNumber,
        gender: req.user.gender,
      },
      latestRecord: clinical, // has dietPlan.breakfast/lunch/dinner
      nextAppointment,
    });
  } catch (err) {
    console.error("patient overview error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

// backend/routes/doctors.js
import express from "express";
import Doctor from "../models/doctor.js";

const router = express.Router();

/**
 * GET /api/doctors
 * Public list of doctors for patient-side booking UI
 */
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().select({
      fullName: 1,
      specialization: 1,
      verified: 1,
      _id: 1,
    });

    // Return bare array so existing frontend `res.data` still works
    res.json(doctors);
  } catch (err) {
    console.error("DOCTOR LOAD ERROR:", err);
    res.status(500).json({ error: "Error fetching doctors" });
  }
});

export default router;

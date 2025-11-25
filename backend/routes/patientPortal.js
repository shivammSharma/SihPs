import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import AuthPatient from "../models/authPatient.js";
import ClinicalPatient from "../models/ClinicalPatient.js";

const router = express.Router();

router.get("/overview", verifyToken, async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role !== "patient") {
      return res
        .status(403)
        .json({ message: "Only patients can access this endpoint" });
    }

    const profile = await AuthPatient.findById(id)
      .select("-passwordHash -__v")
      .lean();

    if (!profile) {
      return res.status(404).json({ message: "Patient account not found" });
    }

    const clinicalRecords = await ClinicalPatient.find({
      patientAccountId: id,
    })
      .sort({ nextAppointment: 1, createdAt: -1 })
      .populate("doctorId", "fullName email")
      .lean();

    const now = new Date();

    const upcoming = clinicalRecords
      .filter((r) => r.nextAppointment && new Date(r.nextAppointment) >= now)
      .sort(
        (a, b) =>
          new Date(a.nextAppointment) - new Date(b.nextAppointment)
      );

    const nextAppointment = upcoming[0] || null;

    const latestRecord =
      clinicalRecords
        .slice()
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        )[0] || null;

    return res.json({
      profile,
      appointments: clinicalRecords,
      nextAppointment,
      latestRecord,
    });
  } catch (err) {
    console.error("GET /api/patient/overview error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Server error" });
  }
});

export default router;

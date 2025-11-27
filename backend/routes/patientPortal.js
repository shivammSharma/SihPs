import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { requireDoctor } from "../middlewares/authMiddleware.js";
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

router.post("/:id/report", verifyToken, requireDoctor, async (req, res) => {
  try {
    const patientId = req.params.id;
    const {
      title,
      summary,
      diagnosis,
      notes,
      testsRecommended,
      plan,
      followUpDate,
    } = req.body;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const report = {
      title: title || "Clinical Note",
      summary: summary || "",
      diagnosis: diagnosis || "",
      notes: notes || "",
      testsRecommended: testsRecommended || "",
      plan: plan || "",
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      doctorId: req.user.id,
    };

    patient.clinicalReports.push(report);
    await patient.save();

    // return the updated patient so the frontend can refresh its view
    return res.status(201).json({
      message: "Clinical report saved",
      patient,
    });
  } catch (err) {
    console.error("Create report error:", err);
    return res.status(500).json({ message: "Server error creating report" });
  }
});


export default router;

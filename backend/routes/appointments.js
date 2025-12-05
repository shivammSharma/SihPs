// backend/routes/appointments.js
import express from "express";
import Appointment from "../models/appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/doctor.js";
import { verifyToken, requireDoctor } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =========================================================
   CREATE NEW APPOINTMENT  (PATIENT → BOOK SESSION)
   POST /api/appointments
   ========================================================= */
router.post("/", async (req, res) => {
  try {
    console.log("=== BOOK APPOINTMENT DEBUG ===");
    console.log("Incoming body:", req.body);

    const { patientId, doctorId, sessionType, date, time } = req.body || {};

    // 1) Basic required fields
    if (!patientId || !doctorId || !sessionType || !date || !time) {
      console.log("Missing fields:", {
        patientId,
        doctorId,
        sessionType,
        date,
        time,
      });
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2) Ensure PATIENT exists
    const patientExists = await Patient.findById(patientId);
    if (!patientExists) {
      console.log("[APPOINTMENTS] ERROR: Patient not found:", patientId);
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // 3) Ensure DOCTOR exists
    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) {
      console.log("[APPOINTMENTS] ERROR: Doctor not found:", doctorId);
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // 4) Prevent double-booking same doctor, same slot
    const existing = await Appointment.findOne({ doctorId, date, time });
    if (existing) {
      console.log("[APPOINTMENTS] ERROR: Slot already booked:", {
        doctorId,
        date,
        time,
      });
      return res.status(409).json({
        success: false,
        message: "This slot is already booked. Choose another time.",
      });
    }

    // 5) Create appointment
    const newAppointment = await Appointment.create({
      patientId,
      doctorId,
      sessionType,
      date, // stored as string (e.g. "2025-12-05" or "05-12-2025")
      time, // stored as "HH:mm"
      status: "Scheduled",
    });

    console.log("[APPOINTMENTS] CREATED:", newAppointment._id);

    return res.json({
      success: true,
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    console.error("ERROR CREATING APPOINTMENT:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

/* =========================================================
   GET APPOINTMENTS BY PATIENT ID
   GET /api/appointments/patient/:id
   (used by Sessions → "Scheduled Sessions" tab)
   ========================================================= */
router.get("/patient/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("[APPOINTMENTS] Fetch by patient:", id);

    const appointments = await Appointment.find({ patientId: id })
      .populate("doctorId", "fullName email phoneNumber verified")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      appointments,
    });
  } catch (err) {
    console.error("Fetch appointments (patient) error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================================================
   GET APPOINTMENTS FOR LOGGED-IN DOCTOR
   GET /api/appointments/doctor/me
   (used by Doctor DashboardOverview)
   ========================================================= */
router.get("/doctor/me", verifyToken, requireDoctor, async (req, res) => {
  try{
    const doctorId = req.user.id; // from JWT payload
    console.log("[APPOINTMENTS] Fetch for doctor:", doctorId);

    const appointments = await Appointment.find({ doctorId })
      .populate("patientId", "fullName email phoneNumber")
      .sort({ date: 1, time: 1, createdAt: -1 });

    return res.json({
      success: true,
      appointments,
    });
  } catch (err) {
    console.error("Fetch doctor appointments error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================================================
   UPDATE APPOINTMENT STATUS (Doctor only)
   PATCH /api/appointments/:id/status
   body: { status: "Scheduled" | "Completed" | "Cancelled" }
   ========================================================= */
router.patch("/:id/status", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { id } = req.params;
    const { status } = req.body || {};

    const allowed = ["Scheduled", "Completed", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowed.join(", ")}`,
      });
    }

    const updated = await Appointment.findOneAndUpdate(
      { _id: id, doctorId }, // ensure this doctor owns it
      { status },
      { new: true }
    ).populate("patientId", "fullName email phoneNumber");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found for this doctor",
      });
    }

    console.log(
      "[APPOINTMENTS] Status updated:",
      id,
      "->",
      status,
      "by doctor",
      doctorId
    );

    return res.json({
      success: true,
      message: "Status updated",
      appointment: updated,
    });
  } catch (err) {
    console.error("Update appointment status error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;

import express from "express";
import Appointment from "../models/appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/doctor.js";
import ClinicalPatient from "../models/ClinicalPatient.js";

const router = express.Router();

/* ------------------ CREATE NEW APPOINTMENT ------------------ */
router.post("/", async (req, res) => {
  try {
    const { patientId, doctorId, sessionType, date, time } = req.body;

    if (!patientId || !doctorId || !sessionType || !date || !time) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const patientExists = await Patient.findById(patientId);
    const doctorExists = await Doctor.findById(doctorId);

    if (!patientExists) return res.status(404).json({ success: false, message: "Patient not found" });
    if (!doctorExists) return res.status(404).json({ success: false, message: "Doctor not found" });

    const existingSlot = await Appointment.findOne({ doctorId, date, time });
    if (existingSlot) {
      return res.status(409).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    const newAppointment = await Appointment.create({
      patientId,
      doctorId,
      sessionType,
      date,
      time,
      status: "Scheduled",
    });

    return res.json({
      success: true,
      appointment: newAppointment,
    });

  } catch (err) {
    console.error("Appointment Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------ ACCEPT APPOINTMENT ------------------ */
/* ------------------ ACCEPT APPOINTMENT ------------------ */
/* ------------------ ACCEPT APPOINTMENT (SAFE VERSION) ------------------ */
router.post("/:id/accept", async (req, res) => {
  try {
    const aptId = req.params.id;

    console.log("📌 Accepting appointment:", aptId);

    const appointment = await Appointment.findById(aptId)
      .populate("patientId")
      .populate("doctorId");

    if (!appointment) {
      console.log("❌ Appointment not found");
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Validate patient
    if (!appointment.patientId) {
      console.log("❌ Appointment has no valid patientId");
      return res.status(400).json({ success: false, message: "Invalid patient assigned" });
    }

    // Validate doctor
    if (!appointment.doctorId) {
      console.log("❌ Appointment has no valid doctorId");
      return res.status(400).json({ success: false, message: "Invalid doctor assigned" });
    }

    console.log("➡ Patient:", appointment.patientId.fullName);
    console.log("➡ Doctor:", appointment.doctorId.fullName);

    // Mark accepted
    appointment.status = "Accepted";
    await appointment.save();

    // Avoid duplicate creation
    let existing = await ClinicalPatient.findOne({
      doctorId: appointment.doctorId._id,
      patientAccountId: appointment.patientId._id,
    });

    if (!existing) {
      console.log("🟢 Creating new clinical patient record...");

      existing = await ClinicalPatient.create({
        name: appointment.patientId.fullName || "Unnamed",
        age: appointment.patientId.age || null,
        dosha: "vata", // default safe value
        condition: appointment.sessionType || "Consultation",
        status: "new",
        doctorId: appointment.doctorId._id,
        patientAccountId: appointment.patientId._id,
        lastVisit: new Date(),
      });
    }

    const populated = await ClinicalPatient.findById(existing._id)
      .populate("patientAccountId", "fullName email phoneNumber");

    return res.json({
      success: true,
      message: "Appointment accepted",
      patient: populated,
    });

  } catch (err) {
    console.error("🔥 ACCEPT APPOINTMENT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during accept",
      error: err.message, // send real error for debugging
    });
  }
});


/* ------------------ REJECT APPOINTMENT ------------------ */
router.post("/:id/reject", async (req, res) => {
  try {
    const aptId = req.params.id;

    const apt = await Appointment.findById(aptId);
    if (!apt) return res.status(404).json({ success: false, message: "Appointment not found" });

    apt.status = "Rejected";
    await apt.save();

    return res.json({
      success: true,
      message: "Appointment rejected",
    });

  } catch (err) {
    console.error("Reject Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------ GET BY PATIENT ID ------------------ */
router.get("/patient/:id", async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.id })
      .populate("doctorId", "fullName email phoneNumber verified")
      .sort({ createdAt: -1 });

    return res.json({ success: true, appointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------ GET BY DOCTOR ------------------ */
router.get("/doctor/:id", async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.id })
      .populate("patientId", "fullName email phoneNumber age gender")
      .sort({ date: 1, time: 1 });

    return res.json({ success: true, appointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------ DELETE ------------------ */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.json({
      success: true,
      message: "Appointment deleted",
    });

  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

// backend/routes/appointments.js
import express from "express";
import Appointment from "../models/appointment.js";
import Patient from "../models/Patient.js";            // AUTH patient (signup/login)
import Doctor from "../models/doctor.js";
import ClinicalPatient from "../models/ClinicalPatient.js"; // CLINICAL panel
import { verifyToken, requireDoctor } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Helper: build a JS Date from "YYYY-MM-DD" + "HH:mm"
 * (used to keep ClinicalPatient.nextAppointment in sync)
 */
function buildNextAppointmentDate(dateStr, timeStr) {
  if (!dateStr) return null;
  const date = String(dateStr).slice(0, 10); // YYYY-MM-DD
  const time = (timeStr && timeStr.trim() !== "") ? timeStr : "00:00";
  const iso = `${date}T${time}:00`;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

/* -----------------------------------
   CREATE NEW APPOINTMENT (PATIENT BOOKING)
   POST /api/appointments
   ----------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { patientId, doctorId, sessionType, date, time } = req.body;

    console.log("=== BOOK APPOINTMENT DEBUG ===");
    console.log("Incoming body:", req.body);

    if (!patientId || !doctorId || !sessionType || !date || !time) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // 1) Ensure AUTH patient account exists
    const patientAccount = await Patient.findById(patientId);
    if (!patientAccount) {
      console.warn("[APPOINTMENTS] Patient account not found:", patientId);
      return res
        .status(404)
        .json({ success: false, message: "Patient account not found" });
    }

    // 2) Ensure doctor exists
    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) {
      console.warn("[APPOINTMENTS] Doctor not found:", doctorId);
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // 3) Prevent double-booking same doctor, same slot
    const existing = await Appointment.findOne({ doctorId, date, time });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This slot is already booked. Choose another time.",
      });
    }

    // 4) Create the appointment record
    const newAppointment = await Appointment.create({
      patientId,           // AUTH patient id
      doctorId,
      sessionType,
      date,                // "YYYY-MM-DD"
      time,                // "HH:mm"
      status: "Scheduled",
    });

    console.log("[APPOINTMENTS] CREATED:", newAppointment._id);

    // 5) 🔥 AUTO-CREATE / UPDATE CLINICAL PATIENT (for PatientManagement)
    const nextApptDate = buildNextAppointmentDate(date, time);

    // Find an existing ClinicalPatient row for this doctor + auth patient
    let clinical = await ClinicalPatient.findOne({
      doctorId,
      patientAccountId: patientAccount._id,
    });

    if (!clinical) {
      console.log(
        "[APPOINTMENTS] No clinical record found. Creating new ClinicalPatient for doctor panel."
      );

      clinical = await ClinicalPatient.create({
        doctorId,
        patientAccountId: patientAccount._id,

        // basic visible fields on doctor side
        name: patientAccount.fullName || "Patient",
        age: patientAccount.age ?? null,
        dosha: "", // doctor can set later
        condition: sessionType, // initial reason
        status: "active",
        lastVisit: null,
        nextAppointment: nextApptDate,
        progress: 0,
      });
    } else {
      console.log(
        "[APPOINTMENTS] Updating existing ClinicalPatient.nextAppointment"
      );
      clinical.nextAppointment = nextApptDate;
      if (!clinical.status || clinical.status === "new") {
        clinical.status = "active";
      }
      await clinical.save();
    }

    return res.json({
      success: true,
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    console.error("Appointment Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* -----------------------------------
   GET APPOINTMENTS BY PATIENT ID
   GET /api/appointments/patient/:id
   (used by Sessions tab: "Scheduled")
   ----------------------------------- */
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
    console.error("Fetch appointments error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* -----------------------------------
   GET APPOINTMENTS FOR LOGGED-IN DOCTOR
   GET /api/appointments/doctor/me
   (used by DoctorAppointmentsWidget + DashboardOverview)
   ----------------------------------- */
router.get("/doctor/me", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id; // from JWT
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
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* -----------------------------------
   UPDATE STATUS (doctor)
   PATCH /api/appointments/:id/status
   ----------------------------------- */
router.patch("/:id/status", verifyToken, requireDoctor, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

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

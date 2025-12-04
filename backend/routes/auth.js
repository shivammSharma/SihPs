import Patient from "../models/Patient.js";
import Doctor from "../models/doctor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";

const router = express.Router();

// Helper: Create JWT Token
function createToken(id, role, email) {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

/* ============================
   PATIENT SIGNUP
   ============================ */
router.post("/signup/patient", async (req, res) => {
  try {
    let { fullName, email, password, phoneNumber, gender } = req.body;

    if (!fullName || !email || !password || !phoneNumber || !gender) {
      return res.status(400).json({ message: "All fields are required." });
    }

    email = email.trim().toLowerCase();

    const exists = await Patient.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (exists) {
      return res
        .status(409)
        .json({ message: "Email or phone already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      fullName,
      email,
      phoneNumber,
      gender,
      passwordHash,
    });

    const token = createToken(patient._id, "patient", email);

    return res.status(201).json({
      message: "Patient registered successfully",
      patientId: patient._id, // ⭐ IMPORTANT
      user: {
        id: patient._id,
        role: "patient",
        fullName,
        email,
        phoneNumber,
        gender,
      },
      token,
    });
  } catch (err) {
    console.log("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   PATIENT LOGIN (FIXED)
   ============================ */
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const patient = await Patient.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phoneNumber: emailOrPhone },
      ],
    });

    if (!patient) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, patient.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(patient._id, "patient", patient.email);

    return res.json({
      message: "Login successful",
      patientId: patient._id, // ⭐ CRITICAL FOR BOOKING
      user: {
        id: patient._id,
        role: "patient",
        fullName: patient.fullName,
        email: patient.email,
        phoneNumber: patient.phoneNumber,
        gender: patient.gender,
      },
      token,
    });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   DOCTOR SIGNUP (AUTO VERIFIED)
   ============================ */
router.post("/signup/doctor", async (req, res) => {
  try {
    let {
      fullName,
      email,
      password,
      phoneNumber,
      gender,
      reg_no,
      council,
    } = req.body;

    if (!fullName || !email || !password || !reg_no || !council) {
      return res.status(400).json({
        message: "fullName, email, password, reg_no, council are required",
      });
    }

    email = email.toLowerCase().trim();

    const query = [{ email }];
    if (phoneNumber && phoneNumber.trim() !== "") {
      query.push({ phoneNumber });
    }

    const exists = await Doctor.findOne({ $or: query });

    if (exists) {
      return res
        .status(409)
        .json({ message: "Email or phone number already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      fullName,
      email,
      phoneNumber: phoneNumber?.trim() || undefined,
      gender,
      passwordHash,
      reg_no,
      council,
      verified: true, // AUTO VERIFIED
    });

    const token = createToken(doctor._id, "doctor", email);

    return res.status(201).json({
      message: "Doctor registered successfully",
      user: {
        id: doctor._id,
        role: "doctor",
        fullName,
        email,
        phoneNumber,
        gender,
        reg_no,
        council,
        verified: true,
      },
      token,
    });
  } catch (err) {
    console.log("Doctor signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   DOCTOR LOGIN
   ============================ */
router.post("/login/doctor", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const doctor = await Doctor.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phoneNumber: emailOrPhone },
      ],
    });

    if (!doctor)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!doctor.verified)
      return res
        .status(403)
        .json({ message: "Doctor not verified. Cannot login." });

    const ok = await bcrypt.compare(password, doctor.passwordHash);
    if (!ok)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(doctor._id, "doctor", doctor.email);

    return res.json({
      message: "Login successful",
      user: {
        id: doctor._id,
        role: "doctor",
        fullName: doctor.fullName,
        email: doctor.email,
        phoneNumber: doctor.phoneNumber,
        gender: doctor.gender,
        reg_no: doctor.reg_no,
        council: doctor.council,
        verified: doctor.verified,
      },
      token,
    });
  } catch (err) {
    console.log("Doctor login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

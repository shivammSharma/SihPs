import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthPatient from "../models/authPatient.js";
import Doctor from "../models/doctor.js";

const router = express.Router();

function createToken(id, role, email) {
  const payload = { id, role, email };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

/* ========= PATIENT SIGNUP ========= */
router.post("/signup/patient", async (req, res) => {
  try {
    let { fullName, email, password, phoneNumber, gender } = req.body || {};

    if (!fullName || !email || !password || !phoneNumber || !gender) {
      return res.status(400).json({
        message:
          "fullName, email, password, phoneNumber and gender are required",
      });
    }

    fullName = String(fullName).trim();
    email = String(email).trim().toLowerCase();
    phoneNumber = String(phoneNumber).trim();
    gender = String(gender).trim();

    const existing = await AuthPatient.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Email or phone number already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const patient = await AuthPatient.create({
      fullName,
      email,
      phoneNumber,
      gender,
      passwordHash,
    });

    const token = createToken(patient._id, "patient", patient.email);

    return res.status(201).json({
      message: "Patient registered successfully",
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
    console.error("Patient signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ========= DOCTOR SIGNUP ========= */
router.post("/signup/doctor", async (req, res) => {
  try {
    let { fullName, email, password, phoneNumber, gender } = req.body || {};

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "fullName, email and password are required",
      });
    }

    fullName = String(fullName).trim();
    email = String(email).trim().toLowerCase();
    if (phoneNumber) phoneNumber = String(phoneNumber).trim();
    if (gender) gender = String(gender).trim();

    const orConditions = [{ email }];
    if (phoneNumber) orConditions.push({ phoneNumber });

    const existing = await Doctor.findOne({ $or: orConditions });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Email or phone number already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doctor = await Doctor.create({
      fullName,
      email,
      passwordHash,
      phoneNumber: phoneNumber || undefined,
      gender: gender || undefined,
    });

    const token = createToken(doctor._id, "doctor", doctor.email);

    return res.status(201).json({
      message: "Doctor registered successfully",
      user: {
        id: doctor._id,
        role: "doctor",
        fullName: doctor.fullName,
        email: doctor.email,
        phoneNumber: doctor.phoneNumber,
        gender: doctor.gender,
      },
      token,
    });
  } catch (err) {
    console.error("Doctor signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ========= PATIENT LOGIN ========= */
router.post("/login", async (req, res) => {
  try {
    let { emailOrPhone, password } = req.body || {};

    if (!emailOrPhone || !password) {
      return res
        .status(400)
        .json({ message: "emailOrPhone and password are required" });
    }

    emailOrPhone = String(emailOrPhone).trim();

    const patient = await AuthPatient.findOne({
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
    console.error("Patient login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ========= DOCTOR LOGIN ========= */
router.post("/login/doctor", async (req, res) => {
  try {
    let { emailOrPhone, password } = req.body || {};

    if (!emailOrPhone || !password) {
      return res
        .status(400)
        .json({ message: "emailOrPhone and password are required" });
    }

    emailOrPhone = String(emailOrPhone).trim();

    const doctor = await Doctor.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phoneNumber: emailOrPhone },
      ],
    });

    if (!doctor) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, doctor.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

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
      },
      token,
    });
  } catch (err) {
    console.error("Doctor login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

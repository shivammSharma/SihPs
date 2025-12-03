import express from "express";
import Doctor from "../models/doctor.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().select({
      fullName: 1,
      verified: 1,
      _id: 1
    });

    res.json(doctors);
  } catch (err) {
    console.error("DOCTOR LOAD ERROR:", err);
    res.status(500).json({ error: "Error fetching doctors" });
  }
});

export default router;

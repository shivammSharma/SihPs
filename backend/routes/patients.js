import express from "express";
import ClinicalPatient from "../models/ClinicalPatient.js";

const router = express.Router();

/**
 * GET /api/patients
 * Fetch all clinical patients with filters
 */
router.get("/", async (req, res) => {
  try {
    const { status, dosha, q } = req.query;
    const filter = {};

    if (status && status !== "all") filter.status = status;
    if (dosha && dosha !== "all") filter.dosha = new RegExp(dosha, "i");
    if (q) filter.name = new RegExp(q, "i");

    const patients = await ClinicalPatient.find(filter).sort({ createdAt: -1 });
    return res.json(patients);

  } catch (err) {
    console.error("GET /api/patients ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/patients
 * Create a new clinical patient
 */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      age,
      dosha,
      condition,
      status,
      lastVisit,
      nextAppointment,
      progress
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const patient = new ClinicalPatient({
      name,
      age,
      dosha,
      condition,
      status: status || "new",
      lastVisit: lastVisit ? new Date(lastVisit) : null,
      nextAppointment: nextAppointment ? new Date(nextAppointment) : null,
      progress: progress ?? 0
    });

    const saved = await patient.save();
    return res.status(201).json(saved);

  } catch (err) {
    console.error("POST /api/patients ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * PUT /api/patients/:id
 * Update a clinical patient
 */
router.put("/:id", async (req, res) => {
  try {
    const updated = await ClinicalPatient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Patient not found" });
    }

    return res.json(updated);

  } catch (err) {
    console.error("PUT /api/patients/:id ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /api/patients/:id
 * Remove patient
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ClinicalPatient.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Patient not found" });
    }

    return res.json({ message: "Deleted", id: req.params.id });

  } catch (err) {
    console.error("DELETE /api/patients/:id ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

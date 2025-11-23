// server/routes/patients.js
import express from 'express';
import Patient from '../models/Patient.js';

const router = express.Router();

// GET /api/patients -> list patients
router.get('/', async (req, res) => {
  try {
    const { status, dosha, q } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (dosha && dosha !== 'all') filter.dosha = new RegExp(dosha, 'i');
    if (q) filter.name = new RegExp(q, 'i');

    const patients = await Patient.find(filter).sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/patients -> create patient
router.post('/', async (req, res) => {
  try {
    const {
      name, age, dosha, condition, status,
      lastVisit, nextAppointment, progress
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const patient = new Patient({
      name,
      age,
      dosha,
      condition,
      status: status || 'new',
      lastVisit: lastVisit ? new Date(lastVisit) : null,
      nextAppointment: nextAppointment ? new Date(nextAppointment) : null,
      progress: progress ?? 0
    });

    const saved = await patient.save();
    res.status(201).json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/patients/:id -> update patient
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/patients/:id -> delete
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ message: 'Deleted', id: req.params.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

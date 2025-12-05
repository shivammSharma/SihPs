import express from "express";
import Conversation from "../models/Conversation.js";
import ChatMessage from "../models/ChatMessage.js";
import Patient from "../models/Patient.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();

/* -----------------------------------------------------------
   MULTER CONFIG
----------------------------------------------------------- */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* -----------------------------------------------------------
   0) PATIENT → GET MY DOCTORS
----------------------------------------------------------- */
router.get("/patient/my-doctors", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "patient")
      return res.status(403).json({ message: "Patient access required" });

    const patientId = req.user.id;

    const convos = await Conversation.find({ patientId }).populate(
      "doctorId",
      "fullName specialty avatar phoneNumber location"
    );

    const doctors = convos.map((c) => ({
      id: c.doctorId._id,
      name: c.doctorId.fullName,
      specialty: c.doctorId.specialty || "Ayurvedic Specialist",
      avatar: c.doctorId.avatar || "https://i.pravatar.cc/300",
      location: c.doctorId.location,
    }));

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Failed to load doctors" });
  }
});

/* -----------------------------------------------------------
   ⭐ DOCTOR → LIST ALL PATIENTS
----------------------------------------------------------- */
router.get("/doctor/all-patients", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "doctor")
      return res.status(403).json({ message: "Doctor access required" });

    const patients = await Patient.find({}, "fullName avatar dosha status");

    res.json(
      patients.map((p) => ({
        id: p._id,
        name: p.fullName,
        avatar: p.avatar || "https://i.pravatar.cc/300",
        dosha: p.dosha || "Vata",
        status: p.status || "offline",
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Failed to load patients" });
  }
});

/* -----------------------------------------------------------
   1) GET DOCTOR'S CONVERSATIONS
----------------------------------------------------------- */
router.get("/doctor/me/conversations", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "doctor")
      return res.status(403).json({ message: "Doctor access required" });

    const convos = await Conversation.find({ doctorId: req.user.id })
      .populate("patientId", "fullName avatar dosha status")
      .sort({ lastMessageAt: -1 });

    res.json(
      convos.map((c) => ({
        id: c._id,
        patientId: c.patientId._id,
        patient: {
          name: c.patientId.fullName,
          avatar: c.patientId.avatar,
          dosha: c.patientId.dosha || "Vata",
          status: c.patientId.status || "offline",
        },
        lastMessage: c.lastMessage,
        timestamp: c.lastMessageAt,
        unread: c.unreadCountForDoctor || 0,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Failed to load conversations" });
  }
});

/* -----------------------------------------------------------
   2) GET THREAD MESSAGES (FILTER DELETED)
----------------------------------------------------------- */
router.get("/thread", verifyToken, async (req, res) => {
  try {
    const { patientId, doctorId } = req.query;

    const convo = await Conversation.findOne({ patientId, doctorId });
    if (!convo) return res.json([]);

    const messages = await ChatMessage.find({
      conversationId: convo._id,
      deletedFor: { $ne: req.user.id }, // hide user-deleted
    }).sort({ createdAt: 1 });

    const sanitized = messages.map((m) => {
      if (m.isDeletedForEveryone) {
        return {
          ...m._doc,
          text: "🚫 Message deleted",
          fileUrl: null,
          fileType: null,
        };
      }
      return m;
    });

    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages" });
  }
});

/* -----------------------------------------------------------
   3) SEND TEXT MESSAGE
----------------------------------------------------------- */
router.post("/send", verifyToken, async (req, res) => {
  try {
    const { patientId, doctorId, text } = req.body;

    if (!text) return res.status(400).json({ message: "No text message" });

    let convo = await Conversation.findOne({ patientId, doctorId });

    if (!convo) {
      convo = await Conversation.create({
        patientId,
        doctorId,
        lastMessage: text,
        lastMessageAt: new Date(),
      });
    }

    const msg = await ChatMessage.create({
      conversationId: convo._id,
      patientId,
      doctorId,
      senderRole: req.user.role,
      text,
      messageType: "text",
      // status will default to "sent" from the schema
    });

    convo.lastMessage = text;
    convo.lastMessageAt = new Date();
    await convo.save();

    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

/* -----------------------------------------------------------
   4) SEND FILE MESSAGE
----------------------------------------------------------- */
router.post(
  "/send-file",
  verifyToken,
  upload.single("file"),
  async (req, res) => {
    try {
      const { patientId, doctorId } = req.body;

      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      let convo = await Conversation.findOne({ patientId, doctorId });

      if (!convo) {
        convo = await Conversation.create({
          patientId,
          doctorId,
          lastMessage: "📎 File sent",
          lastMessageAt: new Date(),
        });
      }

      const msg = await ChatMessage.create({
        conversationId: convo._id,
        patientId,
        doctorId,
        senderRole: req.user.role,
        fileUrl: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype,
        messageType: "file",
        // status will default to "sent"
      });

      convo.lastMessage = "📎 File sent";
      convo.lastMessageAt = new Date();
      await convo.save();

      res.json(msg);
    } catch (err) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  }
);

/* -----------------------------------------------------------
   ⭐ 5) DELETE FOR ME
----------------------------------------------------------- */
router.patch("/delete-for-me/:msgId", verifyToken, async (req, res) => {
  try {
    const msg = await ChatMessage.findById(req.params.msgId);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    if (!msg.deletedFor.includes(req.user.id)) {
      msg.deletedFor.push(req.user.id);
      await msg.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Delete-for-me failed" });
  }
});

/* -----------------------------------------------------------
   ⭐ 6) DELETE FOR EVERYONE
----------------------------------------------------------- */
router.patch("/delete-for-everyone/:msgId", verifyToken, async (req, res) => {
  try {
    const msg = await ChatMessage.findById(req.params.msgId);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    msg.isDeletedForEveryone = true;
    msg.text = "🚫 Message deleted";
    msg.fileUrl = null;
    msg.fileType = null;

    await msg.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Delete-for-everyone failed" });
  }
});

export default router;

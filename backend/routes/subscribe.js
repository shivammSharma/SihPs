import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Subscriber from "../models/Subscriber.js";

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.json({
        success: true,
        message: "You are already subscribed!",
      });
    }

    await Subscriber.create({ email });

    await transporter.sendMail({
      from: `"AyurNutri" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for subscribing!",
      html: `
        <h2>Welcome to AyurNutri Insights 🌿</h2>
        <p>You will now receive Ayurvedic updates, insights, and wellness tips.</p>
      `,
    });

    return res.json({
      success: true,
      message: "Subscribed successfully! Check your inbox.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;

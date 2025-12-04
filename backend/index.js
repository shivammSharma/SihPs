import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// EXISTING ROUTES
import patientsRouter from "./routes/patients.js";
import authRouter from "./routes/auth.js";
import patientPortalRouter from "./routes/patientPortal.js";
import patientMeRouter from "./routes/patientMe.js";
import subscribeRouter from "./routes/subscribe.js";
import foodScanRoutes from "./routes/foodScanRoutes.js";
import chatbotRoute from "./routes/chatbot.js";
import chatRoutes from "./routes/chat.js"; 

// NEW ROUTES (IMPORTANT)
import doctorRoutes from "./routes/doctors.js";
import appointmentRoutes from "./routes/appointments.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --------------------------
// CORS
// --------------------------
app.use(
  cors({
    origin: "http://localhost:4028",
    credentials: true,
  })
);

app.use(express.json());

// --------------------------
// ROUTES
// --------------------------
app.use("/api/patients", patientsRouter);
app.use("/api/auth", authRouter);
app.use("/api/patient", patientPortalRouter);
app.use("/api/patient", patientMeRouter);
app.use("/api", subscribeRouter);
app.use("/api/food-scan", foodScanRoutes);
app.use("/api/chatbot", chatbotRoute);
app.use("/api/chat", chatRoutes);

// NEW ROUTES
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// --------------------------
// DATABASE + SERVER START
// --------------------------
const PORT = process.env.PORT || 9000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ayurveda";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

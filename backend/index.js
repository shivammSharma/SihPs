import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import patientsRouter from "./routes/patients.js";  // your existing routes
import authRouter from "./routes/auth.js";          // auth routes

dotenv.config();

// Fix __dirname inside ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init app
const app = express();

// =========================
//        MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());

// =========================
//          API ROUTES
// =========================
app.use("/api/patients", patientsRouter);
app.use("/api/auth", authRouter);

// Simple health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// =========================
//   SERVE REACT BUILD
// =========================
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  });
}

// =========================
//        DATABASE
// =========================
const PORT = process.env.PORT || 9000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    dbName: "patient_auth",
  })
  .then(() => {
    console.log("✅ Connected to MongoDB (ayurveda)");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

export default app;

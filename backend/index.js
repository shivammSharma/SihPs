import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import patientsRouter from "./routes/patients.js";
import authRouter from "./routes/auth.js";
import patientPortalRouter from "./routes/patientPortal.js";
import patientMeRouter from "./routes/patientMe.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/patients", patientsRouter);
app.use("/api/auth", authRouter);
app.use("/api/patient", patientPortalRouter); 
app.use("/api/patient", patientMeRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

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

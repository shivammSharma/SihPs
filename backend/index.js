// backend/index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import patientsRouter from "./routes/patients.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/patients", patientsRouter);
app.use("/api/auth", authRouter);

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// STATIC (Production)
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientPath));
  app.get("*", (_, res) =>
    res.sendFile(path.join(clientPath, "index.html"))
  );
}

// DATABASE CONNECTION
const PORT = process.env.PORT || 9000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    dbName: "patient_auth",   // ✅ FIXED
  })
  .then(() => {
    console.log("✅ Connected to MongoDB (patient_auth)");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

export default app;

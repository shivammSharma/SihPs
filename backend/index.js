import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

// MODELS
import ChatMessage from "./models/ChatMessage.js";

// ROUTES
import patientsRouter from "./routes/patients.js";
import authRouter from "./routes/auth.js";
import patientPortalRouter from "./routes/patientPortal.js";
import patientMeRouter from "./routes/patientMe.js";
import subscribeRouter from "./routes/subscribe.js";
import foodScanRoutes from "./routes/foodScanRoutes.js";
import chatbotRoute from "./routes/chatbot.js";
import chatRoutes from "./routes/chat.js";
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
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
app.use(express.json());

// --------------------------
// SERVE UPLOADED FILES
// --------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// HTTP server for WebSockets
const server = http.createServer(app);

// --------------------------
// SOCKET.IO
// --------------------------
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4028",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔥 New socket connected:", socket.id);

  // User comes online
  socket.on("user-online", ({ userId, role }) => {
    socket.userId = userId;
    socket.role = role;

    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  // SEND MESSAGE (patient or doctor)
  socket.on("send-message", async (msg) => {
    try {
      // msg should include: { _id, patientId, doctorId, senderRole, receiverId, ... }

      const receiverSocket = onlineUsers.get(msg.receiverId);

      // figure out senderId
      const senderId =
        msg.senderRole === "patient" ? msg.patientId : msg.doctorId;

      // 1) Forward to receiver if online
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive-message", msg);

        // mark as delivered in DB if we have _id
        if (msg._id) {
          await ChatMessage.findByIdAndUpdate(msg._id, {
            status: "delivered",
            deliveredAt: new Date(),
          });
        }

        // notify sender about status = delivered (double grey tick)
        const senderSocket = onlineUsers.get(senderId);
        if (senderSocket && msg._id) {
          io.to(senderSocket).emit("message-status-update", {
            messageId: msg._id,
            status: "delivered",
          });
        }
      } else {
        // receiver offline → stays 'sent', but we can still confirm 'sent' to sender
        const senderSocket = onlineUsers.get(senderId);
        if (senderSocket && msg._id) {
          io.to(senderSocket).emit("message-status-update", {
            messageId: msg._id,
            status: "sent",
          });
        }
      }
    } catch (err) {
      console.error("Error in send-message:", err);
    }
  });

  // FUTURE: when other side opens chat and marks messages as seen
  // payload: { messageIds: [...], viewerId, otherUserId }
  socket.on("message-seen", async ({ messageIds, viewerId, otherUserId }) => {
    try {
      if (!Array.isArray(messageIds) || messageIds.length === 0) return;

      await ChatMessage.updateMany(
        { _id: { $in: messageIds } },
        { status: "seen", seenAt: new Date() }
      );

      const otherSocket = onlineUsers.get(otherUserId);
      if (otherSocket) {
        io.to(otherSocket).emit("message-status-update", {
          messageIds,
          status: "seen",
        });
      }
    } catch (err) {
      console.error("Error in message-seen:", err);
    }
  });

  // TYPING
  socket.on("typing", ({ receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing", { from: socket.id });
    }
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);

    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("online-users", Array.from(onlineUsers.keys()));
        break;
      }
    }
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () =>
      console.log(
        `🔥 Realtime + Upload Server running at http://localhost:${PORT}`
      )
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

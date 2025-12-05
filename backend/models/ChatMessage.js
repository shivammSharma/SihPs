import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },

    senderRole: {
      type: String,
      enum: ["doctor", "patient"],
      required: true,
    },

    text: { type: String, default: "" },

    fileUrl: { type: String, default: null },
    fileType: { type: String, default: null },

    messageType: {
      type: String,
      enum: ["text", "file"],
      default: "text",
    },

    // ⭐ MESSAGE STATUS (for ticks)
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent", // default single tick
    },
    deliveredAt: { type: Date, default: null },
    seenAt: { type: Date, default: null },

    // ⭐ MUST have default: []
    deletedFor: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },

    // ⭐ MUST have default false
    isDeletedForEveryone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);

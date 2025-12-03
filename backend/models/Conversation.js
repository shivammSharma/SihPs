import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    lastMessage: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
    unreadCountForPatient: { type: Number, default: 0 },
    unreadCountForDoctor: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);

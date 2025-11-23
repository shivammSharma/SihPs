// backend/models/doctor.js
import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor =
  mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);

export default Doctor;

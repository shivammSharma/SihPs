// backend/models/user.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      required: true,
      default: "patient",
    },

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
      sparse: true, // allows user docs without this field
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

const User = mongoose.model("User", UserSchema); // collection: users

export default User;

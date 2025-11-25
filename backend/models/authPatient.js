import mongoose from "mongoose";

const AuthPatientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    gender: { type: String },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const AuthPatient =
  mongoose.models.AuthPatient ||
  mongoose.model("AuthPatient", AuthPatientSchema);

export default AuthPatient;

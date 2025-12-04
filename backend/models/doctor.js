import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    gender: { type: String },

    // For password storage
    passwordHash: { type: String, required: true },

    // Doctor Verification Fields
    reg_no: { type: String, required: true },                // Registration Number
    council: { type: String, required: true },               // Medical Council
    verified: { type: Boolean, default: false },             // Verified by our IMR database
  },
  { timestamps: true }
);

const Doctor =
  mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);

export default Doctor;

import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    sessionType: {
      type: String,
      required: true,
    },

    date: {
      type: String, // frontend sends "DD-MM-YYYY"
      required: true,
    },

    time: {
      type: String, // frontend sends "HH:mm"
      required: true,
    },

    status: {
  type: String,
  enum: ["Scheduled", "Accepted", "Rejected", "Completed"],
  default: "Scheduled",
},

  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);

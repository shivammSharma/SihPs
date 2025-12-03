import React from "react";
import { X } from "lucide-react"; // small icon (optional, remove if not installed)

const BookingModal = ({ doctor, date, setDate, time, setTime, onClose, onConfirm }) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-xl animate-slideUp relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full"
        >
          <X size={18} />
        </button>

        <h2 className="text-2xl font-semibold text-gray-900">Book Appointment</h2>
        <p className="text-gray-600 mt-1">
          Doctor: <span className="font-medium text-gray-800">{doctor.fullName}</span>
        </p>

        {/* Date Picker */}
        <div className="mt-6">
          <label className="block text-gray-800 mb-1 font-medium">Select Date</label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
          />
        </div>

        {/* Time Picker */}
        <div className="mt-4">
          <label className="block text-gray-800 mb-1 font-medium">Select Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={!date || !time}
            className={`px-5 py-2 rounded-lg text-white font-medium transition
              ${
                date && time
                  ? "bg-emerald-700 hover:bg-emerald-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Confirm
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
          .animate-slideUp {
            animation: slideUp 0.25s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default BookingModal;

// src/pages/personal-wellness-hub/components/PrescriptionModal.jsx
import React from "react";

const PrescriptionModal = ({ report, doctor, patientName, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg">

        <h2 className="text-xl font-semibold mb-2">{report.title}</h2>
        <p className="text-sm text-gray-600 mb-4">
          Doctor: {doctor?.fullName || "Ayurvedic Doctor"}
        </p>

        <div className="space-y-3 text-sm">
          <Field label="Diagnosis" value={report.diagnosis} />
          <Field label="Summary" value={report.summary} />
          <Field label="Notes" value={report.notes} />
          <Field label="Tests Recommended" value={report.testsRecommended} />
          <Field label="Plan / Recommendations" value={report.plan} />
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full bg-gray-700 text-white py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, value }) => (
  <div>
    <p className="font-medium text-gray-700">{label}</p>
    <p className="text-gray-600 whitespace-pre-line">{value || "—"}</p>
  </div>
);

export default PrescriptionModal;

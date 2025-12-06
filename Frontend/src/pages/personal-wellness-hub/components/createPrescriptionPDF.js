// src/pages/personal-wellness-hub/components/createPrescriptionPDF.js
import jsPDF from "jspdf";

export default function createPrescriptionPDF(report, patientName, doctor) {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Ayurvedic Clinical Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Patient: ${patientName}`, 20, 35);
  doc.text(`Doctor: ${doctor?.fullName || "Ayurvedic Doctor"}`, 20, 42);
  doc.text(`Date: ${new Date(report.createdAt).toLocaleDateString()}`, 20, 49);

  doc.setFont("helvetica", "normal");

  const addField = (title, text, y) => {
    doc.setFont("helvetica", "bold");
    doc.text(title, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(text || "—", 20, y + 6);
  };

  let y = 65;
  addField("Diagnosis", report.diagnosis, y);
  y += 20;

  addField("Summary", report.summary, y);
  y += 20;

  addField("Notes", report.notes, y);
  y += 20;

  addField("Tests Recommended", report.testsRecommended, y);
  y += 20;

  addField("Plan / Treatment", report.plan, y);

  doc.save(`Prescription_${patientName}.pdf`);
}

import jsPDF from "jspdf";

export default function DoshaResult({ result }) {
  if (!result) return null;

  const descriptions = {
    Vata: "Creative, energetic, quick-thinking but prone to anxiety, dryness, and irregular digestion.",
    Pitta: "Sharp, intense, ambitious but prone to acidity, anger, and inflammation.",
    Kapha: "Calm, steady, compassionate but prone to weight gain, sluggishness, and congestion.",
  };

  const dietRecs = {
    Vata: "Warm soups, ghee, root vegetables, sweet fruits, cooked meals.",
    Pitta: "Cooling foods, sweet fruits, coconut water, bitter greens.",
    Kapha: "Light warm foods, spices like ginger, black pepper, steamed vegetables.",
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(15, 108, 63); // Ayurvedic Primary Color
    doc.text("Ayurvedic Dosha Assessment Result", 14, 20);

    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text(`Primary Dosha: ${result.primary}`, 14, 40);
    doc.text(`Secondary Dosha: ${result.secondary}`, 14, 50);

    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Description:", 14, 70);
    doc.text(doc.splitTextToSize(descriptions[result.primary], 180), 14, 80);

    doc.text("Recommended Diet:", 14, 110);
    doc.text(doc.splitTextToSize(dietRecs[result.primary], 180), 14, 120);

    doc.save("Dosha_Assessment_Result.pdf");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-[var(--ayur-border)]">
      <h2 className="text-2xl font-semibold text-[var(--ayur-text-dark)] mb-4">
        Your Dosha Result
      </h2>

      <p className="text-lg font-semibold mb-2">
        Primary Dosha:{" "}
        <span className="text-[var(--ayur-primary)]">
          {result.primary}
        </span>
      </p>

      <p className="text-md mb-4">
        Secondary Dosha:{" "}
        <span className="text-[var(--ayur-primary)]">
          {result.secondary}
        </span>
      </p>

      <p className="text-sm text-[var(--ayur-text-med)] mb-4">
        {descriptions[result.primary]}
      </p>

      <h3 className="text-lg font-semibold mb-2">Recommended Diet:</h3>
      <p className="text-sm mb-6">{dietRecs[result.primary]}</p>

      {/* PDF Download Button */}
      <button
        onClick={generatePDF}
        className="mt-4 px-6 py-3 bg-[var(--ayur-primary)] text-white rounded-lg shadow-md hover:opacity-85"
      >
        Download PDF
      </button>
    </div>
  );
}

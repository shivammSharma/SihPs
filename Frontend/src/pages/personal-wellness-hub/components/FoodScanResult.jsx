// src/pages/personal-wellness-hub/components/FoodScanResult.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * FoodScanResult (Beige Ayurvedic theme)
 * - Expects location.state = { analysis: {...}, preview: "data:image/..." }
 * - Uses CSS tokens assumed to be defined in src/components/styles/index.css:
 *    --ayur-primary, --ayur-beige, bg-beige, bg-cream, card-hover, etc.
 *
 * If you want the uploaded image path to be used as a fallback preview,
 * this file references the uploaded asset at:
 *   /mnt/data/Screenshot 2025-11-19 190435.png
 */

const MetricCard = ({ label, value, subtitle }) => (
  <div className="bg-white rounded-xl p-5 border card-hover shadow-sm">
    <div className="text-2xl font-semibold text-[var(--ayur-primary)]">{value}</div>
    <div className="text-sm text-muted mt-1">{label}</div>
    {subtitle && <div className="text-xs text-text-secondary mt-2">{subtitle}</div>}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-semibold mb-3 text-[var(--ayur-text-dark)]">{children}</h3>
);

const FoodScanResult = () => {
  const loc = useLocation();
  const navigate = useNavigate();

  // analysis JSON + preview image (base64) are expected to be passed in route state
  const analysis = loc.state?.analysis;
  const preview = loc.state?.preview || "/mnt/data/Screenshot 2025-11-19 190435.png";

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <p className="text-text-secondary mb-4">No analysis found.</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/personal-wellness-hub/food-scan")}
              className="px-4 py-2 bg-[var(--ayur-primary)] text-white rounded"
            >
              Go to Food Scan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // destructure safely
  const {
    dishName,
    confidence = 0,
    nutrition = {},
    ayurveda = {},
    doshaImpact = {},
    sixTastes = [],
    specialProperties = [],
  } = analysis;

  return (
    <motion.section
      className="max-w-7xl mx-auto px-6 py-10"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36 }}
    >
      {/* Header */}
      <div className="bg-[var(--ayur-beige)] rounded-xl p-6 mb-6 border border-[var(--ayur-border)]">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--ayur-text-dark)]">
              {dishName || "Unknown Dish"}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              AI-powered Ayurvedic & Nutrition analysis · Confidence: {(confidence || 0).toFixed(2)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg p-1 border shadow-sm">
              <img
                src={preview}
                alt={dishName || "food preview"}
                className="h-20 w-28 object-cover rounded-md"
              />
            </div>

            <div className="text-right">
              <div className="text-xs text-text-secondary">Served</div>
              <div className="text-sm font-semibold text-[var(--ayur-primary)]">
                {nutrition.serving_g ? `${nutrition.serving_g} g` : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left & center: Nutrition (spans 2 cols on large) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Calories" value={`${nutrition.calories ?? "—"} kcal`} subtitle="Estimated" />
            <MetricCard label="Protein" value={`${nutrition.protein_g ?? "—"} g`} subtitle="Per serving" />
            <MetricCard label="Carbs" value={`${nutrition.carbs_g ?? "—"} g`} subtitle="Per serving" />
            <MetricCard label="Fat" value={`${nutrition.fat_g ?? "—"} g`} subtitle="Per serving" />
          </div>

          {/* Vitamins & minerals */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <SectionTitle>Vitamins & Minerals</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {(nutrition.vitamins || []).length === 0 && (nutrition.minerals || []).length === 0 ? (
                <div className="text-text-secondary">No specific vitamins/minerals detected.</div>
              ) : (
                <>
                  {(nutrition.vitamins || []).map((v, i) => (
                    <span key={`vit-${i}`} className="px-2 py-1 bg-[var(--ayur-mint)] border rounded text-sm">
                      {v}
                    </span>
                  ))}
                  {(nutrition.minerals || []).map((m, i) => (
                    <span key={`min-${i}`} className="px-2 py-1 bg-[var(--ayur-mint)] border rounded text-sm">
                      {m}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Free text / summary (if model provided extra notes) */}
          {analysis?.summary && (
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <SectionTitle>Quick Summary</SectionTitle>
              <p className="text-text-secondary">{analysis.summary}</p>
            </div>
          )}
        </div>

        {/* Right column: Ayurvedic properties */}
        <aside className="space-y-6">
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <SectionTitle>Ayurvedic Properties</SectionTitle>
            <div className="space-y-2 text-sm text-[var(--ayur-text-med)]">
              <div><strong>Rasa:</strong> {(ayurveda.rasa || []).join(", ") || "—"}</div>
              <div><strong>Virya:</strong> {ayurveda.virya || "—"}</div>
              <div><strong>Vipaka:</strong> {ayurveda.vipaka || "—"}</div>
              <div><strong>Guna:</strong> {(ayurveda.guna || []).join(", ") || "—"}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <SectionTitle>Dosha Impact</SectionTitle>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 border rounded">
                <div className="text-sm font-semibold text-blue-700">Vata</div>
                <div className="text-xs text-text-secondary mt-1">{doshaImpact.vata || "Neutral / no major effect"}</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-sm font-semibold text-orange-700">Pitta</div>
                <div className="text-xs text-text-secondary mt-1">{doshaImpact.pitta || "Neutral / no major effect"}</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-sm font-semibold text-green-700">Kapha</div>
                <div className="text-xs text-text-secondary mt-1">{doshaImpact.kapha || "Neutral / no major effect"}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Six tastes and Special Properties */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <SectionTitle>Six Tastes (Shad Rasa)</SectionTitle>
          <div className="space-y-3">
            {(sixTastes.length === 0) ? (
              <div className="text-text-secondary">No taste breakdown available.</div>
            ) : (
              sixTastes.map((t, i) => (
                <div key={`taste-${i}`} className="p-3 border rounded flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">•</div>
                  <div>
                    <div className="font-medium text-[var(--ayur-text-dark)]">{t.taste}</div>
                    <div className="text-xs text-text-secondary">{t.description}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <SectionTitle>Special Properties</SectionTitle>
          {specialProperties.length === 0 ? (
            <div className="text-text-secondary">No special properties detected.</div>
          ) : (
            <ul className="list-disc pl-5 space-y-2 text-text-secondary">
              {specialProperties.map((s, i) => <li key={`sp-${i}`}>{s}</li>)}
            </ul>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={() => navigate("/personal-wellness-hub/food-scan")}
          className="px-4 py-2 border rounded bg-white"
        >
          Scan Another
        </button>
        <button
          onClick={() => {
            // example: save analysis to user history via API (hook up later)
            alert("Save feature not implemented yet — will call backend to save record.");
          }}
          className="px-4 py-2 rounded bg-[var(--ayur-primary)] text-white"
        >
          Save Analysis
        </button>
      </div>
    </motion.section>
  );
};

export default FoodScanResult;

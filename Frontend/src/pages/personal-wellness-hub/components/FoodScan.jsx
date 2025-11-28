// src/pages/personal-wellness-hub/components/FoodScan.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const STORAGE = "pw_hub_food_scans_v1";

const FoodScan = () => {
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load recent scans from localStorage
  useEffect(() => {
    const s = localStorage.getItem(STORAGE);
    if (s) setRecent(JSON.parse(s));
  }, []);

  // Save recent scans to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(recent));
  }, [recent]);

  // Call backend to analyze image
  const analyzeImage = async (file, previewDataUrl) => {
    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const res = await axios.post("/api/food-scan/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const analysis = res.data.analysis;

      // Add a compact item to the "Recent" list
      const item = {
        name: file.name,
        date: new Date().toISOString(),
        preview: previewDataUrl,
        calories: analysis?.nutrition?.calories ?? null,
        doshaText: {
          vata: analysis?.doshaImpact?.vata || "—",
          pitta: analysis?.doshaImpact?.pitta || "—",
          kapha: analysis?.doshaImpact?.kapha || "—",
        },
      };

      setRecent((prev) => [item, ...prev].slice(0, 6));

      // Navigate to detailed result page
      navigate("/personal-wellness-hub/food-scan/result", {
        state: {
          analysis,
          preview: previewDataUrl,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFile = (file) => {
    if (!file) return;
    setName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      // Trigger backend analysis
      analyzeImage(file, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const onInput = (e) => {
    const f = e.target.files && e.target.files[0];
    onFile(f);
    e.target.value = "";
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-beige p-8 rounded-xl">
        <h2 className="text-2xl font-semibold mb-2">Scan Your Food</h2>
        <p className="text-text-secondary mb-6">
          Take a photo or upload an image to analyze its Ayurvedic properties
        </p>

        <div className="border-dashed border-2 border-gray-300 rounded-md p-6 text-center bg-white">
          {preview ? (
            <>
              <img
                src={preview}
                alt={name}
                className="mx-auto max-h-56 object-cover rounded mb-4"
              />
              <div className="text-sm text-text-secondary mb-2">{name}</div>
              {loading && (
                <div className="text-xs text-emerald-700 mb-2">
                  Analyzing image...
                </div>
              )}
              <div className="flex justify-center gap-3">
                <label className="bg-emerald-700 text-white px-4 py-2 rounded cursor-pointer">
                  {loading ? "Processing..." : "Replace Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onInput}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
                <button
                  onClick={() => {
                    if (loading) return;
                    setPreview(null);
                    setName("");
                  }}
                  className="px-4 py-2 border rounded"
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  className="mx-auto text-gray-300"
                >
                  <path
                    d="M7 7h10l1 1v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8l1-1z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="13"
                    r="2.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </div>
              <div className="mb-2 text-sm text-text-secondary">Ready to scan</div>
              <div className="flex justify-center gap-3">
                <label className="bg-emerald-700 text-white px-6 py-3 rounded cursor-pointer">
                  Take Photo / Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onInput}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
                <label className="px-6 py-3 border rounded cursor-pointer">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onInput}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
            </>
          )}
        </div>

        
      </div>
    </section>
  );
};

export default FoodScan;

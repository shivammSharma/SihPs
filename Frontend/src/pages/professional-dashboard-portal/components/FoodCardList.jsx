// src/pages/.../FoodCardList.jsx
import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import foodData from "./data.json"; // 👈 your sheet-export JSON

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

export default function FoodCardList({ dataSource, patientId, onDietSaved }) {
  // fall back to local JSON if no dataSource passed
  const data =
    Array.isArray(dataSource) && dataSource.length
      ? dataSource
      : Array.isArray(foodData)
      ? foodData
      : [];

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filters / search
  const [query, setQuery] = useState("");
  const [field, setField] = useState("All");
  const [minCalories, setMinCalories] = useState("");
  const [maxCalories, setMaxCalories] = useState("");

  // Diet plan builder
  const [currentMeal, setCurrentMeal] = useState("breakfast"); // "breakfast" | "lunch" | "dinner"
  const [dietPlan, setDietPlan] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Reset page on filters change
  useEffect(() => {
    setPage(1);
  }, [query, field, minCalories, maxCalories, dataSource]);

  const stringFields = useMemo(() => {
    if (!data || data.length === 0) return ["Food Item"];
    const sample = data[0];
    return Object.keys(sample).filter((k) => typeof sample[k] === "string");
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const caloriesKey = "Calories (per 100g)";

    return data.filter((item) => {
      // calories filter
      if (minCalories !== "") {
        const min = Number(minCalories);
        const itemCal = Number(item[caloriesKey] ?? NaN);
        if (Number.isFinite(itemCal) && itemCal < min) return false;
      }
      if (maxCalories !== "") {
        const max = Number(maxCalories);
        const itemCal = Number(item[caloriesKey] ?? NaN);
        if (Number.isFinite(itemCal) && itemCal > max) return false;
      }

      if (!q) return true;

      if (field === "All") {
        return Object.keys(item).some((k) => {
          const v = item[k];
          if (v === null || v === undefined) return false;
          return String(v).toLowerCase().includes(q);
        });
      }

      const val = item[field];
      return (
        val !== undefined && String(val).toLowerCase().includes(q)
      );
    });
  }, [data, query, field, minCalories, maxCalories]);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paged = filtered.slice(start, end);

  // ==== Diet helpers ====

  const addToCurrentMeal = (item) => {
    if (!currentMeal) return;
    setDietPlan((prev) => ({
      ...prev,
      [currentMeal]: [...prev[currentMeal], item],
    }));
  };

  const removeFromMeal = (meal, index) => {
    setDietPlan((prev) => ({
      ...prev,
      [meal]: prev[meal].filter((_, i) => i !== index),
    }));
  };

  const totalCaloriesByMeal = (meal) => {
    const caloriesKey = "Calories (per 100g)";
    return dietPlan[meal].reduce((sum, f) => {
      const c = Number(f[caloriesKey] ?? 0);
      return sum + (Number.isFinite(c) ? c : 0);
    }, 0);
  };

  const handleSaveDietPlan = async () => {
    if (!patientId) {
      setSaveMsg("No patient selected to attach diet plan to.");
      return;
    }

    try {
      setSaving(true);
      setSaveMsg("");

      const token = localStorage.getItem("authToken");
      if (!token) {
        setSaveMsg("You must be logged in as a doctor to save a diet plan.");
        return;
      }

      const payload = {
        breakfast: dietPlan.breakfast,
        lunch: dietPlan.lunch,
        dinner: dietPlan.dinner,
      };

      const res = await axios.post(
        `${API_BASE}/api/patients/${patientId}/diet-plan`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSaveMsg("Diet plan saved to patient.");
      if (onDietSaved) onDietSaved(res.data);
    } catch (err) {
      console.error("Save diet plan error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to save diet plan.";
      setSaveMsg(msg);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 4000);
    }
  };

  const mealButtonClasses = (meal) =>
    `px-3 py-1 text-sm rounded-full border ${
      currentMeal === meal
        ? "bg-green-600 text-white border-green-700"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
    }`;

  return (
    <div className="border border-border rounded-xl p-4 bg-[#faf7f1]">
      <h2 className="text-base font-semibold mb-2">
        Food Library & Diet Builder
      </h2>
      <p className="text-xs text-text-secondary mb-3">
        Search foods, then add them to Breakfast, Lunch, or Dinner for this
        patient.
      </p>

      {/* Meal selector */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-gray-700">Assign to:</span>
        <button
          type="button"
          className={mealButtonClasses("breakfast")}
          onClick={() => setCurrentMeal("breakfast")}
        >
          Breakfast
        </button>
        <button
          type="button"
          className={mealButtonClasses("lunch")}
          onClick={() => setCurrentMeal("lunch")}
        >
          Lunch
        </button>
        <button
          type="button"
          className={mealButtonClasses("dinner")}
          onClick={() => setCurrentMeal("dinner")}
        >
          Dinner
        </button>
      </div>

      {/* Search / filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          className="flex-1 p-2 border rounded text-sm"
          placeholder="Search (food, category, dosha, benefit)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="p-2 border rounded text-sm"
          value={field}
          onChange={(e) => setField(e.target.value)}
        >
          <option value="All">All fields</option>
          {stringFields.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <div className="flex gap-1">
          <input
            className="w-20 p-2 border rounded text-xs"
            placeholder="Min cal"
            value={minCalories}
            onChange={(e) =>
              setMinCalories(e.target.value.replace(/[^0-9.]/g, ""))
            }
          />
          <input
            className="w-20 p-2 border rounded text-xs"
            placeholder="Max cal"
            value={maxCalories}
            onChange={(e) =>
              setMaxCalories(e.target.value.replace(/[^0-9.]/g, ""))
            }
          />
        </div>

        <button
          className="px-2 py-2 bg-gray-100 rounded border text-xs hover:bg-gray-200"
          onClick={() => {
            setQuery("");
            setField("All");
            setMinCalories("");
            setMaxCalories("");
          }}
        >
          Reset
        </button>
      </div>

      {/* Layout: library + summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: cards */}
        <div className="max-h-[420px] overflow-y-auto pr-1">
          {paged.map((item, idx) => (
            <article
              key={start + idx}
              className="border rounded-lg p-3 mb-3 bg-white shadow-sm text-xs"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold">
                    {item["Food Item"] || item["Name"] || "—"}
                  </div>
                  <div className="text-[11px] text-gray-600">
                    {item["Category"]}
                  </div>
                </div>
                <div className="text-right text-[11px]">
                  <div className="font-medium">
                    {item["Calories (per 100g)"] ?? "—"} cal
                  </div>
                  <div className="text-gray-500">
                    {item["Fat (g)"] ?? "—"} g fat
                  </div>
                </div>
              </div>

              <div className="mb-2 space-y-0.5">
                <p>
                  <span className="font-semibold">Benefit:</span>{" "}
                  {item["Key Benefit"] ?? "—"}
                </p>
                <p>
                  <span className="font-semibold">Dosha:</span>{" "}
                  {item["Dosha Effect"] ?? "—"}
                </p>
                <p>
                  <span className="font-semibold">Precautions:</span>{" "}
                  {item["Precautions"] ?? "—"}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-3 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700"
                  onClick={() => addToCurrentMeal(item)}
                >
                  Add to{" "}
                  {currentMeal.charAt(0).toUpperCase() +
                    currentMeal.slice(1)}
                </button>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="py-4 text-center text-xs text-gray-500">
              No foods found.
            </div>
          )}

          {/* Pagination small */}
          <div className="mt-2 flex justify-between items-center text-[11px] text-gray-500">
            <span>
              Page {page} / {totalPages}
            </span>
            <div className="space-x-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 border rounded disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right: summary */}
        <aside className="bg-white border rounded-lg p-3 shadow-sm text-xs">
          {["breakfast", "lunch", "dinner"].map((meal) => (
            <div key={meal} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-800">
                  {meal.charAt(0).toUpperCase() + meal.slice(1)}
                </h3>
                <span className="text-[11px] text-gray-500">
                  {dietPlan[meal].length} items ·{" "}
                  {totalCaloriesByMeal(meal)} cal
                </span>
              </div>

              {dietPlan[meal].length === 0 && (
                <p className="italic text-[11px] text-gray-500">
                  No items added.
                </p>
              )}

              {dietPlan[meal].length > 0 && (
                <ul className="space-y-1 max-h-24 overflow-y-auto">
                  {dietPlan[meal].map((f, i) => (
                    <li
                      key={`${meal}-${i}`}
                      className="flex justify-between items-center bg-[#f8fafc] border rounded px-2 py-1"
                    >
                      <span className="truncate">
                        {f["Food Item"] || f["Name"] || "—"}
                      </span>
                      <button
                        type="button"
                        className="text-[10px] text-red-500 ml-2"
                        onClick={() => removeFromMeal(meal, i)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleSaveDietPlan}
            disabled={saving}
            className="w-full mt-1 py-2 rounded bg-green-700 text-white text-xs font-medium hover:bg-green-800 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Diet Plan to Patient"}
          </button>

          {saveMsg && (
            <p className="mt-2 text-[11px] text-gray-700">{saveMsg}</p>
          )}
        </aside>
      </div>
    </div>
  );
}

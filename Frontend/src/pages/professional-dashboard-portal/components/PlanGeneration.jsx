// src/pages/.../FoodCardList.jsx
import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import foodData from "./data.json"; // your original JSON

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * FoodCardList
 *
 * Props:
 *  - dataSource?: array of food items (optional, falls back to data.json)
 *  - patientId: string (required) – current clinical patient id
 *  - onDietSaved?: (dietPlan) => void – optional callback after successful save
 */
export default function FoodCardList({ dataSource, patientId, onDietSaved }) {
  // Data source
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

  // Reset page on filters/search change
  useEffect(() => {
    setPage(1);
  }, [query, field, minCalories, maxCalories, dataSource]);

  const stringFields = useMemo(() => {
    if (!data || data.length === 0) return ["Food Item"];
    const sample = data[0];
    return Object.keys(sample).filter((k) => typeof sample[k] === "string");
  }, [data]);

  const numericFields = useMemo(() => {
    if (!data || data.length === 0) return [];
    const sample = data[0];
    return Object.keys(sample).filter((k) => typeof sample[k] === "number");
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((item) => {
      const caloriesKey = "Calories (per 100g)";

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

  // Pagination calculations
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paged = filtered.slice(start, end);

  // Helpers for diet plan

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

      // You can shape this payload however you want on the backend
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Food Library & Diet Builder</h1>
      <p className="text-sm text-gray-600 mb-4">
        Search foods below, choose items, and assign them to Breakfast, Lunch, or Dinner for the selected patient.
      </p>

      {/* Meal selector + filters */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Meal selector */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Assign to:</span>
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
        </div>

        {/* Search / filters row */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            className="flex-1 p-2 border rounded shadow-sm"
            placeholder="Search... (by food item, category, benefit, etc.)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="p-2 border rounded"
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

          <div className="flex gap-2 items-center">
            <input
              className="w-24 p-2 border rounded"
              placeholder="Min cal"
              value={minCalories}
              onChange={(e) =>
                setMinCalories(e.target.value.replace(/[^0-9.]/g, ""))
              }
            />
            <input
              className="w-24 p-2 border rounded"
              placeholder="Max cal"
              value={maxCalories}
              onChange={(e) =>
                setMaxCalories(e.target.value.replace(/[^0-9.]/g, ""))
              }
            />
          </div>

          <button
            className="p-2 bg-gray-100 rounded border hover:bg-gray-200"
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
      </div>

      {/* Main content: cards + plan summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Food cards (2/3 width on large) */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paged.map((item, idx) => (
              <article
                key={start + idx}
                className="border rounded-lg p-4 shadow-sm bg-white flex flex-col justify-between"
              >
                <div>
                  <header className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {item["Food Item"] || item["Name"] || "—"}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {item["Category"]}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">
                        {item["Calories (per 100g)"] ?? "—"} cal
                      </div>
                      <div className="text-gray-500">
                        {item["Fat (g)"] ?? "—"} g fat
                      </div>
                    </div>
                  </header>

                  <div className="text-sm mb-3">
                    <p>
                      <strong>Key benefit:</strong>{" "}
                      {item["Key Benefit"] ?? "—"}
                    </p>
                    <p>
                      <strong>Dosha Effect:</strong>{" "}
                      {item["Dosha Effect"] ?? "—"}
                    </p>
                    <p>
                      <strong>Precautions:</strong>{" "}
                      {item["Precautions"] ?? "—"}
                    </p>
                  </div>

                  <div className="text-xs text-gray-600 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {Object.entries(item).map(([k, v]) => (
                      <div key={k} className="break-words">
                        <div className="font-medium text-gray-800">{k}</div>
                        <div className="text-gray-600">
                          {String(v)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                    onClick={() => addToCurrentMeal(item)}
                  >
                    Add to{" "}
                    {currentMeal.charAt(0).toUpperCase() +
                      currentMeal.slice(1)}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-8 text-center text-gray-600">
              No results found.
            </div>
          )}

          {/* Pagination */}
          <footer className="mt-8 text-sm text-gray-500">
            Showing {Math.min(total, end) - start} of {total} items (page{" "}
            {page} of {totalPages})
          </footer>

          <div className="flex justify-center mt-6 gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 border rounded disabled:opacity-40"
              aria-label="Previous page"
            >
              Previous
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">Page</span>
              <span className="font-medium">{page}</span>
              <span className="text-sm text-gray-500">
                {" "}
                / {totalPages}
              </span>
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 border rounded disabled:opacity-40"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>

        {/* Diet plan summary (1/3 width on large) */}
        <aside className="bg-[#F7F3EC] border border-gray-200 rounded-xl p-4 shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-2">
            Current Diet Plan for Patient
          </h2>
          <p className="text-xs text-gray-600 mb-3">
            Breakfast, Lunch, and Dinner sets will be saved to this patient&apos;s record.
          </p>

          {["breakfast", "lunch", "dinner"].map((meal) => (
            <div key={meal} className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-800">
                  {meal.charAt(0).toUpperCase() + meal.slice(1)}
                </h3>
                <span className="text-xs text-gray-500">
                  {dietPlan[meal].length} items •{" "}
                  {totalCaloriesByMeal(meal)} cal (approx)
                </span>
              </div>
              {dietPlan[meal].length === 0 && (
                <p className="text-xs text-gray-500 italic">
                  No items added yet.
                </p>
              )}
              {dietPlan[meal].length > 0 && (
                <ul className="space-y-1 max-h-32 overflow-y-auto text-xs">
                  {dietPlan[meal].map((f, i) => (
                    <li
                      key={`${meal}-${i}`}
                      className="flex justify-between items-center bg-white border rounded px-2 py-1"
                    >
                      <span className="truncate">
                        {f["Food Item"] || f["Name"] || "—"}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 text-[11px] ml-2"
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
            className="w-full mt-2 py-2 rounded bg-green-700 text-white text-sm font-medium hover:bg-green-800 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Diet Plan to Patient"}
          </button>

          {saveMsg && (
            <p className="text-xs mt-2 text-gray-700">{saveMsg}</p>
          )}
        </aside>
      </div>
    </div>
  );
}

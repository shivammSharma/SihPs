import React, { useMemo, useState } from "react";
import axios from "axios";
import foodData from "./data.json";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Small pill chip
const Chip = ({ children, variant = "default" }) => {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
  const styles =
    variant === "soft-green"
      ? "bg-green-50 text-green-700 border border-green-200"
      : variant === "soft-blue"
      ? "bg-blue-50 text-blue-700 border border-blue-200"
      : variant === "soft-purple"
      ? "bg-purple-50 text-purple-700 border border-purple-200"
      : "bg-gray-100 text-gray-700";
  return <span className={`${base} ${styles}`}>{children}</span>;
};

// Nutrition stat box (used in modal)
const InfoBox = ({ label, value }) => (
  <div className="p-4 rounded-xl bg-gray-50 flex flex-col items-center text-center shadow-sm">
    <div className="text-lg font-semibold text-gray-800">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

// Map doshaEffect numeric flags into readable chips
const getDoshaChips = (doshaEffect = {}) => {
  const map = [];
  if (doshaEffect.vata !== undefined) {
    map.push({
      dosha: "Vata",
      effect: doshaEffect.vata,
    });
  }
  if (doshaEffect.pitta !== undefined) {
    map.push({
      dosha: "Pitta",
      effect: doshaEffect.pitta,
    });
  }
  if (doshaEffect.kapha !== undefined) {
    map.push({
      dosha: "Kapha",
      effect: doshaEffect.kapha,
    });
  }
  return map;
};

export default function FoodCardList({ dataSource, patientId, onDietSaved }) {
  // Data source – use prop if provided, else data.json
  const data =
    Array.isArray(dataSource) && dataSource.length ? dataSource : foodData || [];

  // Pagination / filters
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [query, setQuery] = useState("");
  const [field, setField] = useState("all"); // all | name | category | cuisine | tags | rasa
  const [minCalories, setMinCalories] = useState("");
  const [maxCalories, setMaxCalories] = useState("");

  // Diet builder
  const [currentMeal, setCurrentMeal] = useState("breakfast");
  const [dietPlan, setDietPlan] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Detail modal state
  const [selectedFood, setSelectedFood] = useState(null);

  // ------- FILTERING -------

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return data.filter((item) => {
      const calories = item?.nutritionPerServing?.caloriesKcal ?? 0;

      // Calories filters
      if (minCalories !== "" && calories < Number(minCalories)) return false;
      if (maxCalories !== "" && calories > Number(maxCalories)) return false;

      if (!q) return true;

      const name = item.name?.toLowerCase() || "";
      const category = item.category?.toLowerCase() || "";
      const cuisine = item.cuisine?.toLowerCase() || "";
      const tags = (item.tags || []).join(" ").toLowerCase();
      const rasa = (item.ayurveda?.rasa || []).join(" ").toLowerCase();

      if (field === "name") return name.includes(q);
      if (field === "category") return category.includes(q);
      if (field === "cuisine") return cuisine.includes(q);
      if (field === "tags") return tags.includes(q);
      if (field === "rasa") return rasa.includes(q);

      // all fields
      return (
        name.includes(q) ||
        category.includes(q) ||
        cuisine.includes(q) ||
        tags.includes(q) ||
        rasa.includes(q)
      );
    });
  }, [data, query, field, minCalories, maxCalories]);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  // ------- DIET PLAN HANDLERS -------

  const addToCurrentMeal = (item) => {
    setDietPlan((prev) => ({
      ...prev,
      [currentMeal]: [...prev[currentMeal], item],
    }));
  };

  const removeFromMeal = (meal, idx) => {
    setDietPlan((prev) => ({
      ...prev,
      [meal]: prev[meal].filter((_, i) => i !== idx),
    }));
  };

  const totalCaloriesByMeal = (meal) =>
    dietPlan[meal].reduce(
      (sum, f) =>
        sum + (f?.nutritionPerServing?.caloriesKcal ?? 0),
      0
    );

  // ------- SAVE DIET PLAN -------

  const handleSaveDietPlan = async () => {
    if (!patientId) {
      setSaveMsg("No patient selected.");
      return;
    }

    try {
      setSaving(true);
      setSaveMsg("");

      const token = localStorage.getItem("authToken");
      const payload = dietPlan;

      const res = await axios.post(
        `${API_BASE}/api/patients/${patientId}/diet-plan`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSaveMsg("Saved successfully!");
      onDietSaved && onDietSaved(res.data);
    } catch (err) {
      console.error("Save diet plan error:", err);
      setSaveMsg("Failed to save.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  // ------- STYLE HELPERS -------

  const cardBase =
    "border rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between";
  const mealButtonClasses = (meal) =>
    `px-4 py-2 rounded-full border text-sm transition ${
      currentMeal === meal
        ? "bg-green-600 text-white border-green-700 shadow"
        : "bg-white border-gray-300 hover:bg-gray-100"
    }`;

  // ------------------------------------------------
  //                      UI
  // ------------------------------------------------

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT – CARDS + FILTERS */}
      <div className="lg:col-span-2 space-y-6">
        {/* Search + filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Search by name, rasa, cuisine, tags..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="p-3 border rounded-lg shadow-sm"
            value={field}
            onChange={(e) => {
              setField(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All fields</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="cuisine">Cuisine</option>
            <option value="tags">Tags</option>
            <option value="rasa">Rasa (tastes)</option>
          </select>

          <input
            className="p-3 w-24 border rounded-lg shadow-sm"
            placeholder="Min cal"
            value={minCalories}
            onChange={(e) =>
              setMinCalories(e.target.value.replace(/[^0-9]/g, ""))
            }
          />
          <input
            className="p-3 w-24 border rounded-lg shadow-sm"
            placeholder="Max cal"
            value={maxCalories}
            onChange={(e) =>
              setMaxCalories(e.target.value.replace(/[^0-9]/g, ""))
            }
          />
        </div>

        {/* Meal Selector */}
        <div className="flex flex-wrap gap-3 items-center">
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

        {/* FOOD CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {paged.map((item) => {
            const n = item.nutritionPerServing || {};
            const a = item.ayurveda || {};
            const firstRasa = a.rasa?.[0];
            const doshaChips = getDoshaChips(a.doshaEffect);

            return (
              <article
                key={item.id}
                className={cardBase}
                onClick={() => setSelectedFood(item)}
              >
                {/* Top: name + basic tags */}
                <div>
                  <header className="mb-3">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg font-semibold text-gray-900 leading-snug">
                        {item.name}
                      </h2>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <Chip variant="soft-green">{item.cuisine}</Chip>
                      <Chip variant="soft-blue">{item.category}</Chip>
                      {item.mealSlots?.slice(0, 1).map((slot) => (
                        <Chip key={slot} variant="soft-purple">
                          {slot}
                        </Chip>
                      ))}
                    </div>
                  </header>

                  {/* Macro row (like cards in screenshot) */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-orange-50 rounded-xl p-2 text-center">
                      <div className="text-xs text-gray-500">Calories</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {n.caloriesKcal ?? "–"}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-2 text-center">
                      <div className="text-xs text-gray-500">Protein</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {n.proteinG ?? "–"}g
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-2 text-center">
                      <div className="text-xs text-gray-500">Carbs</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {n.carbsG ?? "–"}g
                      </div>
                    </div>
                  </div>

                  {/* Ayurvedic tags / short text */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {firstRasa && <Chip>{firstRasa} (Rasa)</Chip>}
                    {doshaChips.map((d) => (
                      <Chip key={d.dosha}>
                        {d.dosha}{" "}
                        {d.effect === -1
                          ? "↓ (pacifies)"
                          : d.effect === 1
                          ? "↑ (aggravates)"
                          : "• (neutral)"}
                      </Chip>
                    ))}
                  </div>

                  {/* Short description, built from indications */}
                  {item.indications && item.indications.length > 0 && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {item.indications.join(" • ")}
                    </p>
                  )}
                </div>

                {/* Add button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent opening modal
                    addToCurrentMeal(item);
                  }}
                  className="mt-4 w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow"
                >
                  Add to{" "}
                  {currentMeal.charAt(0).toUpperCase() +
                    currentMeal.slice(1)}
                </button>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-6">
            No foods match your filters.
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 text-sm mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* RIGHT – CURRENT DIET PLAN SUMMARY */}
      <aside className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl shadow-xl h-fit">
        <h2 className="text-xl font-semibold text-green-900 mb-2">
          Current Diet Plan
        </h2>
        <p className="text-xs text-green-700 mb-4">
          These meals will be saved to the patient&apos;s record.
        </p>

        {["breakfast", "lunch", "dinner"].map((meal) => (
          <div key={meal} className="mb-5">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">
                {meal.charAt(0).toUpperCase() + meal.slice(1)}
              </h3>
              <span className="text-xs text-gray-600">
                {dietPlan[meal].length} items •{" "}
                {totalCaloriesByMeal(meal)} cal
              </span>
            </div>

            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto pr-1">
              {dietPlan[meal].length === 0 && (
                <p className="text-xs italic text-gray-500">
                  No items added.
                </p>
              )}

              {dietPlan[meal].map((item, i) => (
                <div
                  key={`${meal}-${item.id}-${i}`}
                  className="flex justify-between items-center bg-white rounded-lg shadow p-2 border"
                >
                  <span className="truncate text-sm">{item.name}</span>
                  <button
                    className="text-red-500 text-xs ml-2"
                    onClick={() => removeFromMeal(meal, i)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleSaveDietPlan}
          disabled={saving}
          className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl shadow-lg disabled:opacity-60 text-sm font-medium"
        >
          {saving ? "Saving..." : "Save Diet Plan"}
        </button>

        {saveMsg && (
          <p className="text-xs text-center mt-3 text-green-900">
            {saveMsg}
          </p>
        )}
      </aside>

      {/* DETAIL MODAL (like Quinoa Upma UI) */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* HEADER BAR */}
            <div className="p-5 bg-teal-500 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {selectedFood.name}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Chip variant="soft-green">{selectedFood.cuisine}</Chip>
                  <Chip variant="soft-blue">{selectedFood.category}</Chip>
                  {selectedFood.mealSlots?.map((slot) => (
                    <Chip key={slot} variant="soft-purple">
                      {slot}
                    </Chip>
                  ))}
                </div>
              </div>

              <button
                className="text-white text-2xl leading-none ml-4"
                onClick={() => setSelectedFood(null)}
              >
                ✕
              </button>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Description (built from indications) */}
              {selectedFood.indications && (
                <section>
                  <h3 className="font-semibold mb-1 text-gray-800">
                    Description / Indications
                  </h3>
                  <p className="text-sm text-gray-700">
                    {selectedFood.indications.join(" • ")}
                  </p>
                </section>
              )}

              {/* NUTRITION SECTION */}
              <section>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Nutritional Information (per serving)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <InfoBox
                    label="Calories"
                    value={`${selectedFood.nutritionPerServing?.caloriesKcal ?? "–"} kcal`}
                  />
                  <InfoBox
                    label="Protein"
                    value={`${selectedFood.nutritionPerServing?.proteinG ?? "–"} g`}
                  />
                  <InfoBox
                    label="Carbs"
                    value={`${selectedFood.nutritionPerServing?.carbsG ?? "–"} g`}
                  />
                  <InfoBox
                    label="Fat"
                    value={`${selectedFood.nutritionPerServing?.fatG ?? "–"} g`}
                  />
                  <InfoBox
                    label="Fiber"
                    value={`${selectedFood.nutritionPerServing?.fiberG ?? "–"} g`}
                  />
                  {selectedFood.nutritionPerServing?.sodiumMg !== undefined && (
                    <InfoBox
                      label="Sodium"
                      value={`${selectedFood.nutritionPerServing.sodiumMg} mg`}
                    />
                  )}
                </div>
              </section>

              {/* AYURVEDIC PROPERTIES */}
              <section>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Ayurvedic Properties
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-green-50">
                    <p className="font-semibold mb-1">Rasa (Tastes)</p>
                    <p>{(selectedFood.ayurveda?.rasa || []).join(", ") || "—"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50">
                    <p className="font-semibold mb-1">Guna (Qualities)</p>
                    <p>{(selectedFood.ayurveda?.guna || []).join(", ") || "—"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-50">
                    <p className="font-semibold mb-1">Virya / Vipaka</p>
                    <p>
                      {selectedFood.ayurveda?.virya || "—"}{" "}
                      {selectedFood.ayurveda?.vipaka
                        ? `• ${selectedFood.ayurveda.vipaka} vipaka`
                        : ""}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-orange-50">
                    <p className="font-semibold mb-1">Dosha Effect</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getDoshaChips(selectedFood.ayurveda?.doshaEffect).map(
                        (d) => (
                          <Chip key={d.dosha}>
                            {d.dosha}{" "}
                            {d.effect === -1
                              ? "↓ pacifies"
                              : d.effect === 1
                              ? "↑ aggravates"
                              : "• neutral"}
                          </Chip>
                        )
                      )}
                    </div>
                  </div>
                  {selectedFood.ayurveda?.suitablePrakriti && (
                    <div className="p-4 rounded-xl bg-teal-50">
                      <p className="font-semibold mb-1">Suitable Prakriti</p>
                      <p>
                        {selectedFood.ayurveda.suitablePrakriti.join(", ")}
                      </p>
                    </div>
                  )}
                  {selectedFood.ayurveda?.avoidIn && (
                    <div className="p-4 rounded-xl bg-rose-50">
                      <p className="font-semibold mb-1">Avoid / Use Caution</p>
                      <ul className="list-disc pl-4 space-y-1">
                        {selectedFood.ayurveda.avoidIn.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              {/* INGREDIENTS (if recipe) */}
              {selectedFood.isRecipe && selectedFood.ingredients && (
                <section>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Ingredients
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="py-2 pr-4">Ingredient</th>
                          <th className="py-2 pr-4">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFood.ingredients.map((ing, index) => (
                          <tr
                            key={`${ing.name}-${index}`}
                            className="border-b last:border-0"
                          >
                            <td className="py-2 pr-4">{ing.name}</td>
                            <td className="py-2 pr-4">
                              {ing.quantity} {ing.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Tags */}
              {selectedFood.tags && selectedFood.tags.length > 0 && (
                <section>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFood.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Modal footer: Add to selection */}
            <div className="border-t p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-gray-500">
                Serving:{" "}
                {selectedFood.serving?.description ||
                  `${selectedFood.serving?.amount || ""} ${
                    selectedFood.serving?.unit || ""
                  }`}
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedFood(null)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    addToCurrentMeal(selectedFood);
                    setSelectedFood(null);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow"
                >
                  Add to{" "}
                  {currentMeal.charAt(0).toUpperCase() +
                    currentMeal.slice(1)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

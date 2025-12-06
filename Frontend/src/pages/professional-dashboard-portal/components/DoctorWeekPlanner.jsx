// src/pages/professional-dashboard-portal/components/DoctorWeekPlanner.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Button from "../../../components/ui/Button";

// IMPORTANT: must match FoodCardList's JSON import path and name
import foodsRaw from "./data.json";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

/**
 * Simple shared food library hook.
 */
function useFoodLibrary() {
  return foodsRaw || [];
}

/**
 * Helper: derive name, serving, dosha, and macros from your schema.
 */
function extractFoodProps(raw = {}) {
  // NAME
  const name =
    raw.name ||
    raw["Food Item"] ||
    raw.title ||
    raw.id ||
    "Food item";

  // SERVING TEXT
  let servingText = null;
  if (raw.serving) {
    if (raw.serving.description) {
      servingText = raw.serving.description;
    } else if (raw.serving.amount && raw.serving.unit) {
      servingText = `${raw.serving.amount} ${raw.serving.unit}`;
    }
  }

  // MACROS
  let calories = null;
  let protein = null;
  let carbs = null;
  let fat = null;

  if (raw.nutritionPerServing) {
    const n = raw.nutritionPerServing;
    if (n.caloriesKcal != null) calories = n.caloriesKcal;
    if (n.proteinG != null) protein = n.proteinG;
    if (n.carbsG != null) carbs = n.carbsG;
    if (n.fatG != null) fat = n.fatG;
  }

  if (calories == null && raw.calories != null) calories = raw.calories;
  if (calories == null && raw.kcal != null) calories = raw.kcal;

  // DOSHA EFFECT – from ayurveda.doshaEffect
  let dosha = null;
  if (raw.ayurveda && raw.ayurveda.doshaEffect) {
    const { vata, pitta, kapha } = raw.ayurveda.doshaEffect;
    const parts = [];
    if (typeof vata === "number") {
      parts.push(`Vata ${vata > 0 ? `+${vata}` : vata}`);
    }
    if (typeof pitta === "number") {
      parts.push(`Pitta ${pitta > 0 ? `+${pitta}` : pitta}`);
    }
    if (typeof kapha === "number") {
      parts.push(`Kapha ${kapha > 0 ? `+${kapha}` : kapha}`);
    }
    if (parts.length > 0) dosha = parts.join(" | ");
  }

  // If no explicit doshaEffect but suitablePrakriti exists
  if (!dosha && raw.ayurveda && Array.isArray(raw.ayurveda.suitablePrakriti)) {
    dosha = `Suitable: ${raw.ayurveda.suitablePrakriti.join(", ")}`;
  }

  return {
    name,
    servingText,
    dosha,
    calories,
    protein,
    carbs,
    fat,
  };
}

/**
 * FoodPickerModal (Search + Dosha Filters + Sorting + selection count)
 */
const FoodPickerModal = ({ open, onClose, onConfirm, title }) => {
  const foods = useFoodLibrary();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [query, setQuery] = useState("");
  const [doshaFilter, setDoshaFilter] = useState("all"); // all | vata | pitta | kapha | tri
  const [sortKey, setSortKey] = useState("relevance"); // relevance | calAsc | calDesc | nameAsc

  if (!open) return null;

  const selectedCount = selectedIds.size;

  const toggle = (id) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const normalizeDoshaStr = (doshaStr) => (doshaStr || "").toLowerCase();

  const passesDoshaFilter = (food) => {
    if (doshaFilter === "all") return true;

    const { dosha } = extractFoodProps(food);
    const d = normalizeDoshaStr(dosha);
    if (!d) return false;

    if (doshaFilter === "vata") return d.includes("vata");
    if (doshaFilter === "pitta") return d.includes("pitta");
    if (doshaFilter === "kapha") return d.includes("kapha");

    if (doshaFilter === "tri") {
      const hasV = d.includes("vata");
      const hasP = d.includes("pitta");
      const hasK = d.includes("kapha");
      return d.includes("tri") || (hasV && hasP && hasK);
    }

    return true;
  };

  // Enrich with original index for stable "relevance" ordering
  const enriched = foods.map((f, idx) => ({ ...f, _idx: idx }));

  const filteredFoods = enriched
    .filter((f) => {
      const { name, dosha, calories } = extractFoodProps(f);
      const q = query.trim().toLowerCase();

      const matchesQuery =
        q === "" ||
        String(name).toLowerCase().includes(q) ||
        String(dosha || "").toLowerCase().includes(q) ||
        String(calories || "").toLowerCase().includes(q);

      if (!matchesQuery) return false;
      return passesDoshaFilter(f);
    })
    .sort((a, b) => {
      if (sortKey === "relevance") {
        return a._idx - b._idx; // original order
      }

      const { name: nameA, calories: calA } = extractFoodProps(a);
      const { name: nameB, calories: calB } = extractFoodProps(b);
      const calANum = Number(calA ?? NaN);
      const calBNum = Number(calB ?? NaN);

      if (sortKey === "nameAsc") {
        return String(nameA).toLowerCase().localeCompare(
          String(nameB).toLowerCase()
        );
      }

      if (sortKey === "calAsc") {
        if (Number.isNaN(calANum) && Number.isNaN(calBNum)) return 0;
        if (Number.isNaN(calANum)) return 1;
        if (Number.isNaN(calBNum)) return -1;
        return calANum - calBNum;
      }

      if (sortKey === "calDesc") {
        if (Number.isNaN(calANum) && Number.isNaN(calBNum)) return 0;
        if (Number.isNaN(calANum)) return 1;
        if (Number.isNaN(calBNum)) return -1;
        return calBNum - calANum;
      }

      return 0;
    });

  const handleConfirm = () => {
    const items = foods.filter((f) => {
      const key = f.id || f._id || f["Food Item"] || f.name;
      return selectedIds.has(key);
    });
    onConfirm(items);
    setSelectedIds(new Set());
    setQuery("");
    setDoshaFilter("all");
    setSortKey("relevance");
  };

  const doshaOptions = [
    { key: "all", label: "All" },
    { key: "vata", label: "Vata" },
    { key: "pitta", label: "Pitta" },
    { key: "kapha", label: "Kapha" },
    { key: "tri", label: "Tridoshic / Mixed" },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[85vh] border border-emerald-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3 bg-gradient-to-r from-emerald-50 via-primary/5 to-emerald-50">
          <div>
            <h3 className="text-sm font-semibold text-emerald-900">
              {title || "Select foods"}
            </h3>
            <p className="text-[11px] text-emerald-800/80">
              Selected: {selectedCount} item{selectedCount === 1 ? "" : "s"}
            </p>
          </div>
          <button
            className="text-emerald-700 text-lg"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Search + filters */}
        <div className="border-b px-4 py-2 bg-gray-50 space-y-2">
          {/* Search bar */}
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm border-border"
            placeholder="Search foods by name, dosha, calories…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Dosha filter + Sort select + selected count */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* Dosha chips */}
            <div className="flex flex-wrap gap-1 text-[11px]">
              {doshaOptions.map((opt) => {
                const active = doshaFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setDoshaFilter(opt.key)}
                    className={`px-2 py-1 rounded-full border ${
                      active
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end">
              {/* Sort select */}
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-gray-500">Sort by:</span>
                <select
                  className="border rounded px-2 py-1 text-[11px] border-border"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="nameAsc">Name A–Z</option>
                  <option value="calAsc">Calories (low → high)</option>
                  <option value="calDesc">Calories (high → low)</option>
                </select>
              </div>

              {/* Selected count (compact) */}
              <div className="hidden sm:block text-[11px] text-gray-500">
                {selectedCount} selected
              </div>
            </div>
          </div>
        </div>

        {/* Food Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {filteredFoods.length === 0 && (
            <div className="text-xs text-gray-500 col-span-full">
              No foods found
              {query ? ` for "${query}"` : ""}.
            </div>
          )}

          {filteredFoods.map((f) => {
            const key = f.id || f._id || f["Food Item"] || f.name;
            const {
              name,
              servingText,
              dosha,
              calories,
              protein,
              carbs,
              fat,
            } = extractFoodProps(f);
            const active = selectedIds.has(key);

            return (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                className={`border rounded-lg px-3 py-2 text-left shadow-sm ${
                  active
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-border hover:border-emerald-300"
                }`}
              >
                <div className="font-medium text-sm text-text-primary">
                  {name}
                </div>

                {servingText && (
                  <div className="text-[11px] text-text-secondary mt-0.5">
                    {servingText}
                  </div>
                )}

                <div className="mt-1 text-[11px] text-gray-700">
                  {calories != null && (
                    <span>
                      {calories} kcal
                      {(protein != null || carbs != null || fat != null) &&
                        " · "}
                    </span>
                  )}
                  {protein != null && <span>{protein}g P · </span>}
                  {carbs != null && <span>{carbs}g C · </span>}
                  {fat != null && <span>{fat}g F</span>}
                </div>

                {dosha && (
                  <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px]">
                    Dosha: {String(dosha)}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-3 flex justify-between items-center gap-2 bg-white">
          <div className="text-[11px] text-gray-500">
            {selectedCount === 0
              ? "No items selected yet."
              : `${selectedCount} item${
                  selectedCount === 1 ? "" : "s"
                } selected.`}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedCount === 0}
            >
              {selectedCount === 0
                ? "Add selected"
                : `Add ${selectedCount} item${
                    selectedCount === 1 ? "" : "s"
                  }`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * DoctorWeekPlanner
 */
export default function DoctorWeekPlanner({ initialPatientName }) {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const [patient, setPatient] = useState(null);
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [durationDays, setDurationDays] = useState(7);

  // Days array: [{ date, meals: { breakfast, lunch, dinner }, exercises: [] }]
  const [days, setDays] = useState([]);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Food picker modal state
  const [foodPickerOpen, setFoodPickerOpen] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(null);
  const [activeMealKey, setActiveMealKey] = useState(null);

  const patientNameFromNav = location.state?.patientName;

  // Fetch clinical patient (to access dietPlan, etc.)
  useEffect(() => {
    if (!patientId) {
      setError("No patient id in route.");
      return;
    }
    if (!token) {
      setError("Not authenticated. Please sign in as a doctor.");
      return;
    }

    let cancelled = false;

    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/api/patients/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            body.message ||
              body.error ||
              `Failed to load patient (${res.status})`
          );
        }

        const data = await res.json();
        const normalized = data?.patient ? data.patient : data;

        if (!normalized) {
          throw new Error("Server returned empty patient data.");
        }

        if (!cancelled) {
          setPatient(normalized);
        }
      } catch (err) {
        console.error("DoctorWeekPlanner fetchPatient error:", err);
        if (!cancelled) {
          setError(err.message || "Error loading patient");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPatient();
    return () => {
      cancelled = true;
    };
  }, [patientId, token]);

  // Generate / regenerate days whenever start date or duration changes
  useEffect(() => {
    const start = weekStartDate ? new Date(weekStartDate) : new Date();
    const arr = [];

    for (let i = 0; i < durationDays; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      arr.push({
        date: date.toISOString().slice(0, 10),
        meals: { breakfast: [], lunch: [], dinner: [] },
        exercises: [],
      });
    }

    setDays(arr);
  }, [weekStartDate, durationDays]);

  // Helper: add an exercise to a day
  const addExercise = (dayIndex, ex) => {
    setDays((prev) => {
      const copy = [...prev];
      copy[dayIndex] = {
        ...copy[dayIndex],
        exercises: [...copy[dayIndex].exercises, ex],
      };
      return copy;
    });
  };

  // Copy one day's content to all other days
  const copyDayToAll = (sourceIndex) => {
    setDays((prev) => {
      const src = prev[sourceIndex];
      if (!src) return prev;

      return prev.map((d, idx) => {
        if (idx === sourceIndex) return d; // do not override the source day

        return {
          ...d,
          meals: {
            breakfast: (src.meals?.breakfast || []).map((m) => ({
              ...m,
              checked: false,
            })),
            lunch: (src.meals?.lunch || []).map((m) => ({
              ...m,
              checked: false,
            })),
            dinner: (src.meals?.dinner || []).map((m) => ({
              ...m,
              checked: false,
            })),
          },
          exercises: (src.exercises || []).map((ex) => ({
            ...ex,
            checked: false,
          })),
        };
      });
    });
  };

  // Apply existing main dietPlan to all days (kept for future use)
  const applyDietPlanToAllDays = () => {
    const base = patient?.dietPlan;
    if (!base) return;

    setDays((prev) =>
      prev.map((d) => ({
        ...d,
        meals: {
          breakfast: (base.breakfast || []).map((item) => ({
            food: item,
            notes: "",
            checked: false,
          })),
          lunch: (base.lunch || []).map((item) => ({
            food: item,
            notes: "",
            checked: false,
          })),
          dinner: (base.dinner || []).map((item) => ({
            food: item,
            notes: "",
            checked: false,
          })),
        },
      }))
    );
  };

  // When food has been picked from the modal
  const handleFoodPicked = (items) => {
    if (activeDayIndex == null || !activeMealKey) return;

    setDays((prev) => {
      const copy = [...prev];
      const day = copy[activeDayIndex];
      const existing = day.meals[activeMealKey] || [];

      const wrapped = items.map((item) => ({
        food: item,
        notes: "",
        checked: false,
      }));

      copy[activeDayIndex] = {
        ...day,
        meals: {
          ...day.meals,
          [activeMealKey]: [...existing, ...wrapped],
        },
      };

      return copy;
    });

    setFoodPickerOpen(false);
    setActiveDayIndex(null);
    setActiveMealKey(null);
  };

  // Helper: remove a single food item from a meal
  const removeMealItem = (dayIndex, mealKey, itemIndex) => {
    setDays((prev) => {
      const copy = [...prev];
      const day = copy[dayIndex];
      const current = day.meals[mealKey] || [];
      copy[dayIndex] = {
        ...day,
        meals: {
          ...day.meals,
          [mealKey]: current.filter((_, idx) => idx !== itemIndex),
        },
      };
      return copy;
    });
  };

  const handleSubmit = async () => {
    setError("");
    setSaving(true);
    try {
      const payload = {
        title: `Plan starting ${weekStartDate}`,
        weekStartDate,
        days,
        durationDays,
      };

      const res = await fetch(
        `${API_BASE}/api/patients/${patientId}/week-plan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to create plan");
      }

      await res.json();
      navigate(-1);
    } catch (err) {
      console.error("Create plan error:", err);
      setError(err.message || "Failed to create plan");
    } finally {
      setSaving(false);
    }
  };

  const resolvedName =
    initialPatientName ||
    patientNameFromNav ||
    patient?.name ||
    "Patient";

  return (
    <div className="min-h-screen bg-[#fdf7ee] flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-emerald-50 via-primary/5 to-emerald-100">
        <div>
          <h1 className="text-xl font-semibold text-emerald-950">
            Weekly plan for {resolvedName}
          </h1>
          <p className="text-xs text-emerald-900/80">
            Create a structured multi-day plan using the saved diet chart and
            food library.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
          {/* Loading / error state */}
          {loading && (
            <div className="text-sm text-text-secondary">
              Loading patient…
            </div>
          )}
          {error && !saving && (
            <div className="text-sm text-red-600">{error}</div>
          )}

          {/* Plan controls card */}
          <div className="bg-white rounded-xl border border-border p-4 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Plan start date
                </label>
                <input
                  type="date"
                  value={weekStartDate}
                  onChange={(e) => setWeekStartDate(e.target.value)}
                  className="w-full border border-border rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Plan length (days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={durationDays}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!Number.isNaN(v)) {
                      setDurationDays(Math.max(1, Math.min(v, 60)));
                    }
                  }}
                  className="w-full border border-border rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col justify-end">
                {/* Keep helper for future usage */}
                {/* <Button
                  variant="outline"
                  onClick={applyDietPlanToAllDays}
                  disabled={!patient?.dietPlan}
                >
                  Use main diet plan for all days
                </Button> */}
                {!patient?.dietPlan && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    No main diet plan saved yet. Configure it in the Diet
                    Planner first.
                  </p>
                )}
              </div>
            </div>

            <p className="text-[11px] text-gray-500">
              Tip: set the plan length and start date first, then fill meals and
              exercises. You can copy a configured day to all other days.
            </p>
          </div>

          {/* Per-day editor */}
          <div className="space-y-3">
            {days.map((d, idx) => (
              <div
                key={d.date || idx}
                className="bg-white rounded-xl border border-border p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      Day {idx + 1}
                    </div>
                    <div className="text-xs text-text-secondary">{d.date}</div>
                  </div>
                  <button
                    type="button"
                    className="text-[11px] text-blue-600 underline"
                    onClick={() => copyDayToAll(idx)}
                  >
                    Copy this day to all
                  </button>
                </div>

                {/* Meals */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["breakfast", "lunch", "dinner"].map((mk) => {
                    const items = d.meals[mk] || [];

                    return (
                      <div
                        key={mk}
                        className="p-3 bg-[#FAF5EE] rounded-lg flex flex-col"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium capitalize">
                            {mk}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {items.length} item
                            {items.length === 1 ? "" : "s"}
                          </div>
                        </div>

                        <button
                          className="text-xs text-blue-600 underline mb-2 self-start"
                          type="button"
                          onClick={() => {
                            setActiveDayIndex(idx);
                            setActiveMealKey(mk);
                            setFoodPickerOpen(true);
                          }}
                        >
                          Add items from food library
                        </button>

                        {/* List of selected items with properties */}
                        {items.length > 0 && (
                          <div className="mt-1 space-y-2 max-h-56 overflow-y-auto">
                            {items.map((item, itemIdx) => {
                              const raw = item.food || item || {};
                              const {
                                name,
                                servingText,
                                dosha,
                                calories,
                                protein,
                                carbs,
                                fat,
                              } = extractFoodProps(raw);

                              return (
                                <div
                                  key={`${mk}-${itemIdx}-${name}`}
                                  className="bg-white rounded-lg px-3 py-2 border border-border/60 shadow-sm flex gap-3"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <div className="font-medium text-[12px] text-gray-900">
                                          {name}
                                        </div>
                                        {servingText && (
                                          <div className="text-[11px] text-gray-500 mt-0.5">
                                            {servingText}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="mt-1 text-[11px] text-gray-700">
                                      {calories != null && (
                                        <span>
                                          {calories} kcal
                                          {(protein != null ||
                                            carbs != null ||
                                            fat != null) &&
                                            " · "}
                                        </span>
                                      )}
                                      {protein != null && (
                                        <span>{protein}g P · </span>
                                      )}
                                      {carbs != null && (
                                        <span>{carbs}g C · </span>
                                      )}
                                      {fat != null && (
                                        <span>{fat}g F</span>
                                      )}
                                    </div>

                                    {dosha && (
                                      <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px]">
                                        Dosha: {String(dosha)}
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    className="text-xs text-gray-400 hover:text-red-500 self-start"
                                    onClick={() =>
                                      removeMealItem(idx, mk, itemIdx)
                                    }
                                    title="Remove item"
                                  >
                                    ×
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Exercises */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">
                      Exercises ({d.exercises.length})
                    </div>
                  </div>
                  <button
                    className="text-xs text-blue-600 underline"
                    type="button"
                    onClick={() => {
                      const name = window.prompt(
                        "Exercise name (e.g., Brisk walk):"
                      );
                      if (!name) return;
                      const reps = window.prompt(
                        "Reps/duration (e.g., 30 min, 10 rounds - optional):"
                      );
                      addExercise(idx, { name, reps, checked: false });
                    }}
                  >
                    Add exercise
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="pt-2">
            {error && saving && (
              <div className="text-red-600 mb-2 text-sm">{error}</div>
            )}
            <Button onClick={handleSubmit} disabled={saving || !token}>
              {saving ? "Saving…" : "Create plan"}
            </Button>
          </div>
        </div>
      </main>

      {/* Food Picker Modal */}
      <FoodPickerModal
        open={foodPickerOpen}
        title={
          activeMealKey != null
            ? `Select foods for ${activeMealKey} (Day ${
                (activeDayIndex ?? 0) + 1
              })`
            : "Select foods"
        }
        onClose={() => {
          setFoodPickerOpen(false);
          setActiveDayIndex(null);
          setActiveMealKey(null);
        }}
        onConfirm={handleFoodPicked}
      />
    </div>
  );
}

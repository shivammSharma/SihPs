import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Button from "../../../components/ui/Button";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

/**
 * DoctorWeekPlanner
 * - Flexible plan length (durationDays: 7, 14, 30, etc.)
 * - Auto-generates days based on start date and duration
 * - Allows doctor to copy a fully-configured day to all days
 * - Creates a "week plan" (actually N-day plan) for a clinical patient
 */
export default function DoctorWeekPlanner({ initialPatientName }) {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  // Start date of the plan
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  // How many days this plan covers
  const [durationDays, setDurationDays] = useState(7);

  // Days array: [{ date, meals: { breakfast, lunch, dinner }, exercises: [] }]
  const [days, setDays] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Generate / regenerate days whenever start date or duration changes
  // Note: This resets meals/exercises if you change these AFTER editing,
  // so in practice doctor should set length first, then fill content.
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

  // Helper: update meals for a given day
  const updateMeal = (dayIndex, mealKey, items) => {
    setDays((prev) => {
      const copy = [...prev];
      copy[dayIndex] = {
        ...copy[dayIndex],
        meals: { ...copy[dayIndex].meals, [mealKey]: items },
      };
      return copy;
    });
  };

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

  // NEW: Copy one day's content to all other days
  const copyDayToAll = (sourceIndex) => {
    setDays((prev) => {
      const src = prev[sourceIndex];
      if (!src) return prev;

      return prev.map((d, idx) => {
        if (idx === sourceIndex) return d; // don't override the source day

        return {
          ...d,
          meals: {
            breakfast: (src.meals?.breakfast || []).map((m) => ({
              ...m,
              // patient will manage checked state later
            })),
            lunch: (src.meals?.lunch || []).map((m) => ({
              ...m,
            })),
            dinner: (src.meals?.dinner || []).map((m) => ({
              ...m,
            })),
          },
          exercises: (src.exercises || []).map((ex) => ({
            ...ex,
            checked: false, // start unchecked
          })),
        };
      });
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
        durationDays, // send to backend so it can store expected length
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
      // go back to previous page (e.g. patient drawer / list)
      navigate(-1);
    } catch (err) {
      console.error("Create plan error:", err);
      setError(err.message || "Failed to create plan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Create Plan for {initialPatientName || "Patient"}
          </h1>
          <p className="text-sm text-gray-600">
            Plan meals and exercises for {durationDays} day
            {durationDays > 1 ? "s" : ""}.
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </header>

      {/* Start date + duration */}
      <div className="mb-4 space-y-2">
        <div>
          <label className="block text-sm mb-1">Plan start date</label>
          <input
            type="date"
            value={weekStartDate}
            onChange={(e) => setWeekStartDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>Plan length:</span>
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
            className="w-20 border p-2 rounded"
          />
          <span>days</span>
        </div>
      </div>

      {/* Per-day editor */}
      <div className="space-y-3">
        {days.map((d, idx) => (
          <div key={d.date || idx} className="border p-3 rounded bg-white">
            <div className="flex items-center justify-between mb-2">
              <strong>{d.date}</strong>
              <button
                type="button"
                className="text-[11px] text-blue-600 underline"
                onClick={() => copyDayToAll(idx)}
              >
                Copy this day to all
              </button>
            </div>

            {/* Meals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {["breakfast", "lunch", "dinner"].map((mk) => (
                <div key={mk} className="p-2 bg-[#FAF5EE] rounded">
                  <div className="text-sm font-medium mb-1 capitalize">
                    {mk}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    Items: {d.meals[mk].length}
                  </div>

                  <button
                    className="text-sm text-blue-600 underline"
                    type="button"
                    onClick={() => {
                      const sample = window.prompt(
                        "Paste food item JSON (or name):"
                      );
                      if (!sample) return;
                      let item;
                      try {
                        item = JSON.parse(sample);
                      } catch {
                        item = { name: sample };
                      }
                      updateMeal(idx, mk, [
                        ...d.meals[mk],
                        { food: item, checked: false },
                      ]);
                    }}
                  >
                    Add item
                  </button>
                </div>
              ))}
            </div>

            {/* Exercises */}
            <div className="mt-2">
              <div className="text-sm font-medium mb-1">
                Exercises ({d.exercises.length})
              </div>
              <button
                className="text-sm text-blue-600 underline"
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
      <div className="mt-6">
        {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving…" : "Create Plan"}
        </Button>
      </div>
    </div>
  );
}

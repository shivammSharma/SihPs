// src/pages/personal-wellness-hub/components/PatientWeekPlan.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const mealKeys = ["breakfast", "lunch", "dinner"];

// today "YYYY-MM-DD"
function getTodayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// planned vs consumed macros for a day
function computeDayNutritionSplit(day) {
  const meals = day?.meals || {};
  const result = {
    assigned: { calories: 0, protein: 0, carbs: 0 },
    consumed: { calories: 0, protein: 0, carbs: 0 },
  };

  mealKeys.forEach((k) => {
    const arr = meals[k] || [];
    arr.forEach((item) => {
      const food = item.food || item || {};
      const n = food.nutritionPerServing || {};
      const cals = n.caloriesKcal || 0;
      const prot = n.proteinG || 0;
      const carbs = n.carbsG || 0;

      result.assigned.calories += cals;
      result.assigned.protein += prot;
      result.assigned.carbs += carbs;

      if (item.checked) {
        result.consumed.calories += cals;
        result.consumed.protein += prot;
        result.consumed.carbs += carbs;
      }
    });
  });

  return result;
}

export default function PatientWeekPlan({ patientId, planId: initialPlanId }) {
  const { token } = useAuth();

  const [plan, setPlan] = useState(null);
  const [planId, setPlanId] = useState(initialPlanId || null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [savingItem, setSavingItem] = useState(false);

  const todayStr = getTodayStr();

  // load plan
  useEffect(() => {
    if (!token || !patientId) return;

    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        let effectivePlanId = initialPlanId;

        if (!effectivePlanId) {
          const resList = await fetch(
            `${API_BASE}/api/patients/${patientId}/week-plans`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const body = await resList.json().catch(() => null);

          if (!resList.ok) {
            throw new Error(
              body?.message || `Failed to load weekly plans (${resList.status})`
            );
          }

          const plans = body.weeklyPlans || [];
          if (!plans.length) {
            setErr("No weekly plan assigned yet.");
            setPlan(null);
            return;
          }

          plans.sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt).getTime() -
              new Date(a.updatedAt || a.createdAt).getTime()
          );
          effectivePlanId = plans[0]._id;
          setPlanId(effectivePlanId);
        }

        const resOne = await fetch(
          `${API_BASE}/api/patients/${patientId}/week-plans/${effectivePlanId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const bodyOne = await resOne.json().catch(() => null);

        if (!resOne.ok) {
          throw new Error(
            bodyOne?.message ||
              `Failed to load weekly plan (${resOne.status})`
          );
        }

        setPlan(bodyOne.plan || null);
      } catch (e) {
        console.error("PatientWeekPlan load error:", e);
        setErr(e.message || "Failed to load weekly plan");
        setPlan(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, patientId, initialPlanId]);

  // toggle item
  const toggleItem = async (opts) => {
    if (!token || !plan || !planId) return;
    const { dayIndex, kind, mealKey, itemIndex, checked } = opts;

    try {
      setSavingItem(true);
      const res = await fetch(
        `${API_BASE}/api/patients/${patientId}/week-plans/${planId}/check`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dayIndex,
            kind,
            mealKey,
            itemIndex,
            checked,
          }),
        }
      );
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.message || "Failed to update item");
      }
      setPlan(body.plan || plan);
    } catch (e) {
      console.error("toggleItem error:", e);
      alert(e.message || "Failed to update");
    } finally {
      setSavingItem(false);
    }
  };

  const renderMealList = (day, mealKey, dayIndex, isPastDay) => {
    const arr = (day.meals && day.meals[mealKey]) || [];
    if (!arr.length) {
      return (
        <p className="text-[11px] text-gray-400 italic">
          No {mealKey} items.
        </p>
      );
    }

    return (
      <ul className="space-y-1">
        {arr.map((item, idx) => {
          const label =
            item.food?.name ||
            item.food?.["Food Item"] ||
            item.name ||
            "Food item";
          const checked = !!item.checked;

          return (
            <li key={`${mealKey}-${idx}`} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-3 w-3"
                checked={checked}
                disabled={savingItem || isPastDay}
                onChange={(e) => {
                  if (isPastDay) return;
                  toggleItem({
                    dayIndex,
                    kind: "meal",
                    mealKey,
                    itemIndex: idx,
                    checked: e.target.checked,
                  });
                }}
              />
              <span
                className={`text-[11px] truncate ${
                  isPastDay ? "text-gray-400" : "text-gray-800"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderExerciseList = (day, dayIndex, isPastDay) => {
    const arr = day.exercises || [];
    if (!arr.length) {
      return (
        <p className="text-[11px] text-gray-400 italic">
          No exercises added.
        </p>
      );
    }

    return (
      <ul className="space-y-1">
        {arr.map((ex, idx) => {
          const checked = !!ex.checked;
          return (
            <li key={idx} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-3 w-3"
                checked={checked}
                disabled={savingItem || isPastDay}
                onChange={(e) => {
                  if (isPastDay) return;
                  toggleItem({
                    dayIndex,
                    kind: "exercise",
                    itemIndex: idx,
                    checked: e.target.checked,
                  });
                }}
              />
              <span
                className={`text-[11px] truncate ${
                  isPastDay ? "text-gray-400" : "text-gray-800"
                }`}
              >
                {ex.name}{" "}
                {ex.reps ? `• ${ex.reps}` : ""}{" "}
                {ex.durationMinutes ? `• ${ex.durationMinutes} min` : ""}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  if (loading && !plan) {
    return <div className="text-sm text-gray-600">Loading weekly plan…</div>;
  }

  if (err && !plan) {
    return <div className="text-sm text-red-600">{err}</div>;
  }

  if (!plan) {
    return (
      <div className="text-sm text-gray-500">
        No weekly plan found for this patient.
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white border rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            {plan.title || "Weekly Diet & Exercise Plan"}
          </h2>
          <p className="text-[11px] text-gray-500">
            Week starting{" "}
            {plan.weekStartDate
              ? new Date(plan.weekStartDate).toLocaleDateString()
              : "—"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Overall Progress</p>
          <p className="text-lg font-semibold text-emerald-700">
            {plan.progressPercent ?? 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {plan.days?.map((day, dayIndex) => {
          const dayStr = day?.date ? String(day.date).slice(0, 10) : "";
          const isPastDay = dayStr && dayStr < todayStr;
          const isToday = dayStr === todayStr;

          const { assigned, consumed } = computeDayNutritionSplit(day);

          return (
            <div
              key={day.date || dayIndex}
              className="border rounded-lg p-3 bg-[#FAF5EE]"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-gray-800">
                  {day.date
                    ? new Date(day.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : `Day ${dayIndex + 1}`}
                </p>
                <div className="flex items-center gap-1">
                  {isToday && (
                    <span className="text-[10px] px-2 py-[1px] rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Today
                    </span>
                  )}
                  {isPastDay && (
                    <span className="text-[10px] px-2 py-[1px] rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      Past
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-2 text-[11px] text-gray-700 space-y-[2px]">
                <div>
                  <span className="font-semibold">Planned:</span>{" "}
                  {Math.round(assigned.calories)} kcal ·{" "}
                  {Math.round(assigned.protein)}g protein ·{" "}
                  {Math.round(assigned.carbs)}g carbs
                </div>
                <div>
                  <span className="font-semibold">Completed:</span>{" "}
                  {Math.round(consumed.calories)} kcal ·{" "}
                  {Math.round(consumed.protein)}g protein ·{" "}
                  {Math.round(consumed.carbs)}g carbs
                </div>
                {isPastDay && (
                  <p className="text-[10px] text-gray-500">
                    Past day – checkboxes are locked.
                  </p>
                )}
              </div>

              {mealKeys.map((mk) => (
                <div key={mk} className="mt-1">
                  <p className="text-[11px] font-semibold capitalize text-gray-700">
                    {mk}
                  </p>
                  {renderMealList(day, mk, dayIndex, isPastDay)}
                </div>
              ))}

              <div className="mt-2 border-top border-gray-200 pt-1">
                <p className="text-[11px] font-semibold text-gray-700">
                  Exercise
                </p>
                {renderExerciseList(day, dayIndex, isPastDay)}
              </div>
            </div>
          );
        })}
      </div>

      {savingItem && (
        <p className="mt-2 text-[11px] text-gray-500">
          Updating your progress…
        </p>
      )}
    </div>
  );
}

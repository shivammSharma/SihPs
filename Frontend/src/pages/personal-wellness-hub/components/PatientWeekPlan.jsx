import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const mealKeys = ["breakfast", "lunch", "dinner"];

export default function PatientWeekPlan({ patientId, planId: initialPlanId }) {
  const { token } = useAuth();

  const [plan, setPlan] = useState(null);
  const [planId, setPlanId] = useState(initialPlanId || null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [savingItem, setSavingItem] = useState(false);

  // 1) Load plan (if no planId passed, pick latest automatically)
  useEffect(() => {
    if (!token || !patientId) return;

    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        let effectivePlanId = initialPlanId;

        // If no planId provided, get all and pick latest
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

        // Now fetch a single plan by id
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
            bodyOne?.message || `Failed to load weekly plan (${resOne.status})`
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

  // 2) Toggle checkbox
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

      // backend returns { plan, progressPercent }
      setPlan(body.plan || plan);
    } catch (e) {
      console.error("toggleItem error:", e);
      alert(e.message || "Failed to update");
    } finally {
      setSavingItem(false);
    }
  };

  // 3) Render helpers
  const renderMealList = (day, mealKey, dayIndex) => {
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
          return (
            <li key={`${mealKey}-${idx}`} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-3 w-3"
                checked={!!item.checked}
                onChange={(e) =>
                  toggleItem({
                    dayIndex,
                    kind: "meal",
                    mealKey,
                    itemIndex: idx,
                    checked: e.target.checked,
                  })
                }
                disabled={savingItem}
              />
              <span className="text-[11px] text-gray-800 truncate">
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderExerciseList = (day, dayIndex) => {
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
        {arr.map((ex, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-3 w-3"
              checked={!!ex.checked}
              onChange={(e) =>
                toggleItem({
                  dayIndex,
                  kind: "exercise",
                  itemIndex: idx,
                  checked: e.target.checked,
                })
              }
              disabled={savingItem}
            />
            <span className="text-[11px] text-gray-800 truncate">
              {ex.name}{" "}
              {ex.reps ? `• ${ex.reps}` : ""}{" "}
              {ex.durationMinutes ? `• ${ex.durationMinutes} min` : ""}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // 4) Render component
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
          <p className="text-xs text-gray-500">Progress</p>
          <p className="text-lg font-semibold text-emerald-700">
            {plan.progressPercent ?? 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {plan.days?.map((day, dayIndex) => (
          <div
            key={day.date || dayIndex}
            className="border rounded-lg p-3 bg-[#FAF5EE]"
          >
            <p className="text-xs font-semibold text-gray-800 mb-1">
              {day.date
                ? new Date(day.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                : `Day ${dayIndex + 1}`}
            </p>

            {/* Meals */}
            {mealKeys.map((mk) => (
              <div key={mk} className="mt-1">
                <p className="text-[11px] font-semibold capitalize text-gray-700">
                  {mk}
                </p>
                {renderMealList(day, mk, dayIndex)}
              </div>
            ))}

            {/* Exercises */}
            <div className="mt-2 border-t border-gray-200 pt-1">
              <p className="text-[11px] font-semibold text-gray-700">
                Exercise
              </p>
              {renderExerciseList(day, dayIndex)}
            </div>
          </div>
        ))}
      </div>

      {savingItem && (
        <p className="mt-2 text-[11px] text-gray-500">
          Updating your progress…
        </p>
      )}
    </div>
  );
}

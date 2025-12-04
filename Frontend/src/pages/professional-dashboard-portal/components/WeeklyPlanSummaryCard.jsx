import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

export default function WeeklyPlanSummaryCard({ clinicalPatientId, onOpenPlanner }) {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [latestPlan, setLatestPlan] = useState(null);

  useEffect(() => {
    if (!token || !clinicalPatientId) return;

    const fetchPlans = async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(
          `${API_BASE}/api/patients/${clinicalPatientId}/week-plans`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const body = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(body?.message || "Failed to load weekly plans");
        }

        const plans = body.weeklyPlans || [];
        if (!plans.length) {
          setLatestPlan(null);
          return;
        }

        plans.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime()
        );
        setLatestPlan(plans[0]);
      } catch (e) {
        console.error("WeeklyPlanSummaryCard error:", e);
        setErr(e.message || "Failed to load weekly plan");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [token, clinicalPatientId]);

  if (!clinicalPatientId) {
    return (
      <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
        Link this clinical patient to a patient account first to assign weekly plans.
      </div>
    );
  }

  // Decide button label based on whether a plan exists
  const buttonLabel = latestPlan ? "Open Weekly Planner" : "Create Weekly Plan";

  return (
    <div className="mt-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-emerald-900">
          Weekly Diet & Exercise Plan
        </h3>
        {latestPlan && (
          <span className="text-xs font-semibold text-emerald-800">
            {latestPlan.progressPercent ?? 0}%
          </span>
        )}
      </div>

      {loading && (
        <p className="text-xs text-gray-600">Loading patient plan…</p>
      )}

      {!loading && err && (
        <p className="text-xs text-red-600 mb-2">{err}</p>
      )}

      {!loading && !err && !latestPlan && (
        <p className="text-xs text-gray-600 mb-3">
          No weekly plan assigned yet. Click below to create the first plan.
        </p>
      )}

      {!loading && !err && latestPlan && (
        <>
          <p className="text-[11px] text-gray-700 mb-2">
            <span className="font-semibold">
              {latestPlan.title || "Weekly Plan"}
            </span>{" "}
            · Week starting{" "}
            {latestPlan.weekStartDate
              ? new Date(latestPlan.weekStartDate).toLocaleDateString()
              : "—"}
          </p>

          {/* Per-day mini indicators */}
          <div className="flex flex-wrap gap-1 mb-3">
            {(latestPlan.days || []).map((day, idx) => {
              let total = 0;
              let checked = 0;
              const meals = day.meals || {};
              ["breakfast", "lunch", "dinner"].forEach((mk) => {
                (meals[mk] || []).forEach((it) => {
                  total += 1;
                  if (it.checked) checked += 1;
                });
              });
              (day.exercises || []).forEach((ex) => {
                total += 1;
                if (ex.checked) checked += 1;
              });
              const dayPct =
                total === 0 ? 0 : Math.round((checked / total) * 100);

              const level =
                dayPct >= 80
                  ? "bg-emerald-600"
                  : dayPct >= 40
                  ? "bg-amber-500"
                  : "bg-gray-300";

              return (
                <div
                  key={day.date || idx}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-6 h-6 rounded-full ${level}`}
                    title={`${dayPct}%`}
                  />
                  <span className="text-[10px] text-gray-600 mt-0.5">
                    {day.date
                      ? new Date(day.date).toLocaleDateString(undefined, {
                          weekday: "short",
                        })
                      : `D${idx + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Button always visible: open or create planner */}
      <button
        type="button"
        onClick={onOpenPlanner}
        className="w-full px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

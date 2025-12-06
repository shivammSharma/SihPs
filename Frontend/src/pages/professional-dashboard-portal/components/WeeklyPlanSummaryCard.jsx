// src/pages/professional-dashboard-portal/components/WeeklyPlanSummaryCard.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Icon from "../../../components/AppIcon";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const WeeklyPlanSummaryCard = ({ clinicalPatientId, onOpenPlanner }) => {
  const { token } = useAuth();
  const [latestPlan, setLatestPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!clinicalPatientId || !token) return;

    const load = async () => {
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
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        );
        setLatestPlan(plans[0]);
      } catch (e) {
        console.error("WeeklyPlanSummaryCard error:", e);
        setErr(e.message || "Failed to load weekly plan");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [clinicalPatientId, token]);

  if (loading) {
    return (
      <div className="border border-border rounded-lg p-3 text-xs text-gray-600 bg-white">
        Loading weekly plan…
      </div>
    );
  }

  if (err) {
    return (
      <div className="border border-border rounded-lg p-3 text-xs text-red-600 bg-red-50">
        {err}
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg p-3 bg-[#FAF5EE]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon name="Calendar" size={14} className="text-primary" />
          <span className="text-xs font-semibold text-gray-800">
            Weekly Plan
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenPlanner}
          className="text-[11px] px-2 py-1 rounded-md border border-primary text-primary hover:bg-primary/5"
        >
          Open Planner
        </button>
      </div>

      {latestPlan ? (
        <>
          <p className="text-xs text-gray-800">
            {latestPlan.title || "Plan"}
          </p>
          <p className="text-[11px] text-gray-500">
            {latestPlan.weekStartDate
              ? new Date(latestPlan.weekStartDate).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric" }
                )
              : "—"}{" "}
            · {latestPlan.durationDays || latestPlan.days?.length || 0} days
          </p>
          <p className="text-[11px] text-emerald-700 mt-1">
            Progress: {latestPlan.progressPercent ?? 0}%
          </p>
        </>
      ) : (
        <p className="text-[11px] text-gray-500">
          No weekly plan assigned yet.
        </p>
      )}
    </div>
  );
};

export default WeeklyPlanSummaryCard;

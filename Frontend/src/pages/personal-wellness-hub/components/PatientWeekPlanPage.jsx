import React from "react";
import { useParams } from "react-router-dom";
import PatientWeekPlan from "./PatientWeekPlan";

export default function PatientWeekPlanPage() {
  const { patientId, planId } = useParams();

  if (!patientId || !planId) {
    return <div>Invalid weekly plan link.</div>;
  }

  return <PatientWeekPlan patientId={patientId} planId={planId} />;
}

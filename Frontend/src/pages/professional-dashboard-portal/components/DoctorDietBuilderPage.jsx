import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import FoodCardList from "./FoodCardList";

const DoctorDietBuilderPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f9f6ef] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Diet Plan Builder
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ⬅ Back
        </button>
      </div>

      {/* Subtitle */}
      <p className="text-gray-600 mb-6">
        Creating diet chart for patient:
        <span className="font-medium ml-1 text-emerald-700">
          {patientId}
        </span>
      </p>

      {/* Food Selector */}
      <FoodCardList patientId={patientId} />
    </div>
  );
};

export default DoctorDietBuilderPage;

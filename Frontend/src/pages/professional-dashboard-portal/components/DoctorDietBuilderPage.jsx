import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import FoodCardList from "./FoodCardList";

const DoctorDietBuilderPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F3EC] p-6 flex flex-col items-center">

      {/* HEADER */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          🍽️ Diet Plan Builder
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
        >
          ⬅ Back
        </button>
      </div>

      {/* SUBTITLE */}
      <div className="w-full max-w-6xl mb-4">
        <p className="text-gray-700 text-sm">
          Building personalized diet plan for:
          <span className="ml-1 font-semibold text-green-700">{patientId}</span>
        </p>
      </div>

      {/* FOOD LIST + DIET SUMMARY */}
      <div className="w-full max-w-6xl">
        <FoodCardList patientId={patientId} />
      </div>

    </div>
  );
};

export default DoctorDietBuilderPage;

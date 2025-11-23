import React from "react";
import { useNavigate } from "react-router-dom";

const AuthSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fdf7ee] bg-gradient-to-b from-[#fdf7ee] via-[#f6f0e5] to-[#f3ecdf] flex flex-col">
      <div className="h-20" />

      <main className="flex-1 flex items-center justify-center px-4 py-14">
        <div className="max-w-6xl w-full mx-auto animate-fadeInUp">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-700/80 font-semibold mb-3">
              Choose Your Path
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[#1f2933] leading-tight">
              Join the AyurNutri Platform
            </h1>
            <p className="text-base md:text-lg text-[#4b5563] max-w-2xl mx-auto mt-3">
              Whether you're enhancing your own wellness or guiding patients—
              select the experience built for you.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Card */}
            <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-emerald-900/5 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                For Users
              </div>

              <h2 className="text-2xl font-semibold text-[#111827] mb-3">
                Personalized Nutrition & Wellness
              </h2>

              <ul className="text-[#374151] text-base space-y-2 mb-8">
                <li>• Food scanning & analysis</li>
                <li>• Personalized diet plans</li>
                <li>• Analytics & progress tracking</li>
                <li>• Doctor consultations</li>
              </ul>

              <button
                onClick={() => navigate("/signin")}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-md transition-all"
              >
                Join as User
              </button>
            </div>

            {/* Doctor Card */}
            <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-emerald-900/5 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                For Doctors
              </div>

              <h2 className="text-2xl font-semibold text-[#111827] mb-3">
                Clinical Intelligence Workflow
              </h2>

              <ul className="text-[#374151] text-base space-y-2 mb-8">
                <li>• Patient management</li>
                <li>• Diet plan creation & approval</li>
                <li>• Practice analytics</li>
              </ul>

              <button
                onClick={() => navigate("/signin/doctor")}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-md transition-all"
              >
                Join as Doctor
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthSelectionPage;

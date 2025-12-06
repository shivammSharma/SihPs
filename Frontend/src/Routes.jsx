// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

import HomepageAyurNutriPlatform from "./pages/homepage-ayur-nutri-platform";
import AyurvedicIntelligenceCenter from "./pages/ayurvedic-intelligence-center";
import ClinicalResearchLibrary from "./pages/clinical-research-library";
import PersonalWellnessHub from "./pages/personal-wellness-hub";
import ProfessionalDashboardPortal from "./pages/professional-dashboard-portal";
import DoctorWeekPlanner from "./pages/professional-dashboard-portal/components/DoctorWeekPlanner";

import SignInPage from "./pages/sign-in/SignInPage";
import SignInDoctor from "./pages/sign-in/SignInDoctor";
import SignupPatient from "./pages/sign-in/SignupPatient";
import SignupDoctor from "./pages/sign-in/SignupDoctor";
import ResetPassword from "./pages/sign-in/ResetPassword";
import AuthSelection from "./pages/auth-selection";

import DoctorDietBuilderPage from "./pages/professional-dashboard-portal/components/DoctorDietBuilderPage.jsx";
import FoodScan from "./pages/personal-wellness-hub/components/FoodScan";
import FoodScanResult from "./pages/personal-wellness-hub/components/FoodScanResult";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />

        <Routes>
          {/* Auth */}
          <Route path="/signin" element={<SignInPage />} />{" "}
          <Route path="/signin/doctor" element={<SignInDoctor />} />{" "}
          <Route path="/signup" element={<SignupPatient />} />{" "}
          <Route path="/signup/doctor" element={<SignupDoctor />} />{" "}
          <Route path="/reset" element={<ResetPassword />} />{" "}
          <Route path="/auth-selection" element={<AuthSelection />} />
          {/* Main */}
          <Route path="/" element={<HomepageAyurNutriPlatform />} />
          <Route
            path="/personal-wellness-hub"
            element={<PersonalWellnessHub />}
          />
          <Route
            path="/professional-dashboard-portal"
            element={<ProfessionalDashboardPortal />}
          />
          {/* Diet Builder */}
          <Route
            path="/doctor/diet-builder/:patientId"
            element={<DoctorDietBuilderPage />}
          />
          <Route
  path="/personal-wellness-hub/food-scan"
  element={<FoodScan />}
/>

<Route
  path="/personal-wellness-hub/food-scan/result"
  element={<FoodScanResult />}
/>
          <Route path="*" element={<NotFound />} />
          <Route
    path="/doctor/week-planner/:patientId"
    element={<DoctorWeekPlanner />}
  />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRoutes;

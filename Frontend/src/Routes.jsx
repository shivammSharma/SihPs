// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AuthSelection from "./pages/auth-selection";


// Main pages
import HomepageAyurNutriPlatform from "./pages/homepage-ayur-nutri-platform";
import AyurvedicIntelligenceCenter from "./pages/ayurvedic-intelligence-center";
import ClinicalResearchLibrary from "./pages/clinical-research-library";
import PersonalWellnessHub from "./pages/personal-wellness-hub";
import ProfessionalDashboardPortal from "./pages/professional-dashboard-portal";

// Auth pages
import SignInPage from "./pages/sign-in/SignInPage";          // patient login
import SignInDoctor from "./pages/sign-in/SignInDoctor";      // doctor login (if you have this)
import SignupPatient from "./pages/sign-in/SignupPatient";    // patient signup
import SignupDoctor from "./pages/sign-in/SignupDoctor";      // doctor signup
import ResetPassword from "./pages/sign-in/ResetPassword";

// Diet builder (doctor)
import DoctorDietBuilderPage from "./pages/professional-dashboard-portal/components/DoctorDietBuilderPage.jsx";
import FoodScan from "./pages/personal-wellness-hub/components/FoodScan";
import FoodScanResult from "./pages/personal-wellness-hub/components/FoodScanResult";


import DoctorWeekPlanner from "./pages/professional-dashboard-portal/components/DoctorWeekPlanner";
import PatientWeekPlanPage from "./pages/personal-wellness-hub/components/PatientWeekPlanPage"; 

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
          {/* Auth routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signin/doctor" element={<SignInDoctor />} />
          <Route path="/signup" element={<SignupPatient />} />
          <Route path="/signup/doctor" element={<SignupDoctor />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/auth-selection" element={<AuthSelection />} />


          {/* Public / main pages */}
          <Route
            path="/"
            element={<HomepageAyurNutriPlatform />}
          />
          <Route
            path="/homepage-ayur-nutri-platform"
            element={<HomepageAyurNutriPlatform />}
          />
          <Route
            path="/ayurvedic-intelligence-center"
            element={<AyurvedicIntelligenceCenter />}
          />
          <Route
            path="/clinical-research-library"
            element={<ClinicalResearchLibrary />}
          />

          {/* Patient dashboard */}
          <Route
            path="/personal-wellness-hub"
            element={<PersonalWellnessHub />}
          />

          {/* Doctor dashboard */}
          <Route
            path="/professional-dashboard-portal"
            element={<ProfessionalDashboardPortal />}
          />

          {/* Full-screen diet builder for a specific patient */}
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
        <Route
  path="/doctor/week-planner/:patientId"
  element={<DoctorWeekPlanner />}
/>

<Route
  path="/patient/week-plan/:patientId/:planId"
  element={<PatientWeekPlanPage />}
/>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRoutes;

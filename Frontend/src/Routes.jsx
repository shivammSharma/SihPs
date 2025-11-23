import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

// Main Pages
import HomepageAyurNutriPlatform from "./pages/homepage-ayur-nutri-platform";
import AyurvedicIntelligenceCenter from "./pages/ayurvedic-intelligence-center";
import ClinicalResearchLibrary from "./pages/clinical-research-library";

// Portals
import PersonalWellnessHub from "./pages/personal-wellness-hub";
import ProfessionalDashboardPortal from "./pages/professional-dashboard-portal";

// Auth Pages

import SignInPage from "./pages/sign-in/SignInPage";
import SignInDoctor from "./pages/sign-in/SignInDoctor";
import SignupPatient from "./pages/sign-in/SignupPatient";
import SignupDoctor from "./pages/sign-in/SignupDoctor";
import ResetPassword from "./pages/sign-in/ResetPassword";

// FIXED IMPORT (add /index.jsx)
import AuthSelectionPage from "./pages/auth-selection/index.jsx";

import useAuth from "./hooks/useAuth";


// ========= AUTH GUARDS ========= //

const RequireAuth = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

const RequireDoctorAuth = () => {
  const { isAuthenticated, isDoctor } = useAuth();
  return isAuthenticated && isDoctor
    ? <Outlet />
    : <Navigate to="/signin/doctor" replace />;
};


// ========= ROUTES ========= //

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />

        <Routes>
          {/* AUTH AREA */}
          <Route path="/join" element={<AuthSelectionPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signin/doctor" element={<SignInDoctor />} />
          <Route path="/signup" element={<SignupPatient />} />
          <Route path="/signup/doctor" element={<SignupDoctor />} />
          <Route path="/reset" element={<ResetPassword />} />

          {/* PUBLIC PAGES */}
          <Route path="/" element={<HomepageAyurNutriPlatform />} />
          <Route path="/homepage-ayur-nutri-platform" element={<HomepageAyurNutriPlatform />} />
          <Route path="/ayurvedic-intelligence-center" element={<AyurvedicIntelligenceCenter />} />
          <Route path="/clinical-research-library" element={<ClinicalResearchLibrary />} />

          {/* PATIENT DASHBOARD */}
          <Route element={<RequireAuth />}>
            <Route path="/personal-wellness-hub" element={<PersonalWellnessHub />} />
          </Route>

          {/* DOCTOR DASHBOARD */}
          <Route element={<RequireDoctorAuth />}>
            <Route path="/professional-dashboard-portal" element={<ProfessionalDashboardPortal />} />
          </Route>

          {/* CATCH-ALL */}
          <Route path="*" element={<NotFound />} />
        </Routes>

      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRoutes;

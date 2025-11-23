// src/AppRoutes.jsx (or wherever this file is)
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

import AyurvedicIntelligenceCenter from "./pages/ayurvedic-intelligence-center";
import PersonalWellnessHub from "./pages/personal-wellness-hub";
import HomepageAyurNutriPlatform from "./pages/homepage-ayur-nutri-platform";
import ProfessionalDashboardPortal from "./pages/professional-dashboard-portal";

import SignInPage from "./pages/sign-in/SignInPage";
import SignupPatient from "./pages/sign-in/SignupPatient";
import SignupDoctor from "./pages/sign-in/SignupDoctor";
import ResetPassword from "./pages/sign-in/ResetPassword";
import SignInDoctor from "./pages/sign-in/SignInDoctor";

import ClinicalResearchLibrary from "./pages/clinical-research-library";

import useAuth from "./hooks/useAuth";

// ========= AUTH GUARDS ========= //

const RequireAuth = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

const RequireDoctorAuth = () => {
  const { isAuthenticated, isDoctor } = useAuth();

  if (!isAuthenticated || !isDoctor) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
          {/* Auth */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignupPatient />} />
          <Route path="/signup/doctor" element={<SignupDoctor />} />
          <Route path="/signin/doctor" element={<SignInDoctor />} />
          <Route path="/reset" element={<ResetPassword />} />
          

          {/* Main public */}
          <Route path="/" element={<HomepageAyurNutriPlatform />} />
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

          {/* Protected patient route */}
          <Route element={<RequireAuth />}>
            <Route
              path="/personal-wellness-hub"
              element={<PersonalWellnessHub />}
            />
          </Route>

          {/* Protected doctor route */}
          <Route element={<RequireDoctorAuth />}>
            <Route
              path="/professional-dashboard-portal"
              element={<ProfessionalDashboardPortal />}
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRoutes;

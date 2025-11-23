// src/pages/personal-wellness-hub/index.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Local components
import NavbarPatient from './components/NavbarPatient';
import DashboardHome from './components/DashboardHome';
import FoodScan from './components/FoodScan';
import Analytics from './components/Analytics';
import Sessions from './components/Sessions';
import Messages from './components/Messages';

const pageMotion = {
  initial: { opacity: 0, y: 10, scale: 0.995 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.995 },
  transition: { duration: 0.36, ease: 'easeOut' },
};

const PersonalWellnessHub = () => {
    const { user, isPatient } = useAuth();

  // If somehow a doctor or unauthenticated user gets here:
  if (!isPatient) {
    if (user?.role === "doctor") {
      return <Navigate to="/professional-dashboard-portal" replace />;
    }
    return <Navigate to="/signin" replace />;
  }
  const [active, setActive] = useState('dashboard');

  const userData = {
    name: 'Priya Sharma',
    constitution: 'Vata-Pitta',
    journeyDay: 45,
    wellnessScore: 78,
  };

  const todaysRecommendations = {
    primaryMeal: 'Kitchari with seasonal vegetables',
  };

  const renderActive = () => {
    switch (active) {
      case 'dashboard':
        return (
          <DashboardHome
            userData={userData}
            todaysRecommendations={todaysRecommendations}
          />
        );
      case 'food-scan':
        return <FoodScan />;
      case 'analytics':
        return <Analytics />;
      case 'sessions':
        return <Sessions />;
      case 'messages':
        return <Messages />;
      default:
        return (
          <DashboardHome
            userData={userData}
            todaysRecommendations={todaysRecommendations}
          />
        );
    }
  };

  const themeVars = {
    '--ayur-primary': '#0F6C3F',
    '--ayur-mint': '#E8F7EE',
    '--ayur-beige': '#E8E2D9',
    '--ayur-border': '#D6D1C9',
    '--ayur-text-dark': '#2A2A2A',
    '--ayur-text-med': '#555555',
    '--ayur-bg': '#FAF9F6',
  };

  const logoLocalPath = '/mnt/data/Screenshot 2025-11-19 190435.png';

  return (
    <div style={themeVars} className="min-h-screen" aria-live="polite">
      <Helmet>
        <title>Personal Wellness Hub</title>
      </Helmet>

      <NavbarPatient
        active={active}
        onNavigate={setActive}
        logoUrl={logoLocalPath}
      />

      <main className="pt-6 pb-12 bg-[var(--ayur-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageMotion}
              transition={pageMotion.transition}
            >
              <div className="space-y-8">{renderActive()}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default PersonalWellnessHub;

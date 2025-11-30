// src/components/ui/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import useAuth from "../../hooks/useAuth";


const Header = ({ className = "", isHomePage = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, isDoctor, isPatient, logout } = useAuth();

  const pathname = location?.pathname || "/";

  // use homepage flag + paths
  const isHome =
    isHomePage ||
    pathname === "/" ||
    pathname === "/homepage-ayur-nutri-platform";

  const isDoctorDashboard =
    pathname.startsWith("/professional-dashboard-portal");
  const isAuthSelection = pathname.startsWith("/auth-selection");

  // Detect actual role
  const role = isDoctor ? "doctor" : isPatient ? "patient" : null;

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Navigation Fixes
  const handleProfessionalPortal = () => {
    if (role === "doctor") navigate("/professional-dashboard-portal");
    else navigate("/signin/doctor");
  };

  const handleWellnessHub = () => {
    if (role === "patient") navigate("/personal-wellness-hub");
    else navigate("/signin");
  };

  const handleSignInClick = () => {
    setIsMobileMenuOpen(false);
    navigate("/auth-selection");
  };

  const getDisplayName = () => {
    if (!user) return "";
    const base = user.fullName || user.name || "";
    if (isDoctor && !/^dr\.?/i.test(base.trim())) return `Dr. ${base}`;
    return base;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 organic-transition ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md elevated-shadow border-b border-border"
          : "bg-background/80 backdrop-blur-sm"
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 items-center h-16 px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <div className="col-span-1 flex items-center">
            <Link
              to="/homepage-ayur-nutri-platform"
              className="flex items-center space-x-3 organic-transition hover:opacity-80"
            >
              <div className="relative">
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
                  <circle cx="20" cy="20" r="18" fill="currentColor" className="opacity-10" />
                  <path
                    d="M20 8c-1.5 0-3 .5-4 1.5L12 14l4 4 4-4-4-4c1-.5 2.5-1 4-1s3 .5 4 1l-4 4 4 4 4-4.5c1-1 1.5-2.5 1.5-4s-.5-3-1.5-4S21.5 8 20 8z"
                    fill="currentColor"
                  />
                  <circle cx="20" cy="26" r="6" fill="var(--color-secondary)" className="opacity-80" />
                  <circle cx="20" cy="26" r="3" fill="currentColor" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-xl font-display font-semibold text-primary leading-tight">
                  AyurNutri
                </span>
                <span className="text-xs font-accent text-text-secondary leading-none">
                  Ancient Wisdom • Modern Precision
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isDoctorDashboard && !isAuthSelection && (
            <nav className="col-span-1 hidden lg:flex items-center justify-center">
              <div className="flex items-center space-x-1 bg-background/80 backdrop-blur-sm rounded-xl p-2 organic-shadow">

                <button
                  onClick={() => navigate("/ayurvedic-intelligence-center")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
                    pathname === "/ayurvedic-intelligence-center"
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-text-secondary hover:text-primary hover:bg-muted/50"
                  }`}
                >
                  <Icon name="Brain" size={16} />
                  <span>Intelligence Center</span>
                </button>

                <button
                  onClick={handleProfessionalPortal}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
                    pathname.startsWith("/professional-dashboard-portal")
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-text-secondary hover:text-primary hover:bg-muted/50"
                  }`}
                >
                  <Icon name="Stethoscope" size={16} />
                  <span>Professional Portal</span>
                </button>

                <button
                  onClick={handleWellnessHub}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
                    pathname.startsWith("/personal-wellness-hub")
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-text-secondary hover:text-primary hover:bg-muted/50"
                  }`}
                >
                  <Icon name="Heart" size={16} />
                  <span>Wellness Hub</span>
                </button>

              </div>
            </nav>
          )}

          {/* Right Section */}
          <div className="col-span-1 flex items-center justify-end space-x-3">

            {/* SIGN IN BUTTON on Homepage */}
            {isHome && !isAuthenticated && (
              <Button
                variant="default"
                size="sm"
                className="bg-brand-gold hover:bg-brand-gold/90 hidden lg:flex"
                onClick={handleSignInClick}
              >
                Sign In
              </Button>
            )}

            {/* Logged-in user */}
            {!isHome && isAuthenticated && (
              <div className="hidden lg:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    isDoctor
                      ? navigate("/professional-dashboard-portal")
                      : navigate("/personal-wellness-hub")
                  }
                >
                  <Icon name="User" size={16} />
                  <span className="text-sm">{getDisplayName()}</span>
                </Button>

                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="lg:hidden p-2 rounded-md hover:bg-muted/50 organic-transition"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-4 space-y-4">

            <button
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted/50"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/ayurvedic-intelligence-center");
              }}
            >
              <Icon name="Brain" size={20} />
              <span>Intelligence Center</span>
            </button>

            <button
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted/50"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleProfessionalPortal();
              }}
            >
              <Icon name="Stethoscope" size={20} />
              <span>Professional Portal</span>
            </button>

            <button
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted/50"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleWellnessHub();
              }}
            >
              <Icon name="Heart" size={20} />
              <span>Wellness Hub</span>
            </button>

            <hr className="border-border" />

            {!isAuthenticated ? (
              <Button
                variant="default"
                fullWidth
                className="bg-brand-gold hover:bg-brand-gold/90"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignInClick();
                }}
              >
                Sign In
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    isDoctor
                      ? navigate("/professional-dashboard-portal")
                      : navigate("/personal-wellness-hub");
                  }}
                >
                  {getDisplayName()}
                </Button>

                <Button
                  variant="default"
                  fullWidth
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

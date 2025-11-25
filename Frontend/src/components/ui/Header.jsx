// src/components/ui/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import useAuth from "../../hooks/useAuth";

const Header = ({ className = "" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, isDoctor, logout } = useAuth();

  // route helpers
  const pathname = location?.pathname || "/";
  const isHome =
    pathname === "/" || pathname === "/homepage-ayur-nutri-platform";
  const isDoctorDashboard = pathname.startsWith("/professional-dashboard-portal");
  const isAuthSelection = pathname.startsWith("/auth-selection");

  const navigationItems = [
    {
      name: "Intelligence Center",
      path: "/ayurvedic-intelligence-center",
      icon: "Brain",
    },
    {
      name: "Professional Portal",
      path: "/professional-dashboard-portal",
      icon: "Stethoscope",
    },
    { name: "Wellness Hub", path: "/personal-wellness-hub", icon: "Heart" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const isActivePath = (path) => pathname === path;

  const getDisplayName = () => {
    if (!user) return "";
    const baseName = user.fullName || user.name || "";
    if (isDoctor) {
      // avoid "Dr. Dr. ..."
      if (/^dr\.?/i.test(baseName.trim())) return baseName;
      return `Dr. ${baseName}`;
    }
    return baseName;
  };

  const handleAccountClick = () => {
    if (isDoctor) {
      navigate("/professional-dashboard-portal");
    } else {
      navigate("/personal-wellness-hub");
    }
  };

const handleSignInClick = () => {
  closeMobileMenu();
  navigate("/join");
};


  const Logo = () => (
    <Link
      to="/homepage-ayur-nutri-platform"
      className="flex items-center space-x-3 organic-transition hover:opacity-80"
      onClick={closeMobileMenu}
    >
      <div className="relative">
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
          <circle cx="20" cy="20" r="18" fill="currentColor" className="opacity-10" />
          <path
            d="M20 8c-1.5 0-3 .5-4 1.5L12 14l4 4 4-4-4-4c1-.5 2.5-1 4-1s3 .5 4 1l-4 4 4 4 4-4.5c1-1 1.5-2.5 1.5-4s-.5-3-1.5-4S21.5 8 20 8z"
            fill="currentColor"
          />
          <circle
            cx="20"
            cy="26"
            r="6"
            fill="var(--color-secondary)"
            className="opacity-80"
          />
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
  );

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
          {/* Left: Logo */}
          <div className="col-span-1 flex items-center">
            <Logo />
          </div>

          {/* Center nav (hidden on doctor dashboard & auth-selection) */}
          {!isDoctorDashboard && !isAuthSelection && (
            <nav className="col-span-1 hidden lg:flex items-center justify-center">
              <div className="flex items-center space-x-1 bg-background/80 backdrop-blur-sm rounded-xl p-2 organic-shadow">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium organic-transition whitespace-nowrap ${
                      isActivePath(item.path)
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-text-secondary hover:text-primary hover:bg-muted/50"
                    }`}
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </nav>
          )}

          {/* Right: auth / account */}
          <div className="col-span-1 flex items-center justify-end space-x-3">
            <div className="hidden lg:flex items-center space-x-3">
              {/* 1) Doctor dashboard: only show doctor name + logout */}
              {isDoctorDashboard && isDoctor && (
                <div className="flex items-center space-x-2">
                  <Icon name="User" size={16} />
                  <span className="text-sm font-medium">{getDisplayName()}</span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              )}

              {/* 2) Public home / auth selection: always show Sign In button */}
              {!isDoctorDashboard && (isHome || isAuthSelection) && (
                <Button
                  variant="default"
                  size="sm"
                  className="bg-brand-gold hover:bg-brand-gold/90"
                  onClick={handleSignInClick}
                >
                  Sign In
                </Button>
              )}

              {/* 3) Other pages when logged in (not home, not dashboard) */}
              {!isDoctorDashboard &&
                !isHome &&
                !isAuthSelection &&
                isAuthenticated && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAccountClick}
                      className="flex items-center space-x-2"
                    >
                      <Icon name="User" size={16} />
                      <span className="text-sm">{getDisplayName()}</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                )}

              {/* 4) Other pages when NOT logged in (not home, not dashboard) */}
              {!isDoctorDashboard &&
                !isHome &&
                !isAuthSelection &&
                !isAuthenticated && (
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-brand-gold hover:bg-brand-gold/90"
                    onClick={handleSignInClick}
                  >
                    Sign In
                  </Button>
                )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-text-secondary hover:text-primary hover:bg-muted/50 organic-transition"
                aria-label="Toggle mobile menu"
              >
                <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-2">
              {/* Nav items (hidden on doctor dashboard & auth-selection) */}
              {!isDoctorDashboard && !isAuthSelection &&
                navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium organic-transition ${
                      isActivePath(item.path)
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-text-secondary hover:text-primary hover:bg-muted/50"
                    }`}
                  >
                    <Icon name={item.icon} size={20} />
                    <span>{item.name}</span>
                  </Link>
                ))}

              <hr className="my-3 border-border" />

              <div className="pt-4 space-y-3">
                {/* Doctor dashboard mobile: doctor info + logout */}
                {isDoctorDashboard && isDoctor && (
                  <>
                    <Button variant="ghost" fullWidth disabled>
                      {getDisplayName()}
                    </Button>
                    <Button
                      variant="default"
                      fullWidth
                      className="bg-brand-gold hover:bg-brand-gold/90"
                      onClick={() => {
                        closeMobileMenu();
                        logout();
                      }}
                    >
                      Logout
                    </Button>
                  </>
                )}

                {/* Home / auth-selection mobile: only Sign In */}
                {!isDoctorDashboard && (isHome || isAuthSelection) && (
                  <Button
                    variant="default"
                    fullWidth
                    className="bg-brand-gold hover:bg-brand-gold/90"
                    onClick={handleSignInClick}
                  >
                    Sign In
                  </Button>
                )}

                {/* Other pages mobile: signed in */}
                {!isDoctorDashboard &&
                  !isHome &&
                  !isAuthSelection &&
                  isAuthenticated && (
                    <>
                      <Button
                        variant="ghost"
                        fullWidth
                        onClick={() => {
                          closeMobileMenu();
                          handleAccountClick();
                        }}
                      >
                        {getDisplayName()}
                      </Button>
                      <Button
                        variant="default"
                        fullWidth
                        className="bg-brand-gold hover:bg-brand-gold/90"
                        onClick={() => {
                          closeMobileMenu();
                          logout();
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  )}

                {/* Other pages mobile: not signed in */}
                {!isDoctorDashboard &&
                  !isHome &&
                  !isAuthSelection &&
                  !isAuthenticated && (
                    <Button
                      variant="default"
                      fullWidth
                      className="bg-brand-gold hover:bg-brand-gold/90"
                      onClick={handleSignInClick}
                    >
                      Sign In
                    </Button>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

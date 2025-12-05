import React from "react";
import Button from "../../../components/ui/Button";
import useAuth from "../../../hooks/useAuth";

// Correct: logo is inside src/assets/logo.jpg
import LotusLogo from "../../../assets/logo.jpg";

const NavbarPatient = ({
  active = "dashboard",
  onNavigate = () => {},
}) => {
  const { user, logout } = useAuth();

  const nav = [
    { id: "dashboard", label: "Dashboard" },
    { id: "food-scan", label: "Food Scan" },
    { id: "analytics", label: "Analytics" },
    { id: "sessions", label: "Sessions" },
    { id: "messages", label: "Messages" },
    { id: "intelligence-center", label: "Intelligence Center" },
  ];

  return (
    <header className="bg-cream border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">

          {/* LEFT — LOGO */}
          <div className="flex items-center gap-3">
            <img
              src={LotusLogo}
              alt="AyurNutri"
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* MIDDLE — NAV */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex items-center gap-8">
              {nav.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => onNavigate(n.id)}
                    className={`text-sm font-medium transition-colors ${
                      active === n.id
                        ? "text-emerald-800"
                        : "text-emerald-600 hover:text-emerald-800"
                    }`}
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* RIGHT — USER + LOGOUT */}
          <div className="flex items-center gap-3">
            {user?.fullName && (
              <span className="hidden sm:inline text-sm text-emerald-800">
                Hi, {user.fullName}
              </span>
            )}

            <Button
              variant="default"
              size="sm"
              className="bg-emerald-800 hover:bg-emerald-900 text-white"
              onClick={logout}
            >
              Logout
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default NavbarPatient;

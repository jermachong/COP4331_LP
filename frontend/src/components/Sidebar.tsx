import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onLogout }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const sidebarWidth = 250;
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navigation = [
    { name: "Home", href: "/dashboard" },
    { name: "Plan a Trip", href: "/tripQuestionnaire" },
    { name: "Saved Trips", href: "/saved" },
    { name: "Explore", href: "/explore" },
  ];

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "http://travelinggenie.com:5000/api";

  useEffect(() => {
    // get user data from the backend
    const getUserData = async () => {
      try {
        // get user id
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("Local user:", user);
        const userId = user.userId;

        // send to backend
        const response = await fetch(`${API_URL}/get-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Hamburger Toggle Button */}
      <button
        className="btn btn-outline-secondary position-fixed top-0 start-0 m-3"
        style={{
          zIndex: 1100,
          borderRadius: "0.25rem",
          padding: "0.25rem 0.5rem",
          fontSize: "1.25rem",
        }}
        onClick={onToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className="position-fixed top-0 h-100 shadow-sm d-flex flex-column"
        style={{
          width: `${sidebarWidth}px`,
          zIndex: 1050,
          transform: isOpen
            ? "translateX(0)"
            : `translateX(-${sidebarWidth}px)`,
          transition: "transform 0.3s ease-in-out",
          backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#000000",
        }}
      >
        {/* Sidebar Header */}
        <div className="d-flex align-items-center justify-content-between border-bottom p-3">
          <h4
            className="mb-0"
            style={{
              marginLeft: "3rem",
              marginTop: "0.5rem",
            }}
          >
            Travel Genie
          </h4>
          <button
            className="btn btn-link p-0"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"
              } mode`}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="nav flex-column p-3 flex-grow-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-link ${isActive(item.href)
                  ? "active fw-bold text-primary"
                  : theme === "dark"
                    ? "text-white"
                    : "text-dark"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="border-top p-3">
          <div className="d-flex flex-column align-items-center">
            <h6 className="mb-1">
              {userData.firstName} {userData.lastName}
            </h6>
            <small className="text-muted mb-3">{userData.email}</small>

            <div className="d-grid gap-2 w-100">
              <Link to="/profile" className="btn btn-outline-primary btn-sm">
                Profile
              </Link>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={onLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

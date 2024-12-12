// src/layouts/RootLayout.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
// Remove ChevronRightIcon and ChevronLeftIcon imports
import SideBar from "../pages/global/SideBar";
import "./root-layout.css";

export default function RootLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { isLoggedIn, logout } = useContext(AuthContext); // Ensure 'logout' is destructured

  const handleSidebarToggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="root-layout">
      {isLoggedIn && (
        <div className="side-bar">
          {/* Remove the toggle button */}
          <SideBar
            collapsed={collapsed}
            onToggle={handleSidebarToggle} // Pass the toggle function
            onLogout={logout} // Pass the logout function
          />
        </div>
      )}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

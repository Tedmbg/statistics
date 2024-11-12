import { Outlet } from "react-router-dom";
import SideBar from "../pages/global/SideBar";
import "./root-layout.css";
import expandSidebar from "../assets/expand-sidebar-1.svg";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState } from "react";


export default function RootLayout() {
  const [toggleSidebar, setToggleSidebar] = useState(true);

  function handleSidebarToggle() {
    setToggleSidebar(prev => !prev);
  }

  return (
    <div className={`root-layout ${toggleSidebar ? "" : "sidebar-hidden"}`}>
      <div className={`sidebar-content ${toggleSidebar ? "visibleSidebar" : "hiddenSidebar"}`}>
        <button className="toggle-siderbar-btn" onClick={handleSidebarToggle}>
          <ChevronRightIcon />
        </button>
        <SideBar isvisible={toggleSidebar}/>
      </div>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

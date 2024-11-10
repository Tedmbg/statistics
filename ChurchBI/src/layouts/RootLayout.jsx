
import { Outlet } from "react-router-dom";
import SideBar from "../pages/global/SideBar";
import "./root-layout.css";
import ""

export default function RootLayout() {

  return (
    <div className="root-layout">
      <div className="sidebar-content">

       {/* <SideBar/> */}
      </div>
      
      <main className="main-content">
        <Outlet/>
      </main>
    </div>
  );
}

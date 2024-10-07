import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../pages/global/SideBar";
import "./root-layout.css";

export default function RootLayout() {

  return (
    <div className="root-layout">
      <SideBar/>
      <main className="main-content">
        <Outlet/>
      </main>
    </div>
  );
}

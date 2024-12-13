// src/App.jsx
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Layout
import RootLayout from "./layouts/RootLayout";

// Pages
import LoginScreen from "./pages/LoginPage/login";
import Dashboard from "./pages/dashboard/Dashboard";
import RetentionRate from "./pages/membership-management/retantionRate/RetentionRate";
import Demographics from "./pages/membership-management/demographics/Demographics";
import Members from "./pages/membership-management/addmember/members";
import Discipleship from "./pages/membership-management/discipleship/Discipleship";
import Attendance from "./pages/membership-management/attendence/Attendance";
import ServiceMinistry from "./pages/ministries/service-ministry/ServiceMinistry";
import CreateMinistry from "./pages/ministries/create-ministry/CreateMinistry";
import FellowshipMinistry from "./pages/ministries/fellowship-ministry/FellowshipMinistry";
import Baptism from "./pages/membership-management/baptism/Baptism";
import './index.css'; // Global CSS

// ProtectedRoute component checks if the user is logged in
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route: Login */}
          <Route path="/login" element={<LoginScreen />} />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <RootLayout />
              </ProtectedRoute>
            }
          >
            {/* Default route to dashboard */}
            <Route index element={<Navigate to="dashboard" />} />

            {/* All protected routes go here */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="retantionRate" element={<RetentionRate />} />
            <Route path="demographics" element={<Demographics />} />
            <Route path="addMember" element={<Members />} />
            <Route path="discipleship" element={<Discipleship />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="fellowshipMinistry" element={<FellowshipMinistry />} />
            <Route path="serviceMinistry" element={<ServiceMinistry />} />
            <Route path="createMinistry" element={<CreateMinistry />} />
            <Route path="baptism" element={<Baptism />} />
          </Route>

          {/* Catch-all route: if unknown, redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

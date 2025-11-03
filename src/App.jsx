// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MobileLogin from "./components/MobileLogin";
import PCLogin from "./components/PCLogin";
import Login from "./components/Login"; // deteksi otomatis
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Komponen pembungkus untuk proteksi route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Halaman awal langsung login otomatis */}
        <Route path="/" element={<Login />} />

        {/* Manual akses login juga pakai deteksi otomatis */}
        <Route path="/login" element={<Login />} />

        {/* Login khusus perangkat */}
        <Route path="/MobileLogin" element={<MobileLogin />} />
        <Route path="/PCLogin" element={<PCLogin />} />

        {/* Dashboard admin & user hanya bisa diakses jika login */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

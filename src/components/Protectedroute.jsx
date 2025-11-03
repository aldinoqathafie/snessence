// GANTI SELURUH ISI FILE INI
import React from 'react';
import { useAuth } from '../context/AuthContext'; 
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRole = 'admin' }) {
    const { user, role, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px", color: "white" }}>
                Memeriksa otentikasi...
            </div>
        );
    }

    // Redirect ke Login jika tidak ada user
    if (!user) {
        return <Navigate to="/" replace />; 
    }

    // Tampilkan rute jika role cocok
    if (role === allowedRole) {
        return <Outlet />;
    } else {
        // Redirect ke dashboard user jika bukan admin
        return <Navigate to="/user" replace />;
    }
}
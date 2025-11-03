// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // reset state user
    navigate('/login', { replace: true }); // langsung arahkan ke Login.jsx
  };

  return (
    <button onClick={handleLogout}>
      Keluar (Logout) 🚪
    </button>
  );
};

export default LogoutButton;

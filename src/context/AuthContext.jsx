// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const getInitialState = (key, defaultValue) => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
      return defaultValue;
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(
    getInitialState('isAuthenticated', false)
  );

  const [user, setUser] = useState(
    getInitialState('user', null)
  );

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
    localStorage.setItem('user', JSON.stringify(user));
  }, [isAuthenticated, user]);

  /**
   * login sekarang mendukung:
   *  - Admin:  sn@admin.com / 123456  -> role: 'admin'
   *  - User :  sn@user.com  / 123456  -> role: 'user'
   *
   * Mengembalikan objek user saat sukses, atau null saat gagal.
   */
  const login = (email, password) => {
    // Kredensial valid
    const creds = [
      { email: 'sn@admin.com', password: '123456', role: 'admin', name: 'Super Admin' },
      { email: 'sn@user.com',  password: '123456', role: 'user',  name: 'Regular User' }
    ];

    const matched = creds.find(c => c.email === email && c.password === password);

    if (matched) {
      setIsAuthenticated(true);
      const userData = {
        email: matched.email,
        role: matched.role,
        name: matched.name
      };
      setUser(userData);
      return userData; // kembalikan detail user agar caller bisa navigasi berdasarkan role
    } else {
      alert('Login Gagal: Username atau Password salah!');
      return null;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  const contextValue = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

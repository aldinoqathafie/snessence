import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Konfigurasi mode offline / online
  const MODE_OFFLINE = !navigator.onLine; // otomatis deteksi: offline kalau gak ada internet

  // Data user lokal (untuk mode offline)
  // *** INI SUDAH DIMODIFIKASI SESUAI PERMINTAAN ANDA ***
  const localUsers = [
    { email: "admin@admin.com", password: "123456", role: "admin" }, 
    { email: "user@user.com", password: "123456", role: "user" },
  ];

  useEffect(() => {
    if (MODE_OFFLINE) {
      // Mode offline tidak butuh listener Firebase
      setLoading(false);
      return;
    }

    // Mode online (pakai Firebase)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Bisa disesuaikan untuk ambil role dari Firestore
        // Contoh: Jika Anda menggunakan admin@admin.com, set role admin.
        if (currentUser.email === "admin@admin.com") setRole("admin");
        else setRole("user");
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (MODE_OFFLINE) {
      // Login lokal
      const foundUser = localUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (foundUser) {
        // Set user dengan minimal properti yang dibutuhkan
        setUser({ email: foundUser.email, uid: 'local_uid' }); // Tambahkan uid dummy jika perlu
        setRole(foundUser.role);
        console.log(`Login Sukses (Mode Offline): ${foundUser.role} - ${foundUser.email}`);
      } else {
        // Log error di console agar lebih informatif
        console.error("Login error:", "Email atau password salah (mode offline)");
        alert("Login gagal: Email atau password salah (mode offline)");
      }
      return;
    }

    // Login Firebase (online)
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login gagal: " + error.message);
    }
  };

  const logout = async () => {
    if (MODE_OFFLINE) {
      setUser(null);
      setRole(null);
    } else {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, role, login, logout, loading, MODE_OFFLINE }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          Memuat autentikasi...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
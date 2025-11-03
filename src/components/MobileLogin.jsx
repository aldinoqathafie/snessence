// src/components/MobileLogin.jsx - PERBAIKAN LENGKAP

// Hapus import useEffect karena tidak digunakan lagi
import React from "react"; 
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import bg from "../assets/background.jpg";
import LoginForm from "./LoginForm";
import Variants from "./Variants"; // import Variants.jsx

export default function MobileLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = ({ email, password }) => {
    // Panggil fungsi login yang sekarang mengembalikan user data atau null
    const loggedInUser = login(email, password);

    // Lakukan pengalihan HANYA jika login berhasil
    if (loggedInUser) {
      if (loggedInUser.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (loggedInUser.role === "user") {
        navigate("/user", { replace: true });
      }
    }
  };

  /* BLOK useEffect ASLI DIHAPUS */
  
  return (
    // TAMBAH: overflow-hidden untuk mencegah scroll halaman utama
    <div
      className="relative flex flex-col items-center overflow-hidden min-h-screen px-4 py-6 text-white"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header / Branding */}
      <div className="absolute top-2 w-full text-center select-none">
        <h1 className="text-[1.8rem] sm:text-[2.5rem] font-extrabold leading-none drop-shadow-lg">
          SN ESSENCE
        </h1>
        <div className="bg-[#2b1d16]/90 inline-block px-3 py-0.5 mt-1 rounded-sm">
          <p className="text-yellow-500 text-lg sm:text-xl tracking-[0.25em] font-semibold">
            PREMIUM
          </p>
        </div>
        <div className="mt-1 px-2">
          <h2 className="text-base sm:text-lg font-semibold leading-tight">
            Solusi Memancing Maksimal
          </h2>
          <p className="text-xs sm:text-sm leading-snug text-gray-200">
            Nikmati kualitas essence terbaik dari SN Essence Premium, pilihan para
            pemancing profesional di seluruh Indonesia.
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="mt-auto mb-6 transform scale-50 -translate-y-40 w-full max-w-sm flex justify-center items-center">
        <LoginForm onSubmit={handleLogin} />
      </div>

      {/* Variants di bagian paling bawah */}
      {/* overscroll-x-contain tidak diperlukan lagi di sini jika kita sudah menggunakan preventDefault di Variants.jsx */}
      <div className="absolute bottom-24 w-30 max-w-md px-2 sm:px-4 pb-4 flex justify-center">
        <Variants />
      </div>
    </div>
  );
}
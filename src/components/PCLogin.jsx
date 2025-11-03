// src/components/PCLogin.jsx

// Hapus import useEffect karena tidak digunakan lagi
import React from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Variants from "./Variants";
import bg from "../assets/background.jpg";
import paketJuara from "../assets/paket_juara.png";
import LoginForm from "./LoginForm";

export default function PCLogin() {
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
    <div
      className="relative w-full h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Hero Text (kiri atas) */}
      <div className="absolute top-20 left-5 flex flex-col pl-20 pt-20 text-white z-10 max-w-[55%]">
        <div className="mb-20 select-none">
          <h1 className="text-[6rem] font-extrabold leading-none drop-shadow-lg">
            SN ESSENCE
          </h1>
          <div className="inline-block px-8 py-1 mt-2 rounded-sm bg-[#2b1d16]/80">
            <p className="text-yellow-500 text-4xl tracking-[0.35em] font-semibold">
              PREMIUM
            </p>
          </div>
        </div>

        <div className="pl-2">
          <h2 className="text-3xl font-semibold mb-1 leading-tight">
            Solusi Memancing Maksimal
          </h2>
          <p className="text-xl leading-snug text-gray-200 max-w-2xl">
            Nikmati kualitas essence terbaik dari SN Essence Premium,
            pilihan para pemancing profesional di seluruh Indonesia.
          </p>
        </div>

        {/* Variants di bawah teks */}
        <div className="mt-5">
          <Variants />
        </div>
      </div>

        {/* LoginForm (tengah layar) */}
        <div className="absolute inset-0 flex items-center justify-center z-5">
        <LoginForm onSubmit={handleLogin} />
        </div>


      {/* Gambar Paket Juara (kanan bawah, besar) */}
      <div className="absolute bottom-0 right-0 pr-12 pb-4 z-0">
        <img
          src={paketJuara}
          alt="Paket Juara"
          className="w-[550px] max-w-[55vw] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] select-none"
        />
      </div>
    </div>
  );
}
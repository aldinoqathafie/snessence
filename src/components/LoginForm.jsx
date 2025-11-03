// GANTI SELURUH ISI FILE INI
import React, { useState } from 'react';

// Terima onSubmitGoogle sebagai prop baru
export default function LoginForm({ onSubmit, onSubmitGoogle }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email === '' || password === '') {
      setError('Email dan kata sandi tidak boleh kosong.');
      return;
    }

    if (onSubmit) {
      onSubmit({ email, password });
    } else {
      console.log('Login attempt:', { email, password });
    }
  };
  
  // Handler untuk Google Login
  const handleGoogleLogin = () => {
    setError('');
    if (onSubmitGoogle) {
      onSubmitGoogle();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Kartu Login Glassmorphism */}
      <div className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl
                      shadow-lg shadow-black/30 transform transition duration-500 hover:shadow-yellow-500/30">
        
        <h2 className="text-3xl font-extrabold text-white text-center mb-6 tracking-wide">
          LOGIN
        </h2>

        {error && (
          <div className="mb-4 p-3 text-sm font-medium text-red-300 bg-red-900/50 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="anda@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/30 text-white 
                        placeholder-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 
                        backdrop-blur-sm transition duration-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/30 text-white 
                        placeholder-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 
                        backdrop-blur-sm transition duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 text-lg font-semibold text-gray-900 bg-yellow-500 
                       rounded-lg shadow-lg shadow-yellow-500/50 hover:bg-yellow-400 transition 
                       duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Masuk Sekarang
          </button>
        </form>

        {/* --- TOMBOL LOGIN WITH GOOGLE (Opsi 1) --- */}
        <div className="flex items-center my-4"> 
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">ATAU</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin} 
          className="w-full py-2 text-base font-semibold text-white bg-blue-600 
                     rounded-lg shadow-lg shadow-blue-600/50 hover:bg-blue-500 transition 
                     duration-300 ease-in-out transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFC107" d="M43.61 20.08H24V28.92H35.15C34.42 32.8 31.64 36.5 24 36.5C18.06 36.5 13.04 31.64 13.04 25.5C13.04 19.36 18.06 14.5 24 14.5C27.59 14.5 30.15 16.09 31.75 17.65L38.64 10.95C34.61 7.29 29.83 5 24 5C11.85 5 2.5 14.35 2.5 25.5C2.5 36.65 11.85 46 24 46C35.8 46 44.5 37.89 44.5 26.5C44.5 24.8 44.34 22.95 43.61 21.32V20.08Z" clipRule="evenodd"/>
              <path fill="#FF3D00" d="M6 25.5C6 27.67 6.4 29.74 7.2 31.62L16.29 25.5L7.2 19.38C6.4 21.26 6 23.33 6 25.5Z" clipRule="evenodd"/>
              <path fill="#4CAF50" d="M24 46C15.8 46 8.71 42.6 3.63 37.16L12.72 31.04C15.02 33.72 19.37 36.5 24 36.5C31.64 36.5 34.42 32.8 35.15 28.92L44.24 35.04C39.16 40.48 31.87 46 24 46Z" clipRule="evenodd"/>
              <path fill="#1976D2" d="M43.61 20.08H24V28.92H35.15C34.42 32.8 31.64 36.5 24 36.5C18.06 36.5 13.04 31.64 13.04 25.5C13.04 19.36 18.06 14.5 24 14.5C27.59 14.5 30.15 16.09 31.75 17.65L38.64 10.95C34.61 7.29 29.83 5 24 5C11.85 5 2.5 14.35 2.5 25.5C2.5 36.65 11.85 46 24 46C35.8 46 44.5 37.89 44.5 26.5C44.5 24.8 44.34 22.95 43.61 21.32V20.08Z" clipRule="evenodd"/>
          </svg>
          Google Login
        </button>
        {/* AKHIR TOMBOL GOOGLE */}

        <div className="mt-6 text-center text-sm text-white">
          <a href="#" className="font-medium text-yellow-500 hover:text-yellow-400 transition">
            Lupa Kata Sandi?
          </a>
          <p className="mt-2">
            Belum punya akun?{' '}
            <a href="#" className="font-medium text-yellow-500 hover:text-yellow-400 transition">
              Daftar di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
// src/firebase.js

// Import modul Firebase yang dibutuhkan
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// =======================
// 🔧 Konfigurasi Firebase
// =======================
// Pastikan semua variabel ini sudah ada di file .env
// dengan prefix VITE_ agar bisa diakses oleh Vite.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// =======================
// 🚀 Inisialisasi Firebase
// =======================
const app = initializeApp(firebaseConfig);

// =======================
// 📦 Modul Firebase
// =======================
const auth = getAuth(app);        // 🔐 Modul autentikasi (login, register, dll)
const db = getFirestore(app);     // 💾 Firestore database
const storage = getStorage(app);  // 🗂️ Storage (upload file/gambar)

// =======================
// 📤 Ekspor instance
// =======================
export { app, auth, db, storage };

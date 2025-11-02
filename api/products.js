// api/products.js
// Ini adalah Serverless Function (Backend) yang akan berkomunikasi dengan Redis Upstash.

import { Redis } from "@upstash/redis";

// ----------------------------------------------------
// ⭐️ KONEKSI AMAN KE REDIS
// ----------------------------------------------------
// Variabel yang digunakan diambil dari ENVIRONMENT VARIABLES di Vercel Dashboard.
// Ini memastikan token Redis Anda TIDAK PERNAH terekspos ke browser (client-side).
const redis = new Redis({
  url: process.env.VITE_UPSTASH_REDIS_REST_URL,
  token: process.env.VITE_UPSTASH_REDIS_REST_TOKEN,
});

// Kunci tunggal untuk menyimpan semua produk publik
const PUBLIC_PRODUCTS_KEY = "ace-decals:public_products"; 

// Handler utama untuk Serverless Function
export default async function handler(req, res) {
    // ⭐️ PENTING: Response header untuk mengizinkan CORS jika perlu, tapi umumnya tidak perlu di Vercel jika domain sama.
    // res.setHeader('Access-Control-Allow-Origin', '*'); 

    try {
        // ===================================
        // METHOD GET: UNTUK USER DASHBOARD (BACA DATA)
        // ===================================
        if (req.method === 'GET') {
            console.log("[API] Permintaan GET: Membaca data produk...");
            
            // Ambil data dari Redis menggunakan kunci tunggal
            const storedData = await redis.get(PUBLIC_PRODUCTS_KEY);
            
            // Konversi dari string JSON yang disimpan di Redis menjadi objek JavaScript
            const products = storedData ? JSON.parse(storedData) : [];
            
            return res.status(200).json(products);
        }

        // ===================================
        // METHOD POST: UNTUK ADMIN DASHBOARD (TULIS DATA)
        // ===================================
        if (req.method === 'POST') {
            console.log("[API] Permintaan POST: Menyimpan data produk...");
            
            // Data dikirim dari frontend sebagai JSON body
            const { products } = req.body;
            
            if (!Array.isArray(products)) {
                return res.status(400).json({ message: 'Input harus berupa array produk.' });
            }

            // Simpan seluruh array produk ke Redis. Kunci lama akan ditimpa (overwritten).
            await redis.set(PUBLIC_PRODUCTS_KEY, JSON.stringify(products));
            
            return res.status(200).json({ 
                message: 'Data produk berhasil disimpan di Redis.',
                count: products.length
            });
        }

        // ===================================
        // METHOD LAIN
        // ===================================
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);

    } catch (error) {
        console.error("Redis Serverless Error:", error);
        // Penting: Jangan kirim detail error sensitif (seperti token Redis) ke frontend
        return res.status(500).json({ message: 'Internal server error. Cek logs Vercel untuk detail koneksi Redis.' });
    }
}
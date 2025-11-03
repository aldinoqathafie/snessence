import React, { useState } from "react";
import { ShoppingCart, User, LogOut, Bell, Search } from "lucide-react";

export default function UserDashboardPreview() {
  const [searchTerm, setSearchTerm] = useState("");
  const products = [
    { id: 1, name: "Sticker Premium", price: "Rp 25.000", img: "/img/default.jpg" },
    { id: 2, name: "Decal Motif Sport", price: "Rp 40.000", img: "/img/default.jpg" },
    { id: 3, name: "Essence Booster", price: "Rp 35.000", img: "/img/default.jpg" },
  ];

  const filteredItems = products.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-sans bg-gray-50 text-gray-800 min-h-screen relative">
      <header className="bg-black text-white py-4 px-6 md:px-10 flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold tracking-widest">ACE DECALS</h1>

        <div className="flex items-center bg-white rounded-full overflow-hidden w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 outline-none"
          />
          <button className="bg-black text-white px-4 py-2">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <ShoppingCart className="w-5 h-5 hover:text-gray-400 cursor-pointer" />
          <Bell className="w-5 h-5 hover:text-yellow-400 cursor-pointer" />
          <User className="w-5 h-5 hover:text-gray-400 cursor-pointer" />
          <button className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <section className="relative bg-black text-white">
        <img
          src="https://via.placeholder.com/1200x380?text=Hero+Image"
          alt="Hero"
          className="w-full opacity-50 object-cover h-[380px]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl font-semibold mb-2">SN ESSENCE PREMIUM</h2>
          <p className="text-2xl font-bold mb-4">SOLUSI MEMANCING BAHAGIA</p>
        </div>
      </section>

      <section className="py-12 px-6 md:px-10">
        <h3 className="text-2xl font-semibold text-center mb-6">OUR PRODUCTS</h3>
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-600">Produk tidak ditemukan.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow rounded-xl p-4 flex flex-col items-center hover:shadow-lg transition"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-32 object-contain mb-3"
                />
                <p className="text-sm text-gray-700 text-center">{item.name}</p>
                <p className="font-semibold mt-2">{item.price}</p>
                <div className="flex gap-2 mt-3">
                  <button className="bg-gray-200 text-black px-3 py-1 text-sm rounded hover:bg-gray-300">
                    + Keranjang
                  </button>
                  <button className="bg-black text-white px-4 py-1 text-sm rounded hover:bg-gray-800">
                    Beli
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-black text-white text-center py-6 mt-10">
        <p className="text-sm">© 2025 AceDecals. All Rights Reserved.</p>
      </footer>

      {/* Floating Checkout Balloon */}
      <div className="fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-800 transition">
        Checkout 🛒
      </div>
    </div>
  );
}

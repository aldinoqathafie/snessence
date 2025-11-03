import React, { useEffect, useState, useRef } from "react";
import { ShoppingCart, Heart, User, Search, LogOut, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(null);
  const previousLengthRef = useRef(0);
  const unsubRef = useRef(null);

  // Real-time fetch with onSnapshot (keuntungan: update otomatis)
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Handle new product notification
      if (list.length > previousLengthRef.current && previousLengthRef.current > 0) {
        const latest = list[list.length - 1];
        setNewProduct(latest);
        setTimeout(() => setNewProduct(null), 4000);
      }
      previousLengthRef.current = list.length;
      setProducts(list);
    }, async (err) => {
      console.error("Realtime error:", err);
      // Fallback: try a one-time getDocs
      try {
        const snap = await getDocs(collection(db, "products"));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setProducts(list);
      } catch (e) {
        console.error("Fallback load failed:", e);
      }
    });

    unsubRef.current = unsub;
    return () => { if (unsubRef.current) unsubRef.current(); };
  }, []);

  const filteredItems = products.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    alert("Anda telah logout!");
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    navigate(isMobile ? "/MobileLogin" : "/PCLogin");
  };

  return (
    <div className="font-sans bg-gray-50 text-gray-800 min-h-screen relative">
      {newProduct && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          <strong>Produk baru!</strong>
          <p>{newProduct.name}</p>
        </div>
      )}

      <header className="bg-black text-white py-4 px-6 md:px-10 flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold tracking-widest">ACE DECALS</h1>

        <div className="flex items-center bg-white rounded-full overflow-hidden w-full sm:w-80">
          <input type="text" placeholder="Cari produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 text-gray-700 outline-none" />
          <button className="bg-black text-white px-4 py-2"><SearchIcon /></button>
        </div>

        <div className="flex items-center space-x-4">
          <Heart className="w-5 h-5 hover:text-gray-400 cursor-pointer" />
          <ShoppingCart className="w-5 h-5 hover:text-gray-400 cursor-pointer" />
          <Bell className="w-5 h-5 hover:text-yellow-400 cursor-pointer" />
          <User className="w-5 h-5 hover:text-gray-400 cursor-pointer" />
          <button onClick={handleLogout} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <section className="relative bg-black text-white">
        <img src="/assets/hero.jpg" alt="Hero" className="w-full opacity-50 object-cover h-[380px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl font-semibold mb-2">SN ESSENCE PREMIUM</h2>
          <p className="text-2xl font-bold mb-4">SOLUSI MEMANCING BAHAGIA</p>
          <button className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-200">SHOP NOW</button>
        </div>
      </section>

      <section className="py-12 px-6 md:px-10">
        <h3 className="text-2xl font-semibold text-center mb-6">OUR PRODUCTS</h3>
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-600">Produk tidak ditemukan.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white shadow rounded-xl p-4 flex flex-col items-center hover:shadow-lg transition">
                <img src={item.img || "/img/default.jpg"} alt={item.name} className="h-32 object-contain mb-3" onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150?text=AceDecals"; }} />
                <p className="text-sm text-gray-700 text-center">{item.name}</p>
                <p className="font-semibold mt-2">{item.price}</p>
                <button className="mt-3 bg-black text-white px-4 py-1 text-sm rounded hover:bg-gray-800">ADD TO CART</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-black text-white text-center py-6 mt-10">
        <p className="text-sm">© 2025 AceDecals. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// small Search icon component to avoid missing import
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17.65 11a6.65 6.65 0 11-13.3 0 6.65 6.65 0 0113.3 0z" />
    </svg>
  );
}

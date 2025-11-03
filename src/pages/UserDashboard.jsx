// src/pages/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  User,
  LogOut,
  Bell,
  Search,
  Plus,
  Minus,
  X,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// =================================================================
// 🟢 Endpoint API Wilayah Indonesia (API Publik, tidak memerlukan key)
// =================================================================
const API_URL = {
  PROVINCE: 'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json',
  CITY: (provinceId) => `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`,
  DISTRICT: (cityId) => `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cityId}.json`,
  SUBDISTRICT: (districtId) => `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`,
};

export default function UserDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [payments, setPayments] = useState([]);
  
  // State untuk form alamat dan cascading dropdown
  const [address, setAddress] = useState({
    fullAddress: "", 
    provinceId: "", 
    provinceName: "", 
    cityId: "", 
    cityName: "",
    districtId: "", 
    districtName: "",
    subdistrictId: "", 
    subdistrictName: "",
    postalCode: "", 
    paymentMethod: "",
  });

  // State untuk menampung opsi dropdown dari API
  const [provincesOptions, setProvincesOptions] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);
  const [districtsOptions, setDistrictsOptions] = useState([]);
  const [subdistrictsOptions, setSubdistrictsOptions] = useState([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);


  // --- LOGIC: Fetch Data Geografis (Real Indonesia) ---

  // 1. Fetch Provinsi (Hanya sekali saat mount)
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingLocation(true);
      try {
        const response = await fetch(API_URL.PROVINCE);
        const data = await response.json();
        setProvincesOptions(data);
      } catch (error) {
        console.error("Gagal mengambil data Provinsi:", error);
      } finally {
        setIsLoadingLocation(false);
      }
    };
    fetchProvinces();
  }, []);

  // 2. Fetch Kota/Kabupaten (saat provinceId berubah)
  useEffect(() => {
    if (address.provinceId) {
      const fetchCities = async () => {
        setIsLoadingLocation(true);
        try {
          const response = await fetch(API_URL.CITY(address.provinceId));
          const data = await response.json();
          setCitiesOptions(data);
          setDistrictsOptions([]);
          setSubdistrictsOptions([]);
        } catch (error) {
          console.error("Gagal mengambil data Kota:", error);
        } finally {
          setIsLoadingLocation(false);
        }
      };
      fetchCities();
    } else {
      setCitiesOptions([]);
    }
  }, [address.provinceId]);

  // 3. Fetch Kecamatan (saat cityId berubah)
  useEffect(() => {
    if (address.cityId) {
      const fetchDistricts = async () => {
        setIsLoadingLocation(true);
        try {
          const response = await fetch(API_URL.DISTRICT(address.cityId));
          const data = await response.json();
          setDistrictsOptions(data);
          setSubdistrictsOptions([]);
        } catch (error) {
          console.error("Gagal mengambil data Kecamatan:", error);
        } finally {
          setIsLoadingLocation(false);
        }
      };
      fetchDistricts();
    } else {
      setDistrictsOptions([]);
    }
  }, [address.cityId]);

  // 4. Fetch Kelurahan (saat districtId berubah)
  useEffect(() => {
    if (address.districtId) {
      const fetchSubdistricts = async () => {
        setIsLoadingLocation(true);
        try {
          const response = await fetch(API_URL.SUBDISTRICT(address.districtId));
          const data = await response.json();
          setSubdistrictsOptions(data);
        } catch (error) {
          console.error("Gagal mengambil data Kelurahan:", error);
        } finally {
          setIsLoadingLocation(false);
        }
      };
      fetchSubdistricts();
    } else {
      setSubdistrictsOptions([]);
    }
  }, [address.districtId]);


  // --- LOGIC: Handle Cascading Dropdown (Updater State) ---

  const handleProvinceChange = (e) => {
      const selectedId = e.target.value;
      const selectedName = provincesOptions.find(p => String(p.id) === selectedId)?.name || "";
      setAddress({ 
          ...address, 
          provinceId: selectedId, 
          provinceName: selectedName,
          cityId: "", cityName: "", districtId: "", districtName: "", subdistrictId: "", subdistrictName: "", postalCode: "", // Reset downstream
      });
  };
  
  const handleCityChange = (e) => {
      const selectedId = e.target.value;
      const selectedName = citiesOptions.find(c => String(c.id) === selectedId)?.name || "";
      setAddress({ 
          ...address, 
          cityId: selectedId, 
          cityName: selectedName,
          districtId: "", districtName: "", subdistrictId: "", subdistrictName: "", postalCode: "", // Reset downstream
      });
  };
  
  const handleDistrictChange = (e) => {
      const selectedId = e.target.value;
      const selectedName = districtsOptions.find(d => String(d.id) === selectedId)?.name || "";
      setAddress({ 
          ...address, 
          districtId: selectedId, 
          districtName: selectedName,
          subdistrictId: "", subdistrictName: "", postalCode: "", // Reset downstream
      });
  };
  
  const handleSubdistrictChange = (e) => {
      const selectedId = e.target.value;
      const selectedName = subdistrictsOptions.find(s => String(s.id) === selectedId)?.name || "";
      // Kode Pos biasanya tidak tersedia di API Kelurahan publik ini, 
      // namun kita menyimpan nama kelurahan yang dipilih.
      setAddress({ 
          ...address, 
          subdistrictId: selectedId, 
          subdistrictName: selectedName 
      });
  };

  // --- LOGIC: Data Fetching (Firebase - Sama seperti sebelumnya) ---

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "payments"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(list);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.email) return;
    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", user.email)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.status === "paid" && cart.length > 0) {
          setCart([]);
        }
      });
    });
    return () => unsubscribe();
  }, [user, cart]);

  // --- LOGIC: Fungsi Lain (Sama seperti sebelumnya) ---

  const filteredItems = products.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const addToCart = () => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === selectedProduct.id);
      if (existing) {
        return prev.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...selectedProduct, quantity }];
      }
    });
    closeModal();
  };
  
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementCartItem = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementCartItem = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };


  const totalPrice = cart.reduce((sum, item) => {
    const price = parseInt(item.price ? item.price.replace(/[^0-9]/g, "") : 0) || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    // Validasi dasar
    if (!address.fullAddress || !address.provinceId || !address.cityId || !address.districtId || !address.subdistrictId || !address.paymentMethod) {
      alert("Harap lengkapi semua detail alamat (hingga Kelurahan) dan pilih metode pembayaran.");
      return;
    }
    
    try {
      await addDoc(collection(db, "orders"), {
        userName: user?.name || "Pengguna",
        userEmail: user?.email || "unknown",
        // Menyimpan Nama Wilayah ke Firebase
        addressDetail: {
          fullAddress: address.fullAddress,
          province: address.provinceName,
          city: address.cityName,
          district: address.districtName,
          subdistrict: address.subdistrictName,
          postalCode: address.postalCode,
        },
        paymentMethod: address.paymentMethod,
        items: cart,
        totalPrice,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      alert("Pesanan berhasil dibuat! Tunggu konfirmasi pembayaran.");
      setShowCheckout(false);
      setShowCart(false);
      setCart([]); 
      // Reset alamat setelah checkout sukses
      setAddress({
        fullAddress: "", provinceId: "", provinceName: "", cityId: "", cityName: "", 
        districtId: "", districtName: "", subdistrictId: "", subdistrictName: "", 
        postalCode: "", paymentMethod: ""
      }); 
    } catch (error) {
      console.error("Gagal checkout:", error);
      alert("Terjadi kesalahan saat memproses pesanan.");
    }
  };
  
  // --- Tampilan Komponen ---

  return (
    <div className="font-sans bg-gray-50 text-gray-800 min-h-screen relative">
      {/* Header */}
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

        <div className="flex items-center space-x-4 relative">
          <div
            className="relative cursor-pointer"
            onClick={() => setShowCart((prev) => !prev)}
          >
            <ShoppingCart className="w-5 h-5 hover:text-gray-400" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
          <Bell className="w-5 h-5 hover:text-yellow-400 cursor-pointer" />
          <User className="w-5 h-5 hover:text-gray-400 cursor-pointer" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>
      
      {/* Hero Section */}
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

      {/* Products Section */}
      <section className="py-12 px-6 md:px-10">
        <h3 className="text-2xl font-semibold text-center mb-6">OUR PRODUCTS</h3>
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-600">Produk tidak ditemukan.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => openProductModal(item)}
                className="bg-white shadow rounded-xl p-4 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition transform cursor-pointer"
              >
                <img
                  src={item.img || "https://placehold.co/150x150?text=No+Image"}
                  alt={item.name}
                  className="h-32 object-contain mb-3"
                />
                <p className="text-sm text-gray-700 text-center">{item.name}</p>
                <p className="font-semibold mt-2">{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
          {/* ... (Kode Product Modal sama seperti sebelumnya) ... */}
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative transform scale-100 animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center text-center">
              <img
                src={selectedProduct.img || "https://placehold.co/300x300?text=No+Image"}
                alt={selectedProduct.name}
                className="h-48 object-contain mb-4 transition-transform duration-300 hover:scale-105"
              />
              <h3 className="text-2xl font-bold mb-2">{selectedProduct.name}</h3>
              <p className="text-gray-700 mb-3 font-medium">{selectedProduct.price}</p>
              <p className="text-sm text-gray-600 mb-4">
                {selectedProduct.description || "Belum ada deskripsi untuk produk ini."}
              </p>

              <div className="flex items-center gap-4 mb-5">
                <button
                  onClick={decrement}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold text-lg">{quantity}</span>
                <button
                  onClick={increment}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={addToCart}
                className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-lg hover:bg-yellow-400 transition"
              >
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 flex justify-end z-[9998]">
          {/* ... (Kode Cart Modal sama seperti sebelumnya) ... */}
          <div className="bg-white w-full sm:w-96 h-full shadow-2xl p-6 relative animate-slideInRight">
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold mb-4">Keranjang Anda</h3>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm">Belum ada produk di keranjang.</p>
            ) : (
              <>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.img || "https://placehold.co/50x50?text=Img"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => decrementCartItem(item.id)}
                              className="bg-gray-200 rounded px-2 hover:bg-gray-300"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => incrementCartItem(item.id)}
                              className="bg-gray-200 rounded px-2 hover:bg-gray-300"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t pt-4">
                  <p className="font-semibold text-gray-800 mb-2">
                    Total: <span className="text-yellow-600">Rp {totalPrice.toLocaleString()}</span>
                  </p>
                  <button 
                    onClick={() => {
                        setShowCart(false); 
                        setShowCheckout(true); 
                    }}
                    className="w-full bg-yellow-500 text-black rounded-lg py-2 font-semibold hover:bg-yellow-400"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Floating Checkout Balloon */}
      {cart.length > 0 && !showCart && !showCheckout && ( 
        <div
          className="fixed bottom-6 right-6 bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-yellow-400 hover:scale-105 transition-all duration-300 z-[10000]"
          onClick={() => setShowCheckout(true)}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Checkout ({cart.length})</span>
        </div>
      )}

      {/* Checkout Form Modal (Menggunakan Form Manual dan API Wilayah) */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10001] p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full relative animate-fadeIn shadow-2xl">
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Detail Checkout & Alamat</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* === KOLOM KIRI: FORM ALAMAT CASCADING & PEMBAYARAN === */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-600">1. Alamat Pengiriman</h3>
                
                {/* Alamat Lengkap (Textarea) */}
                <textarea 
                    placeholder="Alamat Lengkap (Jalan, Nomor Rumah, Patokan) *"
                    value={address.fullAddress}
                    onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400 resize-none h-20"
                />

                {/* Indikator Loading */}
                {isLoadingLocation && (
                    <div className="text-sm text-blue-500 flex items-center gap-2">
                       <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memuat data wilayah...
                    </div>
                )}


                {/* Provinsi (Cascading Level 1) */}
                <select
                    value={address.provinceId}
                    onChange={handleProvinceChange}
                    disabled={isLoadingLocation}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                >
                    <option value="">Pilih Provinsi *</option>
                    {provincesOptions.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                            {prov.name}
                        </option>
                    ))}
                </select>

                {/* Kota/Kabupaten (Cascading Level 2) */}
                <select
                    value={address.cityId}
                    onChange={handleCityChange}
                    disabled={!address.provinceId || isLoadingLocation}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                >
                    <option value="">Pilih Kota/Kabupaten *</option>
                    {citiesOptions.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name}
                        </option>
                    ))}
                </select>

                {/* Kecamatan (Cascading Level 3) */}
                <select
                    value={address.districtId}
                    onChange={handleDistrictChange}
                    disabled={!address.cityId || isLoadingLocation}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                >
                    <option value="">Pilih Kecamatan *</option>
                    {districtsOptions.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                            {dist.name}
                        </option>
                    ))}
                </select>
                
                {/* Kelurahan (Cascading Level 4) */}
                <select
                    value={address.subdistrictId}
                    onChange={handleSubdistrictChange}
                    disabled={!address.districtId || isLoadingLocation}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                >
                    <option value="">Pilih Kelurahan *</option>
                    {subdistrictsOptions.map((subdist) => (
                        <option key={subdist.id} value={subdist.id}>
                            {subdist.name}
                        </option>
                    ))}
                </select>

                {/* Kode Pos (Manual) */}
                <input
                    type="text"
                    placeholder="Kode Pos"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400"
                />

                {/* Metode Pembayaran (Menggunakan Radio Buttons) */}
                <h3 className="text-lg font-semibold text-yellow-600 pt-2">2. Metode Pembayaran</h3>
                <div className="border border-gray-300 p-3 rounded-lg space-y-2 bg-gray-50">
                    {payments.map((p) => (
                        <label key={p.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={p.name}
                                checked={address.paymentMethod === p.name}
                                onChange={(e) =>
                                    setAddress({ ...address, paymentMethod: e.target.value })
                                }
                                className="form-radio text-yellow-500 focus:ring-yellow-400"
                            />
                            <span className="text-sm font-medium">{p.name}</span>
                        </label>
                    ))}
                </div>

                <button
                    onClick={handleCheckout}
                    className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-600 transition shadow-lg mt-4"
                >
                    Konfirmasi Pesanan (Rp {totalPrice.toLocaleString()})
                </button>
              </div>


              {/* === KOLOM KANAN: RINGKASAN PESANAN DENGAN GAMBAR === */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">3. Rincian Pesanan</h3>
                <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                    {cart.map((item) => {
                        const price = parseInt(item.price ? item.price.replace(/[^0-9]/g, "") : 0) || 0;
                        const subtotal = price * item.quantity;
                        return (
                            <div 
                                key={item.id} 
                                className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm"
                            >
                                {/* Gambar Item */}
                                <img
                                    src={item.img || "https://placehold.co/60x60?text=Img"}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                />
                                <div className="flex-grow">
                                    {/* Nama Item */}
                                    <p className="font-semibold text-sm text-gray-800 line-clamp-2">{item.name}</p>
                                    
                                    {/* Jumlah & Subtotal Item */}
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-sm font-medium text-yellow-600">
                                            {item.quantity} x
                                        </span>
                                        <span className="font-bold text-sm text-red-600">
                                            Rp {subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Total Harga Final */}
                <div className="mt-4 pt-3 border-t border-gray-300">
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Keseluruhan:</span>
                        <span className="text-2xl text-red-600">Rp {totalPrice.toLocaleString()}</span>
                    </div>
                </div>

              </div>
            </div>
            
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="bg-black text-white text-center py-6 mt-10">
        <p className="text-sm">© 2025 AceDecals. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
import React, { useEffect, useState, useCallback } from "react";
import {
    LogOut,
    Package,
    Users,
    ShoppingBag,
    BarChart3,
    Settings,
    Plus,
    X,
    Edit,
    Trash2,
    AlertTriangle,
    CheckCircle,
    Zap,
    DollarSign,
    Truck,
    Monitor,
    LayoutDashboard,
} from "lucide-react";

// Hapus semua impor Firebase SDK:
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
// import { 
//     getFirestore, 
//     collection, 
//     query, 
//     onSnapshot, 
//     doc, 
//     addDoc, 
//     updateDoc, 
//     deleteDoc, 
//     serverTimestamp 
// } from 'firebase/firestore';


// --- KOMPONEN PLACEHOLDER (Menggantikan fail luar yang tidak dapat diselesaikan) ---
const PlaceholderComponent = ({ title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-yellow-400">
        <h3 className="text-2xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <div className="mt-4 p-3 bg-gray-50 border rounded-lg text-sm font-mono">
            {title} sedang dipaparkan di sini.
        </div>
    </div>
);
const GrafikPenjualan = () => <PlaceholderComponent title="Grafik Penjualan" description="Analisis visual data penjualan." />;
const LaporanPenjualan = () => <PlaceholderComponent title="Laporan Penjualan" description="Ringkasan transaksi dan hasil jualan." />;
const LaporanKeuangan = () => <PlaceholderComponent title="Laporan Keuangan" description="Status kewangan dan aliran tunai." />;
const LaporanInventaris = () => <PlaceholderComponent title="Laporan Inventaris" description="Ringkasan nilai dan kuantiti inventori." />;
const ProdukTerlaris = () => <PlaceholderComponent title="Produk Terlaris" description="Daftar produk dengan penjualan tertinggi." />;
const StokKritis = () => <PlaceholderComponent title="Stok Kritis" description="Senarai produk yang hampir kehabisan stok." />;
const TambahProduk = () => <PlaceholderComponent title="Tambah Produk" description="Formulir penambahan produk (Dikelola oleh modal utama)." />;
const RencanaPesanan = () => <PlaceholderComponent title="Rencana Pesanan" description="Perancangan pesanan di masa hadapan." />;
const PesananBaru = () => <PlaceholderComponent title="Pesanan Baru" description="Senarai pesanan yang perlu diproses segera." />;
const ProsesPesanan = () => <PlaceholderComponent title="Proses Pesanan" description="Pesanan yang sedang dalam proses pengiriman." />;
const LacakPesanan = () => <PlaceholderComponent title="Lacak Pesanan" description="Sistem pelacakan status pesanan pelanggan." />;
const ManajemenUser = () => <PlaceholderComponent title="Manajemen Pengguna" description="Mengelola akses dan peranan pengguna admin/staf." />;
const LaporanKinerja = () => <PlaceholderComponent title="Laporan Kinerja" description="Evaluasi prestasi kerja pengguna." />;
const PengaturanToko = () => <PlaceholderComponent title="Pengaturan Toko" description="Mengkonfigurasi maklumat dan operasi kedai." />;
const PengaturanPembayaran = () => <PlaceholderComponent title="Pembayaran" description="Mengurus kaedah pembayaran dan integrasi." />;
const Integrasi = () => <PlaceholderComponent title="Integrasi Pihak Ketiga" description="Pengaturan untuk perkhidmatan luaran seperti logistik/API." />;


// === DEFINISI STRUKTUR MENU LENGKAP ===
const menuStructure = [
    // ... (Struktur menu sama seperti sebelumnya)
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 />,
      defaultSub: 'ringkasan',
      subMenus: [
        { key: 'ringkasan', label: 'Ringkasan', icon: <Monitor /> },
        { key: 'penjualan', label: 'Laporan Penjualan', icon: <DollarSign /> },
        { key: 'keuangan', label: 'Laporan Keuangan', icon: <BarChart3 /> },
        { key: 'inventaris', label: 'Laporan Inventaris', icon: <Package /> },
      ],
    },
    {
      key: 'products',
      label: 'Produk',
      icon: <Package />,
      defaultSub: 'kelola',
      subMenus: [
        { key: 'kelola', label: 'Kelola Stok', icon: <Package /> },
        { key: 'terlaris', label: 'Produk Terlaris', icon: <Zap /> },
        { key: 'stok_kritis', label: 'Stok Kritis', icon: <AlertTriangle /> },
      ],
    },
    {
      key: 'orders',
      label: 'Pesanan',
      icon: <ShoppingBag />,
      defaultSub: 'baru',
      subMenus: [
        { key: 'baru', label: 'Pesanan Baru', icon: <Plus /> },
        { key: 'proses', label: 'Dalam Proses', icon: <Edit /> },
        { key: 'lacak', label: 'Lacak Pesanan', icon: <Truck /> },
        { key: 'rencana', label: 'Rencana Pesanan', icon: <CheckCircle /> },
      ],
    },
    {
      key: 'users',
      label: 'Pengguna',
      icon: <Users />,
      defaultSub: 'manajemen',
      subMenus: [
        { key: 'manajemen', label: 'Manajemen Pengguna', icon: <Users /> },
        { key: 'kinerja', label: 'Laporan Kinerja', icon: <LayoutDashboard /> },
      ],
    },
    {
      key: 'settings',
      label: 'Pengaturan',
      icon: <Settings />,
      defaultSub: 'toko',
      subMenus: [
        { key: 'toko', label: 'Pengaturan Toko', icon: <Settings /> },
        { key: 'pembayaran', label: 'Pembayaran', icon: <DollarSign /> },
        { key: 'integrasi', label: 'Integrasi', icon: <CheckCircle /> },
      ],
    },
];


// ** SIMULASI FUNGSI REDIS CLIENT (Di dunia nyata, ini akan menjadi PANGGILAN API) **
// Kunci Redis akan distrukturkan seperti 'products:userId'
const getRedisKey = (userId) => {
    // Gunakan global variable yang sama, tetapi lebih fokus ke userId
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    return `products:${appId}:${userId}`;
};

// Mengambil data produk dari 'Redis' (simulasi menggunakan localStorage)
const fetchProducts = (userId) => {
    if (!userId) return [];
    const key = getRedisKey(userId);
    try {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : [];
    } catch (e) {
        console.error("Error fetching from simulated Redis (localStorage):", e);
        return [];
    }
};

// Menyimpan data produk ke 'Redis' (simulasi menggunakan localStorage)
const saveProducts = (userId, products) => {
    if (!userId) return;
    const key = getRedisKey(userId);
    try {
        localStorage.setItem(key, JSON.stringify(products));
    } catch (e) {
        console.error("Error saving to simulated Redis (localStorage):", e);
    }
};

// Fungsi untuk mendapatkan ID unik baru (mirip doc.id di Firestore)
const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);
// ********************************************************************************


// === KOMPONEN UTAMA AdminDashboard (Dinamakan semula kepada App) ===
export default function App() {
    // State Navigasi
    const [activeView, setActiveView] = useState({ main: 'products', sub: 'kelola' }); 

    // State Autentikasi/Simulasi
    // Menghapus state db dan auth
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false); // Tetap dipertahankan untuk memuatkan

    // State Data & UI
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: "", price: "", stock: "", img: "" });

    // State Notifikasi/Konfirmasi
    const [notification, setNotification] = useState({ message: '', type: 'info', show: false });
    const [confirmAction, setConfirmAction] = useState(null); 
    const [confirmId, setConfirmId] = useState(null); 


    // --- INISIALISASI & AUTENTIKASI SIMULASI (Menggantikan Firebase) ---
    // Di aplikasi Redis Vercel sebenarnya, Anda mungkin akan menggunakan session/cookie untuk userId
    useEffect(() => {
        try {
            // SIMULASI AUTENTIKASI: Buat ID anonim sebagai ID pengguna untuk Redis Key
            const existingUserId = localStorage.getItem('sn_essence_userId');
            if (existingUserId) {
                setUserId(existingUserId);
            } else {
                const newUserId = crypto.randomUUID(); 
                setUserId(newUserId);
                localStorage.setItem('sn_essence_userId', newUserId);
            }
            setIsAuthReady(true);
            
        } catch(error) {
            console.error("Simulated Auth Failed:", error);
            setIsAuthReady(true); // Tetap set ke true agar UI tidak stuck
        }
    }, []);

    // --- DATA FETCHING (Redis/Simulasi) ---
    const loadProducts = useCallback(() => {
        if (!userId) return;
        
        // Dalam aplikasi nyata, ini adalah PANGGILAN API untuk GET key: `products:appId:userId` dari Redis
        const productList = fetchProducts(userId); 
        setProducts(productList.sort((a, b) => (a.name || "").localeCompare(b.name || "")));
        
        // Catatan: Redis TIDAK memiliki listener real-time seperti onSnapshot.
        // Anda perlu mengimplementasikan polling (pembaruan berkala) atau WebSockets
        // jika Anda membutuhkan pembaruan real-time dalam arsitektur Redis.
    }, [userId]);

    useEffect(() => {
        if (userId) {
            loadProducts();
            
            // SIMULASI POLLING: Memuat ulang data setiap 10 detik (opsional, untuk menyimulasikan "real-time")
            const interval = setInterval(loadProducts, 10000); 
            return () => clearInterval(interval); // Cleanup interval
        }
    }, [userId, loadProducts]);


    // --- HANDLER UI & LOGIC ---

    // Handler Notifikasi
    const handleShowNotification = (message, type = 'info') => {
        setNotification({ message, type, show: true });
        setTimeout(() => setNotification({ message: '', type: 'info', show: false }), 3000);
    };
    
    // Handler untuk mengubah menu utama DAN sub-menu
    const handleMenuChange = useCallback((mainKey, defaultSubKey) => {
        setActiveView({ main: mainKey, sub: defaultSubKey });
    }, []);

    // Logout Simulasi
    const handleLogout = () => {
        // Hapus simulasi userId untuk logout
        localStorage.removeItem('sn_essence_userId');
        setUserId(null);
        setProducts([]);
        handleShowNotification("Admin telah logout! Untuk simulasi, silakan refresh halaman.", "info");
    };

    // Tambah / Edit produk (Redis/Simulasi)
    const handleSave = async () => {
        if (!userId) return handleShowNotification("Sila tunggu otentikasi selesai.", "warning");

        if (!formData.name || !formData.price || !formData.stock) {
            handleShowNotification("Lengkapi semua field!", "warning");
            return;
        }
        
        try {
            // PANGGILAN API ke server yang menggunakan Redis SET/HSET untuk menyimpan
            
            const currentProducts = fetchProducts(userId);

            if (editingProduct) {
                // Update produk sedia ada
                const productIndex = currentProducts.findIndex(p => p.id === editingProduct.id);
                if (productIndex > -1) {
                    currentProducts[productIndex] = {
                        ...editingProduct, // Pertahankan ID asli
                        name: formData.name,
                        price: formData.price,
                        stock: parseInt(formData.stock) || 0,
                        img: formData.img || "",
                        updatedAt: new Date().toISOString() // Simulasikan serverTimestamp
                    };
                }
                handleShowNotification("Produk diperbarui!", "success");
            } else {
                // Tambah produk baharu
                const newProduct = {
                    id: generateUniqueId(), // ID unik baru
                    name: formData.name,
                    price: formData.price,
                    stock: parseInt(formData.stock) || 0,
                    img: formData.img || "",
                    createdAt: new Date().toISOString() // Simulasikan serverTimestamp
                };
                currentProducts.push(newProduct);
                handleShowNotification("Produk ditambahkan!", "success");
            }
            
            saveProducts(userId, currentProducts); // Simpan ke 'Redis'
            loadProducts(); // Muat ulang data
            setShowModal(false);

        } catch (err) {
            console.error("Gagal menyimpan produk:", err);
            handleShowNotification("Gagal menyimpan produk. Sila cuba lagi.", "error");
        }
    };

    // Handler Konfirmasi Hapus
    const confirmDelete = (id) => {
        setConfirmId(id);
        setConfirmAction(() => async () => {
            if (!userId) return handleShowNotification("Sila tunggu otentikasi selesai.", "warning");
            
            try {
                // PANGGILAN API ke server yang menggunakan Redis SET/HDEL untuk menghapus
                let currentProducts = fetchProducts(userId);
                
                const productIndex = currentProducts.findIndex(p => p.id === id);
                if (productIndex > -1) {
                    currentProducts.splice(productIndex, 1);
                }

                saveProducts(userId, currentProducts); // Simpan ke 'Redis'
                loadProducts(); // Muat ulang data
                
                handleShowNotification("Produk berhasil dihapus!", "success");

            } catch (err) {
                console.error("Gagal menghapus produk:", err);
                handleShowNotification("Gagal menghapus produk. Sila cuba lagi.", "error");
            }
            
            setConfirmAction(null); // Tutup modal konfirmasi
            setConfirmId(null);
        });
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ 
                name: product.name || "", 
                price: product.price || "", 
                stock: String(product.stock || 0), 
                img: product.img || "" 
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: "", price: "", stock: "", img: "" });
        }
        setShowModal(true);
    };

    // Komponen yang berisi logic Produk (Kelola Produk)
    const ProductManagementView = () => {
        if (!isAuthReady) {
            return <p className="text-center p-8 text-gray-500">Memuatkan data pengguna...</p>;
        }
        
        return (
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold text-gray-900 hidden">Senarai Produk</h2>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-black text-yellow-400 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition"
                    >
                        <Plus className="w-4 h-4" /> Tambah Produk
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white shadow-xl rounded-xl overflow-hidden">
                        <thead className="bg-black text-yellow-400">
                            <tr>
                                <th className="py-3 px-4 text-left w-1/4">Nama Produk</th>
                                <th className="py-3 px-4 text-left w-1/4">Harga</th>
                                <th className="py-3 px-4 text-left w-1/4">Stok</th>
                                <th className="py-3 px-4 text-left w-1/4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-500">Tiada produk ditemui. Sila tambah yang baharu.</td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="border-b border-gray-200 hover:bg-yellow-50/50 transition duration-150"
                                    >
                                        <td className="py-3 px-4 font-medium flex items-center gap-3">
                                            {p.img ? (
                                                <img 
                                                    src={p.img} 
                                                    alt={p.name} 
                                                    className="w-10 h-10 object-cover rounded-md"
                                                    // Fallback untuk gambar
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/f3f4f6/a1a1aa?text=NoImg"; }}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-600"><Package className="w-5 h-5"/></div>
                                            )}
                                            {p.name}
                                        </td>
                                        <td className="py-3 px-4 font-mono">{p.price}</td>
                                        <td className="py-3 px-4 font-mono text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {p.stock}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 space-x-2">
                                            <button
                                                onClick={() => openModal(p)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm inline-flex items-center gap-1 transition shadow-md"
                                            >
                                                <Edit className="w-4 h-4" /> Edit
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(p.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm inline-flex items-center gap-1 transition shadow-md"
                                            >
                                                <Trash2 className="w-4 h-4" /> Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="4" className="py-2 px-4 text-xs text-right text-gray-500">
                                    ID Pengguna: {userId || "Menunggu..."}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </section>
        )};

    // === ROUTER KONTEN HELPER ===
    const ContentRouter = ({ activeView }) => {
        // ... (ContentRouter sama seperti sebelumnya)
        switch (activeView.main) {
            case 'dashboard':
                switch (activeView.sub) {
                    case 'ringkasan': return <GrafikPenjualan />;
                    case 'penjualan': return <LaporanPenjualan />;
                    case 'keuangan': return <LaporanKeuangan />;
                    case 'inventaris': return <LaporanInventaris />;
                }
                break;
            case 'products':
                switch (activeView.sub) {
                    case 'kelola': return <ProductManagementView />; 
                    case 'terlaris': return <ProdukTerlaris />;
                    case 'stok_kritis': return <StokKritis />;
                }
                break;
            case 'orders':
                switch (activeView.sub) {
                    case 'baru': return <PesananBaru />;
                    case 'proses': return <ProsesPesanan />;
                    case 'lacak': return <LacakPesanan />;
                    case 'rencana': return <RencanaPesanan />;
                }
                break;
            case 'users':
                switch (activeView.sub) {
                    case 'manajemen': return <ManajemenUser />;
                    case 'kinerja': return <LaporanKinerja />;
                }
                break;
            case 'settings':
                switch (activeView.sub) {
                    case 'toko': return <PengaturanToko />;
                    case 'pembayaran': return <PengaturanPembayaran />;
                    case 'integrasi': return <Integrasi />;
                }
                break;
        }
        
        // Fallback jika tidak ada yang cocok
        return (
            <div className="bg-white p-10 rounded-xl shadow-md text-center border-l-4 border-yellow-500">
                <p className="text-gray-600">Sila pilih sub-menu untuk {activeView.main}.</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen font-sans bg-gray-50 text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 bg-black text-white flex flex-col justify-between shadow-2xl">
                <div>
                    <h1 className="text-2xl font-bold tracking-widest text-center py-5 border-b border-gray-700 text-yellow-400">
                        ACE DECALS ADMIN
                    </h1>
                    <nav className="flex flex-col mt-4">
                        {menuStructure.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => handleMenuChange(item.key, item.defaultSub)}
                                className={`flex items-center gap-3 px-6 py-3 text-left transition ${
                                    activeView.main === item.key ? "bg-gray-800 border-l-4 border-yellow-400 font-bold" : "hover:bg-gray-800"
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 m-4 rounded-md transition shadow-lg"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8">
                <section>
                    {(() => {
                        const activeMenu = menuStructure.find(m => m.key === activeView.main);
                        if (!activeMenu) return null;

                        return (
                            <>
                                <h2 className="text-4xl font-extrabold text-gray-900 mb-6 capitalize">{activeMenu.label}</h2>

                                {/* SUB-MENU TABS DINAMIS */}
                                {activeMenu.subMenus && (
                                    <div className="flex flex-wrap gap-3 mb-8 p-2 bg-white rounded-xl shadow-lg border border-gray-100">
                                        {activeMenu.subMenus.map((subItem) => (
                                            <button
                                                key={subItem.key}
                                                onClick={() => {
                                                    setActiveView(prev => ({ ...prev, sub: subItem.key }));
                                                }}
                                                className={`flex items-center gap-2 px-5 py-2 rounded-lg transition duration-200 text-sm font-semibold shadow-inner ${
                                                    activeView.sub === subItem.key
                                                        ? 'bg-yellow-400 text-black shadow-md ring-2 ring-yellow-600'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {subItem.icon}
                                                {subItem.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Render Komponen Konten */}
                                <ContentRouter activeView={activeView} />
                            </>
                        );
                    })()}
                </section>
            </main>

            {/* MODAL TAMBAH/EDIT PRODUK */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative transform transition-all duration-300 scale-100">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h3 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-2">
                            {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
                        </h3>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                            <input
                                type="text"
                                placeholder="Nama Produk"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black transition"
                            />
                            <label className="block text-sm font-medium text-gray-700">Harga (contoh: Rp25.000)</label>
                            <input
                                type="text"
                                placeholder="Harga (misal Rp25.000)"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black transition"
                            />
                            <label className="block text-sm font-medium text-gray-700">Stok</label>
                            <input
                                type="number"
                                placeholder="Stok"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black transition"
                            />
                            <label className="block text-sm font-medium text-gray-700">URL Gambar (opsional)</label>
                            <input
                                type="text"
                                placeholder="URL Gambar (opsional)"
                                value={formData.img}
                                onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black transition"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 rounded-lg bg-black text-yellow-400 font-semibold hover:bg-gray-800 transition shadow-md"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL KONFIRMASI (MENGGANTI window.confirm()) */}
            {confirmAction && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Konfirmasi Penghapusan</h3>
                        <p className="text-gray-600 mb-6">Yakin ingin menghapus produk ini? Tindakan ini tidak dapat diulang.</p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmAction}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* NOTIFIKASI KUSTOM (MENGGANTI alert()) */}
            {notification.show && (
                <div 
                    className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 transform ${
                        notification.type === 'success' ? 'bg-green-500' : 
                        notification.type === 'warning' ? 'bg-yellow-500' : 
                        notification.type === 'error' ? 'bg-red-500' : 
                        'bg-blue-500'
                    }`}
                >
                    {notification.message}
                </div>
            )}
        </div>
    );
}
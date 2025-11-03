// src/pages/pengaturan/PengaturanPembayaran.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Trash2, Plus, Banknote, Loader2, Landmark } from 'lucide-react';

export default function PengaturanPembayaran() {
    const [payments, setPayments] = useState([]);
    const [formData, setFormData] = useState({ 
        bankName: '', 
        accountNumber: '', 
        accountHolder: '' 
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // --- 1. READ: Ambil Data Metode Pembayaran dari Firestore ---
    useEffect(() => {
        // Menggunakan "bankAccounts" sebagai koleksi, tapi kita tetap bisa pakai "payments"
        const q = query(collection(db, "payments"), orderBy("createdAt", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPayments(list);
            setIsLoading(false);
        }, (error) => {
            console.error("Gagal mengambil data pembayaran:", error);
            setIsLoading(false);
        });

        setIsLoading(true);
        return () => unsubscribe();
    }, []);

    // Handle input form
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // --- 2. CREATE: Tambah Rekening/E-Wallet Baru ---
    const handleAddPayment = async (e) => {
        e.preventDefault();
        const { bankName, accountNumber, accountHolder } = formData;
        
        if (bankName.trim() === '' || accountNumber.trim() === '' || accountHolder.trim() === '') {
            alert('Semua field (Bank/E-Wallet, Nomor, dan Atas Nama) wajib diisi.');
            return;
        }

        setIsAdding(true);
        try {
            await addDoc(collection(db, "payments"), {
                bankName: bankName.trim(),
                accountNumber: accountNumber.trim(),
                accountHolder: accountHolder.trim(),
                createdAt: new Date(),
            });
            setFormData({ bankName: '', accountNumber: '', accountHolder: '' }); // Reset form
            alert('Rekening pembayaran berhasil ditambahkan!');
        } catch (error) {
            console.error("Gagal menambahkan rekening pembayaran:", error);
            alert("Gagal menambahkan rekening pembayaran.");
        } finally {
            setIsAdding(false);
        }
    };

    // --- 3. DELETE: Hapus Rekening Pembayaran ---
    const handleDeletePayment = async (id) => {
        if (!window.confirm("Yakin ingin menghapus rekening pembayaran ini?")) return;
        
        try {
            await deleteDoc(doc(db, "payments", id));
            alert('Rekening pembayaran berhasil dihapus.');
        } catch (error) {
            console.error("Gagal menghapus rekening pembayaran:", error);
            alert("Gagal menghapus rekening pembayaran.");
        }
    };


    return (
        <div className="p-6 bg-white shadow-xl rounded-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3 border-b pb-3">
                <Banknote className="w-8 h-8 text-yellow-600" />
                Pengaturan Rekening Transfer (Manual)
            </h2>
            <p className="text-sm text-gray-500 mb-6">
                Ini adalah daftar rekening yang akan ditampilkan kepada pelanggan untuk melakukan transfer secara manual.
            </p>

            {/* Form Tambah Rekening */}
            <div className="mb-8 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-blue-800 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Tambah Rekening / E-Wallet
                </h3>
                <form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        name="bankName"
                        placeholder="Nama Bank / E-Wallet (e.g. BCA, DANA, GoPay)"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="col-span-1 md:col-span-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        disabled={isAdding}
                    />
                    <input
                        type="text"
                        name="accountNumber"
                        placeholder="Nomor Rekening / Nomor Ponsel"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className="col-span-1 md:col-span-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        disabled={isAdding}
                    />
                     <input
                        type="text"
                        name="accountHolder"
                        placeholder="Atas Nama"
                        value={formData.accountHolder}
                        onChange={handleChange}
                        className="col-span-1 md:col-span-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        disabled={isAdding}
                    />
                    <button
                        type="submit"
                        disabled={isAdding}
                        className="col-span-1 md:col-span-1 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                        {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        {isAdding ? 'Menyimpan...' : 'Simpan Rekening'}
                    </button>
                </form>
            </div>

            {/* Daftar Metode Pembayaran */}
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Daftar Rekening Aktif ({payments.length})</h3>
            
            {isLoading && (
                <div className="flex items-center justify-center py-10 text-blue-500">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat data...
                </div>
            )}

            {!isLoading && payments.length === 0 ? (
                <p className="text-gray-500 italic">Belum ada rekening pembayaran yang ditambahkan. Silakan tambah satu di atas.</p>
            ) : (
                <div className="space-y-3">
                    {payments.map((p) => (
                        <div key={p.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition">
                            <div className='flex items-center gap-3'>
                                <Landmark className='w-6 h-6 text-blue-600'/>
                                <div>
                                    <span className="font-semibold text-lg text-gray-800 block">{p.bankName}</span>
                                    <p className="text-sm text-gray-600">No: <span className='font-mono font-bold text-gray-900'>{p.accountNumber}</span> | A.N: {p.accountHolder}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeletePayment(p.id)}
                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition mt-2 md:mt-0"
                            >
                                <Trash2 className="w-5 h-5" /> Hapus
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
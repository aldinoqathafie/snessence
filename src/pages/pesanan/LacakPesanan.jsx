import { useState } from "react";
import { redis } from "../../lib/redisClient";

export default function LacakPesanan() {
  const [nomor, setNomor] = useState("");
  const [hasil, setHasil] = useState(null);

  const handleCari = async () => {
    const data = await redis.get(`pesanan:${nomor}`);
    setHasil(data);
  };

  return (
    <div>
      <h2>Lacak Pesanan</h2>
      <input
        value={nomor}
        onChange={e => setNomor(e.target.value)}
        placeholder="Masukkan ID Pesanan / Resi"
        className="border p-1"
      />
      <button onClick={handleCari} className="bg-blue-500 text-white px-2 ml-2">Cari</button>

      {hasil && (
        <div className="mt-3 border p-3">
          <p>Produk: {hasil.namaProduk}</p>
          <p>Status: {hasil.status}</p>
          {hasil.resi && <p>Resi: {hasil.resi}</p>}
        </div>
      )}
    </div>
  );
}

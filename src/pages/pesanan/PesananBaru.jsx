import { useEffect, useState } from "react";
import { redis } from "../../lib/redisClient";

export default function PesananBaru() {
  const [pesanan, setPesanan] = useState([]);

  useEffect(() => {
    (async () => {
      const keys = await redis.keys("pesanan:*");
      const all = await Promise.all(keys.map(k => redis.get(k)));
      const baru = all.filter(p => p.status === "baru");
      setPesanan(baru);
    })();
  }, []);

  const handleProses = async (id) => {
    const key = `pesanan:${id}`;
    const order = await redis.get(key);
    order.status = "proses";
    await redis.set(key, order);
    setPesanan(pesanan.filter(p => p.id !== id));
  };

  return (
    <div>
      <h2>Pesanan Baru</h2>
      {pesanan.length === 0 && <p>Tidak ada pesanan baru.</p>}
      {pesanan.map(p => (
        <div key={p.id} className="border p-3 flex justify-between">
          <div>
            <p>{p.namaProduk}</p>
            <p>{p.userEmail}</p>
          </div>
          <button
            onClick={() => handleProses(p.id)}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Proses
          </button>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { redis } from "../../lib/redisClient";

export default function RencanaPesanan() {
  const [rencana, setRencana] = useState([]);

  useEffect(() => {
    (async () => {
      const keys = await redis.keys("rencana:*");
      const all = await Promise.all(keys.map(k => redis.get(k)));
      const list = all.flat(); // gabungkan array produk
      setRencana(list);
    })();
  }, []);

  return (
    <div>
      <h2>Rencana Pesanan</h2>
      {rencana.map((item, i) => (
        <div key={i} className="border p-3">
          <p>{item.namaProduk}</p>
          <p>User: {item.email}</p>
        </div>
      ))}
    </div>
  );
}

export default function ProsesPesanan() {
  return <h1>Proses Pesanan</h1>;
}
import { useEffect, useState } from "react";
import { redis } from "../../lib/redisClient";

export default function ProsesPesanan() {
  const [pesanan, setPesanan] = useState([]);

  useEffect(() => {
    (async () => {
      const keys = await redis.keys("pesanan:*");
      const all = await Promise.all(keys.map(k => redis.get(k)));
      const proses = all.filter(p => p.status === "proses");
      setPesanan(proses);
    })();
  }, []);

  return (
    <div>
      <h2>Dalam Proses</h2>
      {pesanan.map(p => (
        <div key={p.id} className="border p-3">
          <p>{p.namaProduk}</p>
          <p>Menunggu pickup paket...</p>
        </div>
      ))}
    </div>
  );
}

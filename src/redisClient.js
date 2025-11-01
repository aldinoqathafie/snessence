export default async function redisFetch(key) {
  try {
    const url = import.meta.env.VITE_UPSTASH_REDIS_REST_URL + "/get/" + key;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN}`,
      },
    });
    const data = await res.json();
    return JSON.parse(data.result || "[]");
  } catch (err) {
    console.error("Redis fetch error:", err);
    return [];
  }
}
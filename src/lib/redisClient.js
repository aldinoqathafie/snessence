// src/lib/redisClient.js
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: import.meta.env.VITE_UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});
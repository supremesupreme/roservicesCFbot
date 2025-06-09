// redis.js
import { Redis } from "@upstash/redis/cloudflare";
import { getGlobalConfig } from "./inital";

let redis = null;

export function getRedis() {
  if (!redis) {
    const { redisUrl, redisToken } = getGlobalConfig();
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  }
  return redis;
}

let config = null;

export function setGlobalConfig(env) {
  config = {
    encryptionKey: env.ENCRYPTION_KEY,
    redisUrl: env.UPSTASH_REDIS_REST_URL,
    redisToken: env.UPSTASH_REDIS_REST_TOKEN,
  };
}

export function getGlobalConfig() {
  if (!config) {
    throw new Error("Global config not initialized. Call setGlobalConfig(env) in your fetch handler first.");
  }
  return config;
}
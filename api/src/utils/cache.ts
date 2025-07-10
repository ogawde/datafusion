import NodeCache from 'node-cache';

const ttlSeconds = Number.parseInt(process.env.CACHE_TTL ?? '300', 10);

const cache = new NodeCache({
  stdTTL: Number.isNaN(ttlSeconds) ? 300 : ttlSeconds,
  checkperiod: 60,
});

type CacheValue = unknown;

export const getCache = <T = CacheValue>(key: string): T | undefined =>
  cache.get<T>(key);

export const setCache = <T = CacheValue>(
  key: string,
  value: T,
  ttl?: number,
) => {
  if (typeof ttl === 'number') {
    return cache.set<T>(key, value, ttl);
  }

  return cache.set<T>(key, value);
};

export const deleteCache = (key: string) => cache.del(key);

export const flushCache = () => cache.flushAll();


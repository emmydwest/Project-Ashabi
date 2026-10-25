interface RateBucket {
  tokens: number;
  lastRefill: number;
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const buckets = new Map<string, RateBucket>();
const memoryCache = new Map<string, CacheEntry<unknown>>();
const inflightRequests = new Map<string, Promise<unknown>>();

/**
 * Token-bucket rate limiter for both outgoing API requests and incoming route handlers.
 */
export function checkRateLimit(
  key: string,
  maxTokens: number,
  refillPerSecond: number,
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { tokens: maxTokens - 1, lastRefill: now };
    buckets.set(key, bucket);
    return { allowed: true, retryAfterMs: 0 };
  }

  const elapsedSeconds = (now - bucket.lastRefill) / 1000;
  if (elapsedSeconds > 0) {
    bucket.tokens = Math.min(
      maxTokens,
      bucket.tokens + elapsedSeconds * refillPerSecond,
    );
    bucket.lastRefill = now;
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return { allowed: true, retryAfterMs: 0 };
  }

  const needed = 1 - bucket.tokens;
  const retryAfterMs = Math.ceil((needed / refillPerSecond) * 1000);
  return { allowed: false, retryAfterMs };
}

/**
 * Waits until a rate-limit token is available for an upstream API host.
 */
export async function acquireUpstreamToken(
  upstreamName: string,
  maxPerSecond = 4,
): Promise<void> {
  for (let attempt = 0; attempt < 12; attempt++) {
    const { allowed, retryAfterMs } = checkRateLimit(
      `upstream:${upstreamName}`,
      maxPerSecond,
      maxPerSecond,
    );
    if (allowed) return;
    await new Promise((resolve) =>
      setTimeout(resolve, Math.min(retryAfterMs, 400)),
    );
  }
}

/**
 * Deduplicated, rate-limited, cached fetch wrapper for external APIs.
 */
export async function cachedRateLimitedFetch<T>(
  cacheKey: string,
  upstreamName: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const cached = memoryCache.get(cacheKey) as CacheEntry<T> | undefined;
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const existingInflight = inflightRequests.get(cacheKey) as
    | Promise<T>
    | undefined;
  if (existingInflight) {
    return existingInflight;
  }

  const promise = (async () => {
    try {
      await acquireUpstreamToken(upstreamName, 4);
      const result = await fetcher();
      memoryCache.set(cacheKey, {
        value: result,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
      return result;
    } finally {
      inflightRequests.delete(cacheKey);
    }
  })();

  inflightRequests.set(cacheKey, promise);
  return promise;
}

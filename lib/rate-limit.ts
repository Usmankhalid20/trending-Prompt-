type RateLimitRecord = {
  tokens: number;
  lastReset: number;
};

const store = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding window rate limiter
 * @param identifier Unique key (e.g. IP address or email)
 * @param limit Maximum requests allowed within window
 * @param windowMs Window duration in milliseconds (default 60 seconds)
 */
export function checkRateLimit(
  identifier: string,
  limit = 5,
  windowMs = 60 * 1000
): { success: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now - record.lastReset > windowMs) {
    store.set(identifier, { tokens: 1, lastReset: now });
    return { success: true, remaining: limit - 1, resetMs: windowMs };
  }

  if (record.tokens >= limit) {
    const resetMs = windowMs - (now - record.lastReset);
    return { success: false, remaining: 0, resetMs };
  }

  record.tokens += 1;
  store.set(identifier, record);
  return { success: true, remaining: limit - record.tokens, resetMs: windowMs - (now - record.lastReset) };
}

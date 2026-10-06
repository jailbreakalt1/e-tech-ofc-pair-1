import { RATE_LIMITS } from '../config/settings.js';

const rateLimitStore = new Map();

export function checkRateLimit(key, type = 'default') {
  const config = RATE_LIMITS[type] || RATE_LIMITS.default;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.max - 1, resetTime: now + config.windowMs };
  }

  if (entry.count >= config.max) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return { allowed: true, remaining: config.max - entry.count, resetTime: entry.resetTime };
}

export function getRateLimitInfo(key, type = 'default') {
  const config = RATE_LIMITS[type] || RATE_LIMITS.default;
  const entry = rateLimitStore.get(key);
  if (!entry || Date.now() > entry.resetTime) {
    return { used: 0, remaining: config.max, resetTime: Date.now() + config.windowMs };
  }
  return { used: entry.count, remaining: config.max - entry.count, resetTime: entry.resetTime };
}

export function clearRateLimit(key) {
  rateLimitStore.delete(key);
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

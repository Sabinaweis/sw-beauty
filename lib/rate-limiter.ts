// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, maxRequests: number, windowMs: number): void {
  const now = Date.now();
  const windowStart = now - windowMs;

  const existing = rateLimitMap.get(ip);

  if (!existing || existing.resetTime < windowStart) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return;
  }

  if (existing.count >= maxRequests) {
    throw new Error('Too many requests. Please try again later.');
  }

  existing.count++;
}
/**
 * In-memory sliding-window rate limiter for API protection.
 * Automatically cleans up expired entries to prevent memory exhaustion.
 */

interface RateLimitRecord {
  timestamps: number[]
}

class RateLimiter {
  private requests: Map<string, RateLimitRecord> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(
    private readonly windowMs: number = 60 * 1000, // 1 minute window
    private readonly maxRequests: number = 25      // max 25 requests per window
  ) {
    // Periodically prune stale IP records every 2 minutes
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => {
        this.prune()
      }, 2 * 60 * 1000)
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref()
      }
    }
  }

  public check(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const windowStart = now - this.windowMs

    let record = this.requests.get(ip)
    if (!record) {
      record = { timestamps: [] }
      this.requests.set(ip, record)
    }

    // Filter out timestamps outside the active sliding window
    record.timestamps = record.timestamps.filter((t) => t > windowStart)

    if (record.timestamps.length >= this.maxRequests) {
      const oldestInWindow = record.timestamps[0] || now
      const resetTime = Math.ceil((oldestInWindow + this.windowMs - now) / 1000)
      return {
        allowed: false,
        remaining: 0,
        resetTime: Math.max(1, resetTime),
      }
    }

    // Record this request
    record.timestamps.push(now)

    return {
      allowed: true,
      remaining: this.maxRequests - record.timestamps.length,
      resetTime: Math.ceil(this.windowMs / 1000),
    }
  }

  private prune() {
    const now = Date.now()
    const windowStart = now - this.windowMs
    for (const [ip, record] of this.requests.entries()) {
      record.timestamps = record.timestamps.filter((t) => t > windowStart)
      if (record.timestamps.length === 0) {
        this.requests.delete(ip)
      }
    }
  }
}

// Global singleton rate limiter for chat endpoint (25 req/min per IP)
export const chatRateLimiter = new RateLimiter(60 * 1000, 25)

/**
 * Extracts client IP from standard reverse proxy headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const ips = forwardedFor.split(',')
    return ips[0].trim()
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  const cfIp = req.headers.get('cf-connecting-ip')
  if (cfIp) {
    return cfIp.trim()
  }

  return '127.0.0.1'
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LRUCache } from 'lru-cache';

// Rate limit configuration
const rateLimit = 5; // max requests
const windowMs = 60 * 1000; // 1 minute

// In-memory store (Note: In Next.js Edge runtime, this state is per-isolate. 
// It works for basic protection but isn't a distributed lock).
const tokenCache = new LRUCache<string, number>({
  max: 1000,
  ttl: windowMs,
});

export function middleware(req: NextRequest) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || '127.0.0.1';
  const path = req.nextUrl.pathname;

  // We only rate limit specific sensitive POST routes
  if (req.method === 'POST') {
    if (path.startsWith('/api/auth/callback/credentials') || path.startsWith('/api/checkout')) {
      const key = `${ip}-${path}`;
      const tokenCount = tokenCache.get(key) || 0;

      if (tokenCount >= rateLimit) {
        console.warn(`Rate limit exceeded for IP: ${ip} on path: ${path}`);
        return new NextResponse(
          JSON.stringify({ message: 'Too many requests, please try again later.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }

      tokenCache.set(key, tokenCount + 1);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/auth/callback/credentials',
    '/api/checkout',
  ],
};

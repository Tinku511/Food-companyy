'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';

// Inner component uses useSearchParams — must be inside <Suspense>
function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-24">
      <div className="w-full max-w-lg text-center">
        {/* Animated success icon */}
        <div
          className={`mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl shadow-green-400/30 transition-all duration-700 ${
            mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <svg
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div
          className={`transition-all delay-150 duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <h1 className="mb-3 font-display text-4xl font-bold text-content">Order Confirmed!</h1>
          <p className="mb-2 text-lg text-content">Thank you for shopping with SesemeFoods.</p>
          <p className="mb-8 text-muted">
            Your payment was successful and your order is being processed. We&apos;ll send you an
            email with delivery updates soon.
          </p>

          {orderId && (
            <div className="mb-8 rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-widest text-muted">
                Order ID
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-content">{orderId}</p>
            </div>
          )}

          {/* Payment security badges */}
          <div className="mb-8 flex items-center justify-center gap-6 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Payment verified by Razorpay
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              SSL Encrypted
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/products" className="btn-primary px-6 py-3 text-sm">
              Continue Shopping
            </Link>
            {orderId && (
              <Link
                href={`/track?id=${orderId}`}
                className="btn-secondary px-6 py-3 text-sm"
              >
                Track Order →
              </Link>
            )}
            <Link
              href="/"
              className="btn-secondary px-6 py-3 text-sm"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Outer page wraps in Suspense — required by Next.js App Router for useSearchParams
export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brass border-t-transparent" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}

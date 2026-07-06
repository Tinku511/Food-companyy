'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function CartPage() {
  const { items, cartTotal, updateQuantity, removeFromCart, isLoading } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  // Animate in on mount
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Full-page layout that feels like a slide-in panel on desktop */}
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row lg:divide-x lg:divide-stone-200">
        {/* ── Left panel: Items ───────────────────────────── */}
        <div
          ref={panelRef}
          className="flex-1 px-4 pb-12 pt-24 opacity-0 transition-all duration-500 ease-out sm:px-6 lg:px-12"
          style={{ transform: 'translateX(-24px)' }}
        >
          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brass">
                Your Basket
              </p>
              <h1 className="font-display text-4xl font-bold text-foreground">Shopping Cart</h1>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1.5 rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-500 transition hover:border-stone-300 hover:text-foreground"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
                <svg
                  className="h-10 w-10 text-stone-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.293 1.293A1 1 0 006 15h12M9 19a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z"
                  />
                </svg>
              </div>
              <div className="max-w-xs">
                <h2 className="mb-2 font-display text-2xl font-bold text-foreground">
                  Your cart is empty
                </h2>
                <p className="mb-6 text-stone-500">
                  Looks like you haven&apos;t added anything yet.
                </p>
                <Link href="/products" className="btn-primary">
                  Start Shopping
                </Link>
              </div>
            </div>
          ) : (
            <ul className="mt-8 space-y-0 border-t border-stone-200">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-center gap-6 border-b border-stone-200 bg-transparent py-6"
                >
                  {/* Product image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Link
                      href={`/products/${item.id}`}
                      className="truncate font-display text-base font-semibold text-foreground hover:text-brass sm:text-lg"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm font-medium text-brass">₹{item.price.toFixed(2)}</p>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="inline-flex items-center rounded-full border border-stone-200 bg-background">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-200 hover:text-charcoal"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-9 text-center text-sm font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-200 hover:text-charcoal"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-xs text-stone-400">
                        = ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-300 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <svg
                      className="h-4.5 w-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Right panel: Order Summary ───────────────────── */}
        {items.length > 0 && (
          <div className="bg-background/70 w-full border-t border-stone-200 px-4 pb-12 pt-8 lg:w-96 lg:border-t-0 lg:px-8 lg:pt-24">
            <div className="sticky top-24">
              <h2 className="mb-6 font-display text-xl font-bold text-foreground">Order Summary</h2>

              {/* Items mini-list */}
              <ul className="mb-6 space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 text-sm">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brass text-[9px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <span className="flex-1 truncate text-stone-600">{item.name}</span>
                    <span className="font-medium text-foreground">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Totals - Receipt Style */}
              <div className="mt-8 border-b-2 border-dashed border-stone-200 pb-6 pt-4">
                <div className="mb-3 flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Shipping</span>
                  <span className="font-mono text-green-600">Free</span>
                </div>
              </div>
              <div className="flex items-end justify-between py-6">
                <span className="text-sm font-semibold uppercase tracking-widest text-stone-400">
                  Total
                </span>
                <span className="font-display text-4xl font-bold text-charcoal">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              {/* CTA */}
              <Link href="/checkout" className="btn-primary w-full shadow-brand-md">
                <svg
                  className="h-4 w-4 shrink-0"
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
                Complete Purchase
              </Link>

              <p className="mt-3 text-center text-[11px] text-stone-400">
                Secured by Razorpay · SSL Encrypted
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

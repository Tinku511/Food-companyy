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
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    });
  }, []);

  return (
    <div className="min-h-screen bg-background pb-32 pt-16 lg:pt-24">
      <div 
        ref={panelRef}
        className="mx-auto max-w-7xl px-6 opacity-0 transition-all duration-700 ease-out lg:px-8"
        style={{ transform: 'translateY(20px)' }}
      >
        
        {/* HEADER */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Your Basket
            </span>
            <h1 className="font-display text-5xl font-light tracking-tight text-content lg:text-6xl">
              Shopping Cart
            </h1>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-2 text-sm font-semibold text-brass transition-colors hover:text-charcoal"
          >
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* ─── LEFT: ITEMS ─────────────────────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center rounded-[2rem] bg-surface">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border bg-surface py-32 text-center">
                <svg className="mb-6 h-16 w-16 text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="font-display text-3xl font-light text-content">Your cart is empty</h2>
                <p className="mt-4 max-w-sm text-muted">
                  Looks like you haven't added anything to your cart yet. Discover our premium collection today.
                </p>
                <Link href="/products" className="btn-primary mt-8 px-10 py-4">
                  Explore Products
                </Link>
              </div>
            ) : (
              <ul className="flex flex-col gap-6">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="group relative flex flex-col gap-6 rounded-[2rem] bg-surface p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
                  >
                    {/* Image */}
                    <Link href={`/products/${item.id}`} className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-2xl bg-background sm:w-32">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-4">
                        <Link href={`/products/${item.id}`} className="line-clamp-2 font-display text-xl font-light text-content transition-colors hover:text-brass sm:text-2xl">
                          {item.name}
                        </Link>
                        <span className="font-display text-xl font-medium text-content sm:text-2xl">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      
                      <p className="mt-2 text-sm text-muted">₹{item.price.toFixed(2)} each</p>

                      <div className="mt-6 flex items-center justify-between">
                        {/* Premium Quantity Stepper */}
                        <div className="flex h-10 w-28 items-center justify-between rounded-full border border-border bg-background px-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-border hover:text-content"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-sm font-semibold text-content">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-border hover:text-content"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted transition hover:text-red-500"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ─── RIGHT: STICKY ORDER SUMMARY ─────────────────────────── */}
          {items.length > 0 && (
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-32 rounded-[2.5rem] bg-surface p-8 shadow-xl shadow-stone-200/50">
                <h2 className="mb-8 font-display text-2xl font-light text-content">Order Summary</h2>

                {/* Totals */}
                <div className="space-y-4 border-b border-border pb-6 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="font-medium text-content">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Estimated Shipping</span>
                    <span className="font-medium text-success">Free</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Taxes</span>
                    <span className="font-medium text-content">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex items-end justify-between pt-6">
                  <span className="text-sm font-semibold uppercase tracking-widest text-muted">Total</span>
                  <span className="font-display text-4xl font-light tracking-tight text-content">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>

                {/* Promo Code UI (Visual Only) */}
                <div className="mt-8">
                  <label htmlFor="promo" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="promo"
                      placeholder="Enter code"
                      className="w-full rounded-full border border-border bg-background px-4 py-3 text-sm text-content outline-none transition focus:border-brass"
                    />
                    <button className="rounded-full bg-border px-6 py-3 text-sm font-semibold text-content transition hover:bg-brass hover:text-white">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-dark py-5 text-base font-semibold text-white shadow-xl shadow-dark/20 transition-all hover:-translate-y-1 hover:bg-black hover:shadow-dark/40"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Proceed to Checkout
                </Link>

                {/* Trust Footer */}
                <div className="mt-8 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-4 text-muted/60">
                    <svg className="h-8 w-12 rounded border border-border px-1" viewBox="0 0 32 20" fill="none">
                      <rect width="32" height="20" rx="2" fill="currentColor"/>
                      <circle cx="10" cy="10" r="5" fill="#fff"/>
                      <circle cx="22" cy="10" r="5" fill="#fff"/>
                    </svg>
                    <svg className="h-8 w-12 rounded border border-border px-1" viewBox="0 0 32 20" fill="none">
                      <rect width="32" height="20" rx="2" fill="currentColor"/>
                      <path d="M5 10L10 15L27 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-center text-xs text-muted">
                    Secure checkout powered by Razorpay. <br/>256-bit SSL encryption.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

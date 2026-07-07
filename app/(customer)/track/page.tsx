'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type TrackedOrder = {
  id: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
  fulfilmentStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: { quantity: number; productName: string; productImage: string }[];
};

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialId = searchParams.get('id') || '';
  const [orderId, setOrderId] = useState(initialId);

  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch immediately if ID is in URL
  useState(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  });

  async function handleSearch(idToSearch: string = orderId) {
    if (!idToSearch.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    router.replace(`/track?id=${idToSearch}`);

    try {
      const res = await fetch(`/api/orders/track?id=${idToSearch}`);
      if (!res.ok) {
        if (res.status === 404)
          throw new Error("We couldn't find an order with that ID. Please check and try again.");
        throw new Error('Something went wrong checking the order status.');
      }

      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Calculate mock estimated delivery (Order date + 3 days)
  const estimatedDelivery = order ? new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000) : new Date();

  return (
    <div className="min-h-screen bg-background pb-32 pt-16 lg:pt-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="mb-12 text-center animate-slide-up">
          <h1 className="font-display text-4xl font-light tracking-tight text-content lg:text-6xl">
            Track Package
          </h1>
          <p className="mt-4 text-muted">
            Enter your order tracking number to see live delivery updates.
          </p>
        </div>

        {/* ── SEARCH BAR ──────────────────────────────────────────────────── */}
        <div className="mx-auto mb-16 max-w-2xl animate-fade-in delay-100">
          <div className="flex items-center rounded-full border border-border bg-surface p-2 shadow-xl shadow-stone-200/50 transition-shadow focus-within:shadow-2xl focus-within:shadow-brass/20">
            <div className="pl-6 pr-2 text-muted">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Enter tracking number (e.g. cm1a2b3...)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent py-4 text-base font-medium text-content outline-none placeholder:font-normal placeholder:text-muted/60"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading || !orderId.trim()}
              className="rounded-full bg-dark px-10 py-4 font-semibold text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={1.5} />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                'Track'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-auto mb-16 max-w-2xl animate-scale-in rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {/* ── RESULTS CARD ────────────────────────────────────────────────── */}
        {order && (
          <div className="animate-slide-up rounded-[2.5rem] border border-border bg-surface shadow-2xl shadow-stone-200/50 overflow-hidden">
            
            {/* Split Header */}
            <div className="grid border-b border-border sm:grid-cols-2">
              <div className="border-b border-border p-8 sm:border-b-0 sm:border-r">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Order Details</p>
                <h3 className="font-display text-2xl font-light text-content mb-1">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                <p className="text-sm font-medium text-brass">Total: ₹{Number(order.totalAmount).toFixed(2)}</p>
              </div>
              <div className="bg-background/30 p-8">
                {order.fulfilmentStatus !== 'CANCELLED' && order.fulfilmentStatus !== 'DELIVERED' ? (
                  <>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Estimated Delivery</p>
                    <h3 className="font-display text-2xl font-medium text-content mb-1 text-gradient-brand">
                      {estimatedDelivery.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </h3>
                    <p className="text-sm text-muted">By 9:00 PM</p>
                  </>
                ) : order.fulfilmentStatus === 'DELIVERED' ? (
                  <>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Delivery Status</p>
                    <h3 className="font-display text-2xl font-medium text-success mb-1">
                      Delivered Successfully
                    </h3>
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Delivery Status</p>
                    <h3 className="font-display text-2xl font-medium text-red-500 mb-1">
                      Order Cancelled
                    </h3>
                  </>
                )}
              </div>
            </div>

            <div className="p-8 sm:p-16">
              
              {order.fulfilmentStatus === 'CANCELLED' ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
                    <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="font-display text-3xl font-light text-content">Order Cancelled</h3>
                  <p className="mt-4 text-muted">This order has been cancelled and will not be delivered.</p>
                </div>
              ) : (
                <div className="py-8">
                  {/* Modern Animated Progress Tracker */}
                  <div className="relative mx-auto max-w-3xl">
                    {/* Background Track */}
                    <div className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-border" />

                    {/* Active Track */}
                    <div
                      className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brass transition-all duration-1000 ease-out"
                      style={{
                        width:
                          order.fulfilmentStatus === 'PROCESSING' ? '33.33%' : 
                          order.fulfilmentStatus === 'SHIPPED' ? '66.66%' : 
                          order.fulfilmentStatus === 'DELIVERED' ? '100%' : '0%',
                      }}
                    />

                    {/* Nodes */}
                    <div className="relative z-10 flex justify-between">
                      {['Order Placed', 'Processing', 'In Transit', 'Delivered'].map((step, idx) => {
                        let currentIndex = 0;
                        if (order.fulfilmentStatus === 'PROCESSING') currentIndex = 1;
                        if (order.fulfilmentStatus === 'SHIPPED') currentIndex = 2;
                        if (order.fulfilmentStatus === 'DELIVERED') currentIndex = 3;

                        const isCompleted = idx <= currentIndex;
                        const isActive = idx === currentIndex;

                        return (
                          <div key={step} className="flex flex-col items-center">
                            <div
                              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 transition-all duration-700 bg-white ${
                                isCompleted ? 'border-brass text-brass' : 'border-border text-transparent'
                              } ${isActive && order.fulfilmentStatus !== 'DELIVERED' ? 'animate-pulse-ring' : ''}`}
                            >
                              {isCompleted ? (
                                <svg className="h-5 w-5 animate-scale-in text-brass" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <div className="h-3 w-3 rounded-full bg-border" />
                              )}
                            </div>
                            <p className={`absolute top-14 mt-2 text-center text-xs font-bold uppercase tracking-widest ${isCompleted ? 'text-content' : 'text-muted'}`}>
                              {step}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Items Summary */}
              <div className="mt-24 rounded-3xl border border-border bg-background/50 p-8">
                <h4 className="mb-6 font-display text-xl font-light text-content">Items in this shipment</h4>
                <ul className="grid gap-6 sm:grid-cols-2">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-6 rounded-2xl bg-surface p-4 shadow-sm border border-border">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-background border border-border">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="line-clamp-2 font-display text-lg font-medium text-content">{item.productName}</p>
                        <p className="mt-1 text-sm text-muted">Quantity: {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}

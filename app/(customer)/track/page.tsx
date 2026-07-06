'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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

    // Update URL without reloading
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

  const steps = ['PROCESSING', 'SHIPPED', 'DELIVERED'];

  return (
    <div className="mx-auto min-h-[70vh] max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold text-foreground">Track Your Order</h1>
        <p className="mt-2 text-stone-500">
          Enter your order ID to see the latest updates on your delivery.
        </p>
      </div>

      {/* Search Box */}
      <div className="card mx-auto mb-12 flex max-w-xl items-center p-2">
        <div className="pl-4 pr-2 text-stone-400">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="e.g. cm1a2b3c4d5e6f7g8h9i0j"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 bg-transparent px-2 py-3 font-medium text-foreground outline-none"
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading || !orderId.trim()}
          className="rounded-xl bg-charcoal px-6 py-3 font-medium text-white transition hover:bg-charcoal/90 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </div>

      {error && (
        <div className="mx-auto max-w-xl rounded-xl border border-plum/20 bg-plum/10 p-4 text-center text-sm font-medium text-plum">
          {error}
        </div>
      )}

      {/* Results */}
      {order && (
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-stone-100 bg-background p-6 sm:flex-row sm:items-center dark:border-surface-700">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone-500">
                Order Placed
              </p>
              <p className="font-medium text-charcoal">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone-500">
                Total Amount
              </p>
              <p className="font-medium text-charcoal">₹{Number(order.totalAmount).toFixed(2)}</p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {order.fulfilmentStatus === 'CANCELLED' ? (
              <div className="py-8 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">Order Cancelled</h3>
                <p className="mt-2 text-stone-500">
                  This order has been cancelled and will not be delivered.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="mb-8 text-center font-display text-2xl font-bold text-foreground">
                  Status:{' '}
                  <span className="capitalize text-brass">
                    {order.fulfilmentStatus.toLowerCase()}
                  </span>
                </h3>

                {/* Progress Bar */}
                <div className="relative mx-auto mb-12 mt-12 max-w-lg">
                  <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-stone-100" />

                  <div className="relative z-10 flex justify-between">
                    {['Placed', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => {
                      let currentIndex = 0;
                      if (order.fulfilmentStatus === 'PROCESSING') currentIndex = 1; // Packed is active
                      if (order.fulfilmentStatus === 'SHIPPED') currentIndex = 2; // Shipped
                      if (order.fulfilmentStatus === 'DELIVERED') currentIndex = 3; // Delivered

                      const isCompleted = idx <= currentIndex;
                      const isActive = idx === currentIndex;

                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div
                            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-colors duration-500 ${isCompleted ? 'border-brass text-brass' : 'border-stone-200 text-stone-300'} ${isActive ? 'ring-4 ring-brass/20' : ''} `}
                          >
                            {isCompleted ? (
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <div className="h-2 w-2 rounded-full bg-current" />
                            )}
                          </div>
                          <p
                            className={`absolute top-10 mt-3 whitespace-nowrap text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-charcoal' : 'text-stone-400'} `}
                          >
                            {step}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active track color overlay */}
                  <div
                    className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-brass transition-all duration-700 ease-in-out"
                    style={{
                      width:
                        order.fulfilmentStatus === 'PROCESSING'
                          ? '33.33%'
                          : order.fulfilmentStatus === 'SHIPPED'
                            ? '66.66%'
                            : order.fulfilmentStatus === 'DELIVERED'
                              ? '100%'
                              : '0%',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Items summary */}
            <div className="mt-12">
              <h4 className="mb-4 border-b border-stone-100 pb-2 text-sm font-bold uppercase tracking-widest text-foreground">
                Order Items
              </h4>
              <ul className="space-y-4">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-16 w-16 rounded-xl border border-stone-100 object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.productName}</p>
                      <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 text-center">
              <Link href="/products" className="text-sm font-semibold text-brass hover:underline">
                Continue Shopping →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}

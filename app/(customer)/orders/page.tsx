'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Order = {
  id: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
  fulfilmentStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: { quantity: number; product: { name: string; imageUrl: string } }[];
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/user/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PROCESSING: 'bg-brass/10 text-brass border-brass/20',
    SHIPPED: 'bg-blue-100 text-blue-700 border-blue-200',
    DELIVERED: 'bg-green-100 text-green-700 border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-foreground">Order History</h1>
        <p className="mt-2 text-stone-500">
          Check the status of recent orders, manage returns, and download invoices.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white py-20 text-center shadow-sm">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-background text-4xl">
            📦
          </div>
          <h2 className="mb-2 font-display text-2xl font-bold text-foreground">No orders yet</h2>
          <p className="mx-auto mb-6 max-w-xs text-stone-500">
            When you place an order, it will appear here so you can track its progress.
          </p>
          <Link href="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-col justify-between gap-4 border-b border-stone-200 bg-background px-6 py-4 sm:flex-row sm:items-center">
                <div className="grid flex-1 grid-cols-2 gap-6 text-sm sm:grid-cols-4">
                  <div>
                    <p className="mb-1 text-stone-500">Date placed</p>
                    <p className="font-medium text-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-stone-500">Total amount</p>
                    <p className="font-medium text-foreground">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <p className="mb-1 text-stone-500">Order #</p>
                    <p className="font-mono font-medium text-foreground">{order.id}</p>
                  </div>
                </div>
                <div>
                  <Link
                    href={`/track?id=${order.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-charcoal shadow-sm hover:bg-background"
                  >
                    Track Order
                  </Link>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-6">
                  <div className="flex-1">
                    <h3 className="mb-1 flex items-center gap-3 text-lg font-bold text-foreground">
                      Delivery Status
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[order.fulfilmentStatus]}`}
                      >
                        {order.fulfilmentStatus}
                      </span>
                    </h3>
                  </div>
                </div>

                <ul className="space-y-6">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex gap-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-stone-200">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-medium text-foreground">
                          <h4>{item.product.name}</h4>
                        </div>
                        <p className="mt-1 text-sm text-stone-500">Qty: {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

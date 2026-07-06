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
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 min-h-screen">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-foreground">Order History</h1>
        <p className="mt-2 text-stone-500">Check the status of recent orders, manage returns, and download invoices.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 py-20 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-background text-4xl mb-4">
             📦
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">No orders yet</h2>
          <p className="text-stone-500 mb-6 max-w-xs mx-auto">When you place an order, it will appear here so you can track its progress.</p>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              {/* Header */}
              <div className="border-b border-stone-200 bg-background px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1 text-sm">
                  <div>
                    <p className="text-stone-500 mb-1">Date placed</p>
                    <p className="font-medium text-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-stone-500 mb-1">Total amount</p>
                    <p className="font-medium text-foreground">₹{Number(order.totalAmount).toFixed(2)}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <p className="text-stone-500 mb-1">Order #</p>
                    <p className="font-medium text-foreground font-mono">{order.id}</p>
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
                      <h3 className="font-bold text-foreground text-lg mb-1 flex items-center gap-3">
                         Delivery Status
                         <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColors[order.fulfilmentStatus]}`}>
                            {order.fulfilmentStatus}
                         </span>
                      </h3>
                   </div>
                </div>
                
                <ul className="space-y-6">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex gap-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-stone-200">
                        <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover object-center" />
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

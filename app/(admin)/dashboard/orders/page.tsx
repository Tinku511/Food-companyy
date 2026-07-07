'use client';

import { useState, useEffect } from 'react';

type Order = {
  id: string;
  totalAmount: number;
  paymentStatus: string;
  fulfilmentStatus: string;
  createdAt: string;
  user: { name: string; email: string };
  items: { product: { name: string } }[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateError, setUpdateError] = useState('');

  async function fetchOrders() {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdateError('');
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, fulfilmentStatus: newStatus } : o)),
    );

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfilmentStatus: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (err: any) {
      // Revert on error and surface message
      setUpdateError(err.message || 'Failed to update order status. Please try again.');
      fetchOrders();
    }
  };

  const statusColors: Record<string, string> = {
    PROCESSING: 'bg-brass/10 text-brass',
    SHIPPED: 'bg-blue-50 text-blue-700',
    DELIVERED: 'bg-green-50 text-green-700',
    CANCELLED: 'bg-red-50 text-red-600',
  };

  const paymentColors: Record<string, string> = {
    PENDING: 'bg-stone-100 text-stone-600',
    PAID: 'bg-green-50 text-green-700',
    FAILED: 'bg-red-50 text-red-600',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-content tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted">Manage fulfillments and order statuses.</p>
      </div>

      {/* Error Banner */}
      {updateError && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 animate-scale-in">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{updateError}</span>
          </div>
          <button onClick={() => setUpdateError('')} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 text-center text-muted">
            <svg className="mx-auto mb-4 h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="font-medium text-content">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background/50 text-left text-[10px] font-bold uppercase tracking-widest text-muted">
                  <th className="px-6 py-4">Order ID & Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-background/50">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-medium text-content">{order.id.split('-')[0]}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {new Date(order.createdAt).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-content">{order.user.name}</p>
                      <p className="text-xs text-muted">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-content">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                      <p className="max-w-[150px] truncate text-[11px] text-muted mt-0.5" title={order.items.map((i) => i.product.name).join(', ')}>
                        {order.items.map((i) => i.product.name).join(', ')}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-content">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${paymentColors[order.paymentStatus] ?? 'bg-stone-100 text-stone-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={order.fulfilmentStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`appearance-none cursor-pointer rounded-md px-3 py-1.5 pr-8 text-[10px] font-bold uppercase tracking-widest outline-none transition-all focus:ring-2 focus:ring-brass/20 focus:border-brass ${statusColors[order.fulfilmentStatus] ?? 'bg-stone-100 text-stone-600'}`}
                        >
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current opacity-70">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

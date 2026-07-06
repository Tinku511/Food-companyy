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
    SHIPPED: 'bg-blue-100 text-blue-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-600',
  };

  const paymentColors: Record<string, string> = {
    PENDING: 'bg-stone-100 text-stone-600',
    PAID: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-600',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-brass">Fulfillment</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-charcoal">Orders</h1>
        <p className="mt-1 text-sm text-stone-500">Manage order statuses and shipments</p>
      </div>

      {/* Error Banner */}
      {updateError && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-600">
          <span>⚠️ {updateError}</span>
          <button
            onClick={() => setUpdateError('')}
            className="ml-4 text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-stone-400">
            <p className="mb-4 text-4xl">🛍️</p>
            <p className="font-medium">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-background text-left text-xs font-semibold uppercase tracking-wider text-stone-400">
                  <th className="px-5 py-3">Order ID & Date</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-background/60 transition">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-medium text-charcoal">{order.id}</p>
                      <p className="text-xs text-stone-400">
                        {new Date(order.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-charcoal">{order.user.name}</p>
                      <p className="text-xs text-stone-400">{order.user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-stone-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                      <p
                        className="max-w-[150px] truncate text-xs text-stone-400"
                        title={order.items.map((i) => i.product.name).join(', ')}
                      >
                        {order.items.map((i) => i.product.name).join(', ')}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-medium text-charcoal">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${paymentColors[order.paymentStatus] ?? 'bg-stone-100 text-stone-600'}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.fulfilmentStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`cursor-pointer rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider outline-none transition focus:ring-2 focus:ring-brass/20 ${statusColors[order.fulfilmentStatus] ?? 'bg-stone-100 text-stone-600'}`}
                        style={{ appearance: 'none' }}
                      >
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
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

import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getStats() {
  const [totalOrders, revenueResult, totalProducts, recentOrders, topProducts] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { totalAmount: true },
    }),
    prisma.product.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { unitPrice: true, quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ]);

  const productIds = topProducts.map((p) => p.productId);
  const productDetails = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, imageUrl: true },
  });

  const topProductsWithNames = topProducts.map((tp) => ({
    ...tp,
    product: productDetails.find((p) => p.id === tp.productId),
  }));

  return {
    totalOrders,
    totalRevenue: Number(revenueResult._sum.totalAmount ?? 0),
    totalProducts,
    recentOrders,
    topProducts: topProductsWithNames,
  };
}

const statusColors: Record<string, string> = {
  PROCESSING: 'bg-brass/10 text-brass',
  SHIPPED: 'bg-blue-50 text-blue-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-600',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-content tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-muted">Monitor your store's performance and recent activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/products/new" className="btn-secondary py-2 px-4 text-xs font-semibold shadow-sm">
            Add Product
          </Link>
        </div>
      </div>

      {/* ── STAT CARDS (Stripe Style) ───────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          {
            label: 'Gross Revenue',
            value: `₹${stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            trend: '+12.5%',
            isPositive: true
          },
          {
            label: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),
            trend: '+8.2%',
            isPositive: true
          },
          {
            label: 'Active Products',
            value: stats.totalProducts.toLocaleString(),
            trend: 'Stable',
            isPositive: true
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">{stat.label}</p>
            <div className="mt-3 flex items-baseline gap-3">
              <p className="font-display text-3xl font-bold text-content">{stat.value}</p>
              <span className={`text-xs font-medium ${stat.isPositive ? 'text-green-600' : 'text-muted'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        
        {/* ── RECENT ORDERS TABLE ───────────────────────────────────────── */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-background/50 px-6 py-4">
              <h2 className="font-medium text-content">Recent Orders</h2>
              <Link href="/dashboard/orders" className="text-xs font-semibold text-brass hover:underline">
                View all
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[10px] font-bold uppercase tracking-widest text-muted">
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="transition-colors hover:bg-background/50">
                      <td className="px-6 py-4 font-medium text-content">{order.user.name}</td>
                      <td className="px-6 py-4 font-mono text-muted text-xs">
                        ₹{Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColors[order.fulfilmentStatus] ?? 'bg-stone-100 text-stone-500'}`}>
                          {order.fulfilmentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-medium text-muted">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                  {stats.recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm text-muted">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── TOP PRODUCTS LIST ─────────────────────────────────────────── */}
        <div>
          <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-background/50 px-6 py-4">
              <h2 className="font-medium text-content">Top Products</h2>
              <Link href="/dashboard/products" className="text-xs font-semibold text-brass hover:underline">
                Manage
              </Link>
            </div>
            
            <ul className="divide-y divide-border">
              {stats.topProducts.map((tp, idx) => (
                <li key={tp.productId} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-background/50">
                  <span className="font-mono text-xs font-bold text-muted">0{idx + 1}</span>
                  {tp.product?.imageUrl && (
                    <img src={tp.product.imageUrl} alt={tp.product.name} className="h-10 w-10 rounded-lg border border-border object-cover bg-background" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-content">
                      {tp.product?.name ?? 'Unknown'}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{tp._sum.quantity} units sold</p>
                  </div>
                </li>
              ))}
              {stats.topProducts.length === 0 && (
                <li className="px-6 py-12 text-center text-sm text-muted">No sales data yet</li>
              )}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

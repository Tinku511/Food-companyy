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
  PROCESSING: 'bg-brass/10 text-brass border border-brass/20',
  SHIPPED: 'bg-blue-50 text-blue-700 border border-blue-200',
  DELIVERED: 'bg-green-50 text-green-700 border border-green-200',
  CANCELLED: 'bg-plum/10 text-plum border border-plum/20',
};

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-brass">Admin</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-charcoal">Sales Overview</h1>
        <p className="mt-1 text-sm text-stone-500">Welcome back! Here's what's happening in your store today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          {
            label: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            iconBg: 'bg-stone-100',
            textColor: 'text-charcoal',
          },
          {
            label: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            ),
            iconBg: 'bg-stone-100',
            textColor: 'text-charcoal',
          },
          {
            label: 'Active Products',
            value: stats.totalProducts.toLocaleString(),
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            ),
            iconBg: 'bg-stone-100',
            textColor: 'text-charcoal',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 border-b border-stone-200 bg-transparent py-5"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white ${stat.textColor}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest">{stat.label}</p>
              <p className={`mt-0.5 font-display text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Recent Orders */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-charcoal">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-xs font-semibold text-brass hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto border-t border-stone-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-stone-200 bg-transparent text-left text-xs font-semibold uppercase tracking-widest text-stone-500">
                  <th className="px-2 py-4">Customer</th>
                  <th className="px-2 py-4">Amount</th>
                  <th className="px-2 py-4">Status</th>
                  <th className="px-2 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-stone-50/50">
                    <td className="px-2 py-4 font-medium text-charcoal">{order.user.name}</td>
                    <td className="px-2 py-4 text-stone-600 font-mono">₹{Number(order.totalAmount).toFixed(2)}</td>
                    <td className="px-2 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-bold ${statusColors[order.fulfilmentStatus] ?? 'bg-stone-100 text-stone-500'}`}>
                        {order.fulfilmentStatus}
                      </span>
                    </td>
                    <td className="px-2 py-4 text-stone-400 text-right font-mono text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-stone-400">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-charcoal">Top Products</h2>
            <Link href="/dashboard/products" className="text-xs font-semibold text-brass hover:underline">
              Manage →
            </Link>
          </div>
          <div className="border-t border-stone-200">
            <ul className="divide-y divide-stone-100">
              {stats.topProducts.map((tp, idx) => (
                <li key={tp.productId} className="flex items-center gap-4 py-4 transition hover:bg-stone-50/50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center font-mono text-[10px] font-bold text-stone-400">
                    0{idx + 1}
                  </span>
                  {tp.product?.imageUrl && (
                    <img src={tp.product.imageUrl} alt={tp.product.name} className="h-10 w-10 rounded-md border border-stone-200 object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-charcoal">{tp.product?.name ?? 'Unknown'}</p>
                    <p className="text-xs text-stone-500">{tp._sum.quantity} units sold</p>
                  </div>
                </li>
              ))}
              {stats.topProducts.length === 0 && (
                <li className="py-8 text-center text-sm text-stone-400">No sales data yet</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

type Order = {
  id: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
  fulfilmentStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: { quantity: number; product: { name: string; imageUrl: string } }[];
};

type Tab = 'orders' | 'profile' | 'addresses' | 'wishlist' | 'settings';

export default function CustomerDashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Keep existing fetch logic intact
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

  const statusStyles = {
    PROCESSING: 'bg-brass/10 text-brass border-brass/20',
    SHIPPED: 'bg-blue-50 text-blue-700 border-blue-200',
    DELIVERED: 'bg-green-50 text-green-700 border-green-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  };

  const menuItems = [
    { id: 'orders', label: 'Your Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'addresses', label: 'Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'wishlist', label: 'Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ] as const;

  return (
    <div className="min-h-screen bg-background pb-32 pt-12 lg:pt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="font-display text-4xl font-light text-content lg:text-5xl">Your Account</h1>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* ─── LEFT: MODERN SIDEBAR ──────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 rounded-[2rem] border border-border bg-surface p-6 shadow-sm">
              
              {/* Profile Summary */}
              <div className="mb-8 flex items-center gap-4 border-b border-border pb-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brass text-xl font-bold text-white shadow-md shadow-brass/30">
                  {session?.user?.name?.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden">
                  <h3 className="truncate font-display text-lg font-medium text-content">{session?.user?.name || 'Customer'}</h3>
                  <p className="truncate text-sm text-muted">{session?.user?.email || 'customer@example.com'}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-2">
                {menuItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-background text-brass shadow-inner' 
                          : 'text-muted hover:bg-background hover:text-content'
                      }`}
                    >
                      <svg className={`h-5 w-5 ${isActive ? 'text-brass' : 'text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                      {item.label}
                    </button>
                  );
                })}
              </nav>

            </div>
          </div>

          {/* ─── RIGHT: DYNAMIC CONTENT ────────────────────────────────────── */}
          <div className="lg:col-span-9">
            
            {/* ORDERS TAB (Functional) */}
            {activeTab === 'orders' && (
              <div className="animate-fade-in">
                <h2 className="mb-8 font-display text-2xl font-light text-content">Order History</h2>
                
                {loading ? (
                  <div className="flex h-64 items-center justify-center rounded-[2rem] border border-border bg-surface">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border bg-surface py-24 text-center">
                    <svg className="mb-6 h-16 w-16 text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="font-display text-2xl font-light text-content">No orders yet</h3>
                    <p className="mt-2 text-muted">When you place an order, it will appear here.</p>
                    <Link href="/products" className="btn-secondary mt-8">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    {orders.map((order) => (
                      <div key={order.id} className="overflow-hidden rounded-[2rem] border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
                        
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-border bg-background/50 p-6 sm:px-8">
                          <div className="flex flex-wrap gap-8 text-sm">
                            <div>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Order Placed</p>
                              <p className="font-medium text-content">
                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            <div>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Total</p>
                              <p className="font-medium text-content">₹{Number(order.totalAmount).toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Order #</p>
                              <p className="font-mono font-medium text-content">{order.id.split('-')[0]}</p>
                            </div>
                          </div>
                          
                          <Link
                            href={`/track?id=${order.id}`}
                            className="btn-secondary px-5 py-2.5 text-xs shadow-sm"
                          >
                            Track Package
                          </Link>
                        </div>

                        {/* Order Body */}
                        <div className="p-6 sm:px-8">
                          <div className="mb-6 flex items-center gap-3">
                            <h4 className="font-display text-lg font-medium text-content">Status</h4>
                            <span className={`rounded-full border px-3 py-1 text-xs font-bold tracking-wider ${statusStyles[order.fulfilmentStatus]}`}>
                              {order.fulfilmentStatus}
                            </span>
                          </div>

                          <div className="flex flex-col gap-6">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-6">
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-background sm:h-24 sm:w-24">
                                  <Image
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <Link href={`/products`} className="line-clamp-2 font-display text-lg font-medium text-content transition-colors hover:text-brass">
                                    {item.product.name}
                                  </Link>
                                  <p className="mt-1 text-sm text-muted">Quantity: {item.quantity}</p>
                                  
                                  <div className="mt-3 flex gap-3">
                                    <button className="text-sm font-semibold text-brass hover:underline">Buy it again</button>
                                    <span className="text-border">|</span>
                                    <button className="text-sm font-medium text-muted hover:text-content">Write a review</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB (Visual Only) */}
            {activeTab === 'profile' && (
              <div className="animate-fade-in">
                <h2 className="mb-8 font-display text-2xl font-light text-content">Profile Information</h2>
                <div className="rounded-[2rem] border border-border bg-surface p-8 shadow-sm">
                  <div className="grid max-w-xl gap-8">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Full Name</label>
                      <p className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-content">
                        {session?.user?.name || 'Customer Name'}
                      </p>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Email Address</label>
                      <p className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-content">
                        {session?.user?.email || 'customer@example.com'}
                      </p>
                    </div>
                    <button className="btn-secondary w-fit px-8">Edit Profile</button>
                  </div>
                </div>
              </div>
            )}

            {/* ADDRESSES TAB (Visual Only) */}
            {activeTab === 'addresses' && (
              <div className="animate-fade-in">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="font-display text-2xl font-light text-content">Your Addresses</h2>
                  <button className="btn-secondary px-6">Add New</button>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Default Address Mock */}
                  <div className="relative rounded-[2rem] border-2 border-brass bg-surface p-8 shadow-sm">
                    <span className="absolute right-6 top-6 rounded-full bg-brass/10 px-3 py-1 text-xs font-bold text-brass">Default</span>
                    <h3 className="mb-2 font-display text-lg font-medium text-content">{session?.user?.name || 'Customer Name'}</h3>
                    <div className="space-y-1 text-sm text-muted">
                      <p>123 Luxury Avenue, Suite 400</p>
                      <p>Mumbai, Maharashtra 400001</p>
                      <p>India</p>
                      <p className="pt-2">Phone: +91 98765 43210</p>
                    </div>
                    <div className="mt-6 flex gap-4">
                      <button className="text-sm font-semibold text-brass hover:underline">Edit</button>
                      <button className="text-sm font-medium text-red-500 hover:underline">Remove</button>
                    </div>
                  </div>

                  {/* Add New Mock */}
                  <button className="flex min-h-[250px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-border bg-surface transition-colors hover:bg-background">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-muted">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="font-medium text-content">Add New Address</span>
                  </button>
                </div>
              </div>
            )}

            {/* WISHLIST TAB (Visual Only) */}
            {activeTab === 'wishlist' && (
              <div className="animate-fade-in">
                <h2 className="mb-8 font-display text-2xl font-light text-content">Your Wishlist</h2>
                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border bg-surface py-24 text-center">
                  <svg className="mb-6 h-16 w-16 text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="font-display text-2xl font-light text-content">Your wishlist is empty</h3>
                  <p className="mt-2 text-muted">Save items you love to view them later.</p>
                  <Link href="/products" className="btn-secondary mt-8">Explore Products</Link>
                </div>
              </div>
            )}

            {/* SETTINGS TAB (Visual Only) */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in">
                <h2 className="mb-8 font-display text-2xl font-light text-content">Account Settings</h2>
                <div className="rounded-[2rem] border border-border bg-surface p-8 shadow-sm">
                  
                  <div className="mb-8 pb-8 border-b border-border">
                    <h3 className="font-display text-lg font-medium text-content mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="font-medium text-content text-sm">Order Updates</p>
                          <p className="text-xs text-muted">Receive tracking and delivery updates.</p>
                        </div>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-brass">
                          <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition" />
                        </div>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="font-medium text-content text-sm">Promotions & Offers</p>
                          <p className="text-xs text-muted">Get notified about exclusive sales.</p>
                        </div>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-stone-300">
                          <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white transition" />
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-medium text-content mb-4">Security</h3>
                    <button className="btn-secondary text-sm">Change Password</button>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

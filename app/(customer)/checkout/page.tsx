'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, cartTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
          <svg className="h-10 w-10 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.293 1.293A1 1 0 006 15h12M9 19a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">Nothing to checkout</h2>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      router.push('/login?callbackUrl=/checkout');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load Razorpay script');

      const shippingAddress = `${form.fullName}, ${form.address}, ${form.city}, ${form.state} - ${form.pincode}, Ph: ${form.phone}`;

      // Step 1: Create an order on the backend
      const orderRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress, notes: form.notes }),
      });

      if (!orderRes.ok) {
        const data = await orderRes.json();
        throw new Error(data.message || 'Failed to create order');
      }

      const { razorpayOrderId, amount, currency, orderId } = await orderRes.json();

      // Step 2: Open Razorpay Checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'SesemeFoods',
        description: 'Fresh, natural food delivered to your door',
        image: '/favicon.ico',
        order_id: razorpayOrderId,
        prefill: {
          name: session.user.name || form.fullName,
          email: session.user.email || '',
          contact: form.phone,
        },
        theme: { color: '#B8860B' },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          // Step 3: Verify the signature on the backend
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            }),
          });

          if (verifyRes.ok) {
            clearCart();
            router.push(`/checkout/success?orderId=${orderId}`);
          } else {
            const data = await verifyRes.json();
            setError(data.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* ── Step Progress Header ─────────────────────────── */}
      <div className="mb-12">
        {/* Step indicator */}
        <div className="mb-10 flex items-center justify-center gap-4">
          <Link href="/cart" className="flex items-center gap-2 group">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400 group-hover:text-brass transition-colors">Cart</span>
          </Link>
          <div className="h-px w-8 bg-stone-300" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-charcoal">Details & Payment</span>
          </div>
        </div>

        {/* Page title */}
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-foreground">Shipping Details</h1>
          <p className="mt-2 text-stone-500">Fill in your address, then we&apos;ll take you to payment</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-xl border border-plum/20 bg-plum/10 p-4 text-sm font-medium text-plum">
          {error}
        </div>
      )}


      <form onSubmit={handleCheckout}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left — Shipping Form */}
          <div className="space-y-8 lg:col-span-7">
            {/* Shipping Address Card */}
            <div className="card p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brass/10 text-sm font-bold text-brass">1</span>
                <h2 className="font-display text-xl font-bold text-foreground">Shipping Information</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-stone-700">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="form-input"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-stone-700">Street Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, Apartment 4B"
                    className="form-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-stone-700">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="mb-1.5 block text-sm font-medium text-stone-700">State</label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      required
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pincode" className="mb-1.5 block text-sm font-medium text-stone-700">Pincode</label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      required
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-stone-700">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-stone-700">Order Notes <span className="text-stone-400">(optional)</span></label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Special delivery instructions..."
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Indicator */}
            <div className="card p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brass/10 text-sm font-bold text-brass">2</span>
                <h2 className="font-display text-xl font-bold text-foreground">Secure Payment</h2>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed max-w-md">
                Your payment will be processed securely through Razorpay. All major UPI, Credit/Debit cards, and Net Banking methods are accepted. 
              </p>
              <div className="mt-4 flex items-center gap-1.5 opacity-60">
                <svg className="h-4 w-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs font-medium text-stone-500">256-bit SSL Encrypted</span>
              </div>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 card p-6 sm:p-8">
              <h2 className="mb-6 font-display text-xl font-bold text-foreground">Order Summary</h2>

              <ul className="mb-6 divide-y divide-stone-200">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brass text-[10px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-stone-500">₹{item.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 border-t border-stone-200 pt-4">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-base shadow-brass/30 transition hover:-translate-y-0.5 hover:shadow-brass/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={1.5}/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Pay ₹{cartTotal.toFixed(2)} Securely
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-stone-400">
                By placing your order you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

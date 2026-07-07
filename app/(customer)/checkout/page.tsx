'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';
import Image from 'next/image';

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
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-background px-4 py-24 text-center">
        <svg className="h-16 w-16 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="font-display text-3xl font-light text-content">Nothing to checkout</h2>
        <p className="max-w-xs text-muted">Your cart is empty. Add some items to proceed.</p>
        <Link href="/products" className="btn-primary mt-4 px-8 py-3">
          Return to Shop
        </Link>
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

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'SesemeFoods',
        description: 'Premium natural food delivered to your door',
        image: '/favicon.ico',
        order_id: razorpayOrderId,
        prefill: {
          name: session.user.name || form.fullName,
          email: session.user.email || '',
          contact: form.phone,
        },
        theme: { color: '#181818' }, // Dark theme color for Razorpay
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
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

  // The explicit input class ensures strict adherence to visibility requirements:
  // Dark text (text-stone-900), Gray placeholder (placeholder-stone-400), 
  // Visible focus border (focus:border-brass focus:ring-2)
  const inputClass = "w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium text-content placeholder-muted outline-none transition-all duration-200 focus:border-brass focus:ring-2 focus:ring-brass/20";
  const labelClass = "mb-2 block text-sm font-semibold uppercase tracking-widest text-content";

  return (
    <div className="min-h-screen bg-background pb-32 pt-12 lg:pt-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        
        {/* ── Modern Step Indicator ─────────────────────────── */}
        <div className="mb-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-4">
            <Link href="/cart" className="group flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted transition-colors group-hover:text-brass">
                Cart
              </span>
            </Link>
            <div className="h-px w-12 bg-border" />
            <span className="text-xs font-bold uppercase tracking-widest text-content">
              Checkout
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-light text-content lg:text-5xl">
            Secure Checkout
          </h1>
        </div>

        {error && (
          <div className="mx-auto mb-12 flex max-w-2xl items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 shadow-sm">
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleCheckout} className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* ── LEFT: SHIPPING FORM ───────────────────────────────────────── */}
          <div className="space-y-8 lg:col-span-7">
            
            {/* Step 1: Shipping */}
            <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-sm sm:p-10">
              <div className="mb-8 flex items-center gap-4 border-b border-border pb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brass text-sm font-bold text-white shadow-md shadow-brass/30">
                  1
                </span>
                <h2 className="font-display text-2xl font-light text-content">
                  Shipping details
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className={labelClass}>Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="address" className={labelClass}>Street Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, Apartment 4B"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className={labelClass}>City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className={labelClass}>State</label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      required
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pincode" className={labelClass}>Pincode</label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      required
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className={labelClass}>
                    Order Notes <span className="text-muted normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Special delivery instructions..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Section */}
            <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-sm sm:p-10">
              <div className="mb-6 flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brass text-sm font-bold text-white shadow-md shadow-brass/30">
                  2
                </span>
                <h2 className="font-display text-2xl font-light text-content">Secure Payment</h2>
              </div>
              
              <div className="rounded-2xl border border-border bg-background p-6">
                <p className="text-sm leading-relaxed text-content">
                  Your payment will be processed securely through <span className="font-semibold text-content">Razorpay</span>. 
                  All major UPI, Credit/Debit cards, and Net Banking methods are accepted.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5 opacity-80">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs font-semibold text-content">256-bit SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-80">
                    <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs font-semibold text-content">PCI-DSS Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: STICKY ORDER SUMMARY ───────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-[2rem] border border-border bg-surface p-6 shadow-xl shadow-stone-200/50 sm:p-8">
              <h2 className="mb-6 font-display text-2xl font-light text-content">Order Summary</h2>

              <ul className="mb-6 divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-background">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-dark text-[10px] font-bold text-white shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-content">{item.name}</p>
                      <p className="text-xs text-muted">₹{item.price.toFixed(2)} each</p>
                    </div>
                    <p className="text-sm font-semibold text-content">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="space-y-4 border-t border-border pt-6 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-content">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span className="font-medium text-success">Free</span>
                </div>
                <div className="flex justify-between border-t border-border pt-4 text-base font-bold text-content">
                  <span>Total</span>
                  <span className="font-display text-2xl font-light">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-dark py-5 text-base font-semibold text-white shadow-xl shadow-dark/20 transition-all hover:-translate-y-1 hover:bg-black hover:shadow-dark/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={1.5} />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing securely...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    Pay ₹{cartTotal.toFixed(2)}
                  </>
                )}
              </button>

              <div className="mt-6 text-center text-[11px] leading-relaxed text-muted">
                By clicking "Pay", you agree to our <Link href="/terms" className="underline hover:text-content">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-content">Privacy Policy</Link>.
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

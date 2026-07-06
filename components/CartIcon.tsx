'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export default function CartIcon() {
  const { cartCount, isLoading } = useCart();

  return (
    <Link
      href="/cart"
      id="navbar-cart-icon"
      aria-label={`Cart (${cartCount} items)`}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg text-stone-300 transition hover:bg-white/10 hover:text-white"
    >
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
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.293 1.293A1 1 0 006 15h12M9 19a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z"
        />
      </svg>
      {!isLoading && cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brass text-[10px] font-bold text-charcoal">
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      )}
    </Link>
  );
}

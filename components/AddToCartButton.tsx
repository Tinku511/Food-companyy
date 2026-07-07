'use client';

import { useState } from 'react';
import type { Product } from '@prisma/client';
import { useCart } from './CartProvider';

interface AddToCartButtonProps {
  product: Pick<Product, 'id' | 'name' | 'price' | 'imageUrl' | 'stock'>;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock === 0;

  const { addToCart, isLoading } = useCart();

  const handleAdd = async () => {
    if (outOfStock || isLoading) return;

    await addToCart(
      {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
      },
      qty,
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Quantity picker */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Quantity</span>
        <div className="flex h-14 w-36 items-center justify-between rounded-full border border-border bg-surface px-2">
          <button
            id="add-to-cart-qty-dec"
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-content transition hover:bg-background disabled:opacity-30"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <span className="w-8 text-center font-display text-lg font-medium text-content">{qty}</span>
          <button
            id="add-to-cart-qty-inc"
            aria-label="Increase quantity"
            disabled={qty >= product.stock}
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-content transition hover:bg-background disabled:opacity-30"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        id="add-to-cart-btn"
        onClick={handleAdd}
        disabled={outOfStock || isLoading}
        aria-label={outOfStock ? 'Out of stock' : `Add ${qty} to cart`}
        className={`relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full py-4 text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 ${
          outOfStock || isLoading
            ? 'cursor-not-allowed bg-stone-200 text-stone-400'
            : added
              ? 'bg-success text-white shadow-lg shadow-success/20'
              : 'bg-dark text-white shadow-xl shadow-dark/20 hover:-translate-y-1 hover:bg-black hover:shadow-dark/40 active:translate-y-0'
        }`}
      >
        {outOfStock ? (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Sold Out
          </>
        ) : added ? (
          <>
            <svg className="h-5 w-5 animate-[scale-in_0.3s_ease-out]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="animate-[fade-in_0.3s_ease-out]">Added to Cart</span>
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {isLoading ? 'Loading...' : 'Add to Bag'}
          </>
        )}
      </button>
    </div>
  );
}

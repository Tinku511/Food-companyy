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
    <div className="flex flex-col gap-4">
      {/* Quantity picker */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-stone-600">Quantity</span>
        <div className="flex items-center overflow-hidden rounded-full border border-stone-200 bg-background">
          <button
            id="add-to-cart-qty-dec"
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center text-stone-600 transition hover:bg-stone-200 disabled:opacity-40"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <span className="w-10 text-center text-sm font-semibold text-charcoal">{qty}</span>
          <button
            id="add-to-cart-qty-inc"
            aria-label="Increase quantity"
            disabled={qty >= product.stock}
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="flex h-9 w-9 items-center justify-center text-stone-600 transition hover:bg-stone-200 disabled:opacity-40"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
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
        className={`relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full py-4 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 ${
          outOfStock || isLoading
            ? 'cursor-not-allowed bg-stone-200 text-stone-400'
            : added
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
              : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-charcoal shadow-lg shadow-brass/30 hover:-translate-y-0.5 hover:shadow-brass/50 active:translate-y-0'
        }`}
      >
        {outOfStock ? (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            Out of Stock
          </>
        ) : added ? (
          <>
            <svg
              className="h-5 w-5 animate-[scale-in_0.3s_ease-out]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="animate-[fade-in_0.3s_ease-out]">Added to Cart</span>
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
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
            {isLoading ? 'Loading...' : 'Add to Cart'}
          </>
        )}
      </button>
    </div>
  );
}

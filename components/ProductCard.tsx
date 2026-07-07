import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@prisma/client';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const price = Number(product.price).toFixed(2);
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock === 0;

  // Generate a consistent pseudo-random rating based on ID for UI purposes
  const rating = 4 + (product.id.charCodeAt(0) % 10) / 10;
  const reviewCount = 20 + (product.id.charCodeAt(1) % 100);

  return (
    <Link
      href={`/products/${product.id}`}
      id={`product-card-${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-surface transition-all duration-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      aria-label={`View ${product.name}`}
    >
      {/* Image Wrapper */}
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-background">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
        />
        
        {/* Subtle gradient overlay for text readability if badges overlap */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {outOfStock ? (
            <span className="rounded-full bg-dark px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="rounded-full bg-warning px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
              Only {product.stock} left
            </span>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1 p-6">
        
        {/* Category & Ratings */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3 text-brass" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium text-muted">{rating.toFixed(1)} <span className="text-muted/60">({reviewCount})</span></span>
          </div>
        </div>

        <h3 className="mt-2 line-clamp-1 font-display text-xl font-light text-content transition-colors group-hover:text-brass">
          {product.name}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
          {product.description}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <span className="font-display text-2xl font-light tracking-tight text-content">
            ₹{price}
          </span>
          
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-content transition-colors group-hover:bg-brass group-hover:text-white">
            <svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>

      </div>
    </Link>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@prisma/client';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

// Category colour map
const categoryColors: Record<string, string> = {
  Snacks: 'bg-orange-100 text-orange-700',
  Beverages: 'bg-blue-100 text-blue-700',
  Dairy: 'bg-brass/10 text-brass',
  Bakery: 'bg-amber-100 text-amber-700',
};

function categoryColor(cat: string) {
  return categoryColors[cat] ?? 'bg-stone-100 text-stone-600';
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const price = Number(product.price).toFixed(2);
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product.id}`}
      id={`product-card-${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      aria-label={`View ${product.name}`}
    >
      {/* Image */}
      <div className="relative m-2 mx-auto mt-2 aspect-square w-full max-w-[calc(100%-1rem)] shrink-0 overflow-hidden rounded-2xl bg-background">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
        />
        {/* Category badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-0.5 text-xs font-semibold ${categoryColor(product.category)}`}
        >
          {product.category}
        </span>
        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-stone-900 px-4 py-1.5 text-xs font-semibold text-white">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-charcoal transition-colors group-hover:text-brass">
          {product.name}
        </h3>
        <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-stone-500">
          {product.description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-charcoal">${price}</span>
          {isLowStock && (
            <span className="text-[11px] font-medium text-red-500">Only {product.stock} left!</span>
          )}
          {!outOfStock && !isLowStock && (
            <span className="text-[11px] font-medium text-green-600">In Stock</span>
          )}
        </div>

        {/* CTA arrow */}
        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brass transition-all duration-200 group-hover:gap-2.5">
          View Product
          <svg
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

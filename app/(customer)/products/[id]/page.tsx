import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AddToCartButton from '@/components/AddToCartButton';

// ─── SEO ─────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) return { title: 'Product Not Found — SesemeFoods' };
    return {
      title: `${product.name} — SesemeFoods`,
      description: product.description.slice(0, 155),
    };
  } catch {
    return { title: 'SesemeFoods' };
  }
}

// ─── Category badge colours ───────────────────────────────────────────────────
const categoryColors: Record<string, { pill: string; icon: string }> = {
  Snacks: { pill: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🍿' },
  Beverages: { pill: 'bg-blue-100   text-blue-700   border-blue-200', icon: '🥤' },
  Dairy: { pill: 'bg-brass/10 text-brass border-brass/20', icon: '🧀' },
  Bakery: { pill: 'bg-amber-100  text-amber-700  border-amber-200', icon: '🍞' },
};

function getCategoryMeta(cat: string) {
  return (
    categoryColors[cat] ?? { pill: 'bg-stone-100 text-stone-600 border-stone-200', icon: '🛒' }
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  let product;
  try {
    product = await prisma.product.findUnique({ where: { id: params.id } });
  } catch {
    product = null;
  }

  if (!product || !product.isActive) notFound();

  const price = Number(product.price).toFixed(2);
  const catMeta = getCategoryMeta(product.category);
  const inStock = product.stock > 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-stone-500" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-brass">
              Home
            </Link>
            <span className="text-stone-300">/</span>
            <Link href="/products" className="transition hover:text-brass">
              Products
            </Link>
            <span className="text-stone-300">/</span>
            <span className="line-clamp-1 font-medium text-charcoal">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* ── Left: Image ─────────────────────────────────────────── */}
          <div className="animate-scale-in">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-white shadow-xl">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {!inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="rounded-full bg-stone-900 px-6 py-2 text-sm font-semibold text-white">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail strip placeholder (expandable in future) */}
            <div className="mt-4 flex gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 bg-stone-100 ${i === 1 ? 'border-brass' : 'border-stone-200 opacity-50'}`}
                >
                  <Image
                    src={product.imageUrl}
                    alt={`${product.name} thumbnail ${i}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Details ───────────────────────────────────────── */}
          <div className="flex animate-slide-up flex-col gap-6">
            {/* Category + stock badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${catMeta.pill}`}
              >
                {catMeta.icon} {product.category}
              </span>
              {inStock ? (
                isLowStock ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                    Only {product.stock} left!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    In Stock ({product.stock} available)
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Product name */}
            <h1 className="text-balance text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl font-bold text-charcoal">${price}</span>
              <span className="text-sm text-stone-400">per unit · free shipping over $50</span>
            </div>

            {/* Divider */}
            <hr className="border-stone-200" />

            {/* Description */}
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-400">
                About this product
              </h2>
              <p className="text-base leading-relaxed text-stone-600">{product.description}</p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl bg-background p-4">
              {[
                { icon: '🌿', label: '100% Natural' },
                { icon: '🚚', label: 'Fast Delivery' },
                { icon: '🔒', label: 'Secure Payment' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <span className="text-xl">{icon}</span>
                  <span className="text-[11px] font-medium text-stone-600">{label}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <hr className="border-stone-200" />

            {/* Add to cart (client component) */}
            <AddToCartButton product={{ ...product, price: Number(product.price) } as any} />

            {/* Back link */}
            <Link
              href="/products"
              id="product-detail-back"
              className="inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-brass"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to all products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

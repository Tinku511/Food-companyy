import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';

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

// ─── Data Fetching ────────────────────────────────────────────────────────────
async function getProductAndRelated(id: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || !product.isActive) return { product: null, related: [] };

    const related = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
    });

    return { product, related };
  } catch {
    return { product: null, related: [] };
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { product, related } = await getProductAndRelated(params.id);

  if (!product) notFound();

  const price = Number(product.price).toFixed(2);
  const inStock = product.stock > 0;
  
  // Fake rating logic for UI purposes
  const rating = 4.5 + (product.id.charCodeAt(0) % 5) / 10;
  const reviewCount = 120 + (product.id.charCodeAt(1) % 100);

  return (
    <div className="min-h-screen bg-background">
      
      {/* ─── BREADCRUMB ──────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] text-muted" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-charcoal">Home</Link>
            <span className="text-border">/</span>
            <Link href="/products" className="transition hover:text-charcoal">Products</Link>
            <span className="text-border">/</span>
            <Link href={`/products?category=${product.category}`} className="transition hover:text-charcoal">{product.category}</Link>
            <span className="text-border">/</span>
            <span className="line-clamp-1 text-content">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ─── MAIN PRODUCT SECTION ────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-24">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="w-full lg:w-[55%]">
            <div className="group relative aspect-square w-full overflow-hidden rounded-[2rem] bg-surface">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.15]"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
              {!inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <span className="rounded-full bg-dark px-8 py-3 font-display text-lg font-semibold text-white shadow-xl">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails (Static placeholders to match Apple Store feel) */}
            <div className="mt-6 flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer ${i === 1 ? 'border-brass' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image
                    src={product.imageUrl}
                    alt={`${product.name} view ${i}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: STICKY PRODUCT INFO */}
          <div className="w-full lg:sticky lg:top-32 lg:w-[45%] lg:pb-24">
            
            {/* Category & Ratings */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
                {product.category}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex text-brass">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`h-4 w-4 ${star <= Math.floor(rating) ? 'text-brass' : 'text-border'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-muted">
                  {rating.toFixed(1)} <span className="underline decoration-border underline-offset-4 hover:text-content cursor-pointer">({reviewCount} reviews)</span>
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-balance font-display text-4xl font-light leading-tight text-content lg:text-5xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-8 flex items-end gap-4">
              <span className="font-display text-5xl font-light tracking-tight text-content">
                ₹{price}
              </span>
              <span className="mb-2 text-sm text-muted">Incl. of all taxes</span>
            </div>

            {/* Divider */}
            <hr className="my-10 border-border" />

            {/* Add to Cart */}
            <AddToCartButton product={{ ...product, price: Number(product.price) } as any} />

            {/* Description */}
            <div className="mt-12">
              <h2 className="mb-4 font-display text-2xl font-light text-content">Overview</h2>
              <p className="text-base leading-relaxed text-muted">
                {product.description}
              </p>
            </div>

            {/* Trust & Logistics */}
            <div className="mt-12 flex flex-col gap-6 rounded-2xl bg-surface p-6">
              
              <div className="flex items-start gap-4">
                <svg className="mt-0.5 h-6 w-6 shrink-0 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <div>
                  <h4 className="font-semibold text-content">Free Next-Day Delivery</h4>
                  <p className="mt-1 text-sm text-muted">Order within the next 4 hours for dispatch today.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <svg className="mt-0.5 h-6 w-6 shrink-0 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-content">Freshness Guarantee</h4>
                  <p className="mt-1 text-sm text-muted">If it's not fresh, we'll replace it within 24 hours.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ─── STATIC REVIEWS SECTION ────────────────────────────────────── */}
      <div className="border-t border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 flex flex-col items-center justify-between gap-6 sm:flex-row">
            <h2 className="font-display text-4xl font-light text-content">Customer Reviews</h2>
            <button className="btn-secondary px-6 py-3 text-sm">Write a Review</button>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Absolutely delicious!", name: "Sarah J.", text: "The quality is unmatched. You can really taste the difference compared to supermarket brands. Will definitely be ordering again!" },
              { title: "Fresh and well-packaged", name: "Michael T.", text: "Arrived the next day in perfect condition. The packaging is minimal but very effective. Highly recommend." },
              { title: "A new staple in my kitchen", name: "Elena R.", text: "I've replaced all my previous brands with this. The flavor profile is just incredible." },
            ].map((review, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="flex text-brass">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <h4 className="font-semibold text-content">{review.title}</h4>
                <p className="text-sm leading-relaxed text-muted">{review.text}</p>
                <span className="text-xs font-medium text-muted/60">— {review.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── RELATED PRODUCTS ──────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="border-t border-border bg-background py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="mb-16 text-center font-display text-4xl font-light tracking-tight text-content lg:text-5xl">
              You Might Also Like
            </h2>
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={{ ...item, price: Number(item.price) } as any} />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

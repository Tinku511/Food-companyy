import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'SesemeFoods — Farm-Fresh Natural Foods',
  description:
    'Discover the finest natural, farm-to-table food products. Shop snacks, beverages, dairy, and bakery items crafted with care.',
};

// ─── Data fetching ───────────────────────────────────────────────────────────
async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });
  } catch {
    return [];
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────
const features = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.71.71M18.36 5.64l.71-.71M1 12h1m20 0h1M4.22 19.78l.71-.71M18.36 18.36l.71.71M12 7a5 5 0 000 10 5 5 0 000-10z" />
      </svg>
    ),
    title: '100% Natural',
    desc: 'No artificial preservatives. Honest, whole ingredients.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0121 11.414V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
    title: 'Fast Delivery',
    desc: 'Shipped within 24 hours. Freshness guaranteed.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Quality Assured',
    desc: 'Rigorously tested. Only the finest leaves our farm.',
  },
];

const categories = [
  {
    name: 'Snacks',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&q=80',
    desc: 'Guilt-free munching',
  },
  {
    name: 'Beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
    desc: 'Refresh naturally',
  },
  {
    name: 'Dairy',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80',
    desc: 'Farm-fresh milk',
  },
  {
    name: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    desc: 'Baked every morning',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div className="bg-background">
      {/* ─── HERO (Editorial Split) ────────────────────────────────── */}
      <section className="relative mx-auto flex min-h-[90vh] max-w-[1600px] flex-col items-center justify-between px-6 py-20 lg:flex-row lg:px-12 xl:px-24">
        <div className="z-10 flex w-full flex-col justify-center lg:w-1/2 lg:pr-12 xl:pr-24">
          <span className="mb-8 inline-block font-sans text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Est. 2024 • Organic
          </span>
          <h1 className="text-balance font-display text-6xl font-light leading-[1.05] tracking-tight text-content sm:text-7xl lg:text-8xl">
            Pure food. <br />
            <span className="italic text-brass">Honest roots.</span>
          </h1>
          <p className="mt-8 max-w-lg text-balance text-lg leading-relaxed text-muted sm:text-xl">
            We believe in the power of natural, farm-sourced ingredients. Discover a curated selection of whole foods crafted to nourish your body and elevate your daily rituals.
          </p>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link href="/products" className="btn-primary px-8 py-4 text-base">
              Shop Collection
            </Link>
            <Link href="/about" className="btn-secondary px-8 py-4 text-base">
              Our Story
            </Link>
          </div>
        </div>
        
        <div className="relative mt-16 flex w-full justify-center lg:mt-0 lg:w-1/2 lg:justify-end">
          <div className="relative h-[60vh] w-full max-w-[600px] overflow-hidden rounded-[2rem] lg:h-[80vh]">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80"
              alt="Farm fresh produce"
              fill
              className="object-cover transition-transform duration-[20s] hover:scale-110"
              priority
            />
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS (Minimal Grid) ──────────────────────── */}
      <section className="bg-surface py-32" aria-label="Featured products">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl font-light tracking-tight text-content sm:text-5xl">
                Curated Selection
              </h2>
              <p className="mt-4 text-lg text-muted">
                Seasonal highlights and customer favorites, hand-picked for you.
              </p>
            </div>
            <Link href="/products" className="group inline-flex items-center gap-2 font-semibold text-brass transition-colors hover:text-brass-hover">
              View All
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-muted">No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── CATEGORIES (Editorial Masonry-ish) ────────────────────── */}
      <section className="py-32" aria-label="Product categories">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="font-display text-4xl font-light tracking-tight text-content sm:text-5xl">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                href={`/products?category=${cat.name}`}
                className={`group relative overflow-hidden rounded-[2rem] bg-surface ${i % 3 === 0 ? 'md:col-span-2 md:h-[600px]' : 'h-[400px]'}`}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-dark/20 transition-opacity duration-300 group-hover:bg-dark/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="font-display text-4xl font-light text-white md:text-5xl">{cat.name}</h3>
                  <p className="mt-4 translate-y-4 text-lg text-white/90 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EDITORIAL PULL-QUOTE / WHY CHOOSE US ──────────────────── */}
      <section className="bg-dark py-32 text-center text-white sm:py-40" aria-label="Philosophy">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <svg className="mx-auto mb-8 h-12 w-12 text-brass opacity-50" fill="currentColor" viewBox="0 0 32 32">
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
          <p className="text-balance font-display text-3xl font-light leading-relaxed sm:text-5xl lg:leading-snug">
            "From the soil to your table, we maintain absolute transparency and strict standards. We partner exclusively with sustainable farms that share our vision for a healthier future."
          </p>
          
          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-brass">
                  {f.icon}
                </div>
                <h3 className="font-sans text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-white/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MINIMAL CTA ──────────────────────────────────────────────── */}
      <section className="bg-surface py-32 text-center" aria-label="Call to action">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-4xl font-light tracking-tight text-content sm:text-5xl">
            Taste the difference.
          </h2>
          <p className="mt-6 text-lg text-muted">
            Join thousands of happy customers who trust SesemeFoods for their daily nutrition.
          </p>
          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/products" className="btn-primary px-10 py-4 text-base">
              Start Shopping
            </Link>
            <Link href="/contact" className="btn-secondary px-10 py-4 text-base">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

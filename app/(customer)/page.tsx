import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import Divider from '@/components/Divider';

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
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1M4.22 4.22l.71.71M18.36 5.64l.71-.71M1 12h1m20 0h1M4.22 19.78l.71-.71M18.36 18.36l.71.71M12 7a5 5 0 000 10 5 5 0 000-10z"
        />
      </svg>
    ),
    title: '100% Natural',
    desc: 'No artificial preservatives or additives. Every product is made with real, whole ingredients you can trust.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0121 11.414V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
        />
      </svg>
    ),
    title: 'Fast Delivery',
    desc: 'Orders shipped within 24 hours. Enjoy freshness at your door, every time — backed by our freshness guarantee.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: 'Quality Assured',
    desc: 'Every batch is tested and certified. Our rigorous standards ensure you receive only the best in every package.',
  },
];

const categories = [
  {
    name: 'Snacks',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80',
    desc: 'Healthy guilt-free munching',
  },
  {
    name: 'Beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80',
    desc: 'Refresh with natural goodness',
  },
  {
    name: 'Dairy',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&q=80',
    desc: 'Farm-fresh dairy products',
  },
  {
    name: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
    desc: 'Freshly baked every morning',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* ─── HERO (Editorial Asymmetric) ────────────────────────────────── */}
      <section
        id="hero"
        className="relative flex min-h-[90vh] animate-fade-in items-stretch"
        aria-label="Hero banner"
      >
        <div className="flex w-full flex-col lg:flex-row">
          {/* Left: Copy */}
          <div className="flex w-full flex-col justify-center bg-background px-6 py-20 lg:w-5/12 lg:px-16 xl:px-24">
            <div className="max-w-xl">
              <span className="mb-6 inline-block font-mono text-xs uppercase tracking-widest text-brass">
                Est. 2024 • Organic & Natural
              </span>
              <h1 className="text-balance font-display text-5xl font-bold leading-[1.1] tracking-tight text-charcoal sm:text-6xl lg:text-7xl">
                Pure food,
                <br />
                honest roots.
              </h1>
              <p className="mt-8 text-balance text-lg leading-relaxed text-stone-600">
                We believe in the power of natural, farm-sourced ingredients. Discover a curated
                selection of whole foods crafted to nourish your body and delight your senses.
              </p>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link href="/products" className="btn-primary">
                  Explore the Collection
                </Link>
                <Link href="/about" className="btn-secondary">
                  Our Philosophy
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Edge-to-edge Image */}
          <div className="relative min-h-[50vh] w-full lg:w-7/12">
            <div className="absolute inset-0 z-10 bg-stone-900/10" />{' '}
            {/* Subtle gradient overlay for mood */}
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80"
              alt="Farm fresh vegetables"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ─── FEATURED PRODUCTS ────────────────────────────────────────── */}
      <section id="featured-products" className="py-12" aria-label="Featured products">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="section-title">Curated Selection</h2>
            <p className="section-subtitle mx-auto">
              Seasonal highlights and customer favorites, hand-picked for you.
            </p>
          </div>

          {featured.length > 0 ? (
            <div className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
              {featured.map((product) => (
                <div
                  key={product.id}
                  className="w-[85vw] shrink-0 snap-start sm:w-[320px] lg:w-[calc(25%-1.125rem)]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="font-serif text-sm italic text-stone-500">
                No products available at the moment.
              </p>
            </div>
          )}

          <div className="mt-16 text-center">
            <Link href="/products" className="btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <Divider />

      {/* ─── CATEGORIES (Editorial Image Blocks) ──────────────────────── */}
      <section id="categories" className="py-12" aria-label="Product categories">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">
              Explore our diverse range of natural offerings, organized for your convenience.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${cat.name}`}
                className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-2xl bg-stone-100"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                <div className="relative z-10 p-6">
                  <h3 className="font-display text-2xl font-bold text-white">{cat.name}</h3>
                  <p className="mt-2 translate-y-2 text-sm text-stone-200 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ─── OUR STORY (Personal Offset Layout) ───────────────────────── */}
      <section id="our-story" className="py-24" aria-label="Our Story">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col items-center lg:flex-row lg:items-start">
            <div className="relative h-[500px] w-full shrink-0 overflow-hidden rounded-3xl shadow-card lg:w-[55%]">
              <Image
                src="https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=1200&q=80"
                alt="Our founder at the farm"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative -mt-20 w-[90%] rounded-3xl border border-stone-100 bg-background p-8 shadow-2xl sm:p-12 lg:-ml-16 lg:mt-24 lg:w-[45%]">
              <span className="font-mono text-xs uppercase tracking-widest text-brass">
                Our Story
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold text-charcoal">
                Rooted in passion, grown with care.
              </h2>
              <p className="mt-6 leading-relaxed text-stone-600">
                It started with a simple belief: food should be honest. We traveled across the
                country connecting directly with farmers who share our obsessive standards for
                natural cultivation.
              </p>
              <p className="mt-4 leading-relaxed text-stone-600">
                Today, every product on our shelves tells a story of sustainable agriculture and
                uncompromised quality. We bring the harvest directly to your table—just as nature
                intended.
              </p>
              <div className="mt-8">
                <span className="font-display text-2xl italic text-brass">Maria Rossi</span>
                <span className="mt-1 block text-xs uppercase tracking-widest text-stone-400">
                  Founder & Curator
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ─── WHY CHOOSE US (Asymmetric Text/Grid) ─────────────────────── */}
      <section id="why-choose-us" className="py-16" aria-label="Why choose SesemeFoods">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <h2 className="section-title">Uncompromising Quality</h2>
              <p className="section-subtitle mt-6">
                From the soil to your table, we maintain absolute transparency and strict standards.
                We partner exclusively with sustainable farms that share our vision for a healthier
                future.
              </p>
              <div className="mt-10">
                <Image
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80"
                  alt="Farmer holding fresh produce"
                  width={600}
                  height={400}
                  className="rounded-3xl object-cover shadow-card"
                />
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <div className="flex flex-col gap-12">
                {features.map((f, i) => (
                  <div key={f.title} className="flex gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brass/30 bg-background text-brass">
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-charcoal">{f.title}</h3>
                      <p className="mt-2 text-base leading-relaxed text-stone-600">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────────────────── */}
      <section
        id="cta-banner"
        className="relative mt-20 bg-charcoal py-32 text-center"
        aria-label="Call to action"
      >
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=2000&q=80"
            alt="Kitchen background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-charcoal" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl px-4">
          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Taste the difference today.
          </h2>
          <p className="mt-4 text-lg text-stone-300">
            Join 50,000+ happy customers who trust SesemeFoods for their daily nutrition.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              id="cta-shop-now"
              className="btn-primary px-10 py-4 text-base shadow-brand-lg"
            >
              Start Shopping
            </Link>
            <Link href="/contact" id="cta-contact" className="btn-ghost px-10 py-4 text-base">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

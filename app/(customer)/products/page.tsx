import type { Metadata } from 'next';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';

export const metadata: Metadata = {
  title: 'All Products — SesemeFoods',
  description:
    'Browse our full range of natural, farm-fresh food products. Filter by category to find snacks, beverages, dairy, and bakery items.',
};

interface ProductsPageProps {
  searchParams: { category?: string };
}

async function getProducts(category?: string) {
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

async function getAllCategories(): Promise<string[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return rows.map((r) => r.category);
  } catch {
    return [];
  }
}

// ─── Loading Skeletons ───────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[2rem] bg-surface">
      <div className="skeleton aspect-[4/5] w-full bg-stone-200" />
      <div className="flex flex-col gap-3 p-6">
        <div className="skeleton h-3 w-1/4 rounded bg-stone-200" />
        <div className="skeleton h-6 w-3/4 rounded bg-stone-200" />
        <div className="skeleton h-4 w-full rounded bg-stone-200" />
        <div className="skeleton mt-4 h-8 w-1/3 rounded bg-stone-200" />
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Product grid inner (async) ───────────────────────────────────────────────
async function ProductGrid({ category }: { category?: string }) {
  const products = await getProducts(category);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border py-32 text-center">
        <svg className="h-12 w-12 text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="mt-6 font-display text-2xl font-light text-content">No products found</h3>
        <p className="mt-2 text-muted">
          {category
            ? `We couldn't find any "${category}" right now.`
            : 'Our shelves are currently empty. Check back soon.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-slide-up opacity-0"
          style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
        >
          <ProductCard
            product={{ ...product, price: Number(product.price) } as any}
            priority={i < 4}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams.category;
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen bg-background pb-32">
      
      {/* ─── HEADER ──────────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-surface py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            {category && (
              <span className="mb-4 block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Category
              </span>
            )}
            <h1 className="font-display text-5xl font-light tracking-tight text-content lg:text-7xl">
              {category ? category : 'The Collection'}
            </h1>
            <p className="mt-6 text-lg text-muted">
              {category
                ? `Explore our handpicked selection of premium natural ${category.toLowerCase()}.`
                : 'Discover our full range of farm-fresh natural foods, crafted to nourish your body and elevate your daily rituals.'}
            </p>
          </div>
        </div>
      </div>

      {/* ─── 2-COLUMN LAYOUT ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 pt-16 lg:px-8 lg:pt-24">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          
          {/* LEFT: STICKY SIDEBAR */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="sticky top-32">
              <h2 className="mb-6 font-display text-xl font-light text-content">Categories</h2>
              <Suspense fallback={<div className="h-40 w-full animate-pulse rounded bg-stone-200" />}>
                <CategoryFilter categories={categories} />
              </Suspense>
            </div>
          </aside>

          {/* RIGHT: PRODUCT GRID */}
          <main className="flex-1">
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-muted">
                {category ? `Showing ${category}` : 'Showing all products'}
              </p>
              {/* Optional secondary filter/sort dropdown could go here in the future */}
            </div>
            
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid category={category} />
            </Suspense>
            
            {/* Fake Visual Pagination / Load More */}
            <div className="mt-20 flex justify-center border-t border-border pt-12">
              <button className="btn-secondary px-8 py-3 text-sm">
                Load More
              </button>
            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
}

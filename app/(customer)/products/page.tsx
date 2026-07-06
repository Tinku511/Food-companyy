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

// ─── Skeleton loader ─────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-card">
      <div className="skeleton h-52 w-full" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="skeleton mt-2 h-5 w-1/3 rounded" />
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
      <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 py-28 text-center">
        <span className="text-5xl">🔍</span>
        <h3 className="mt-4 text-lg font-semibold text-stone-700">No products found</h3>
        <p className="mt-2 text-sm text-stone-500">
          {category
            ? `No "${category}" products available right now. Try a different category.`
            : 'No products available yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, i) => (
        <div
          key={product.id}
          className={`animate-slide-up`}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <ProductCard
            product={{ ...product, price: Number(product.price) } as any}
            priority={i < 3}
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
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-hero-gradient">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {category ? (
              <>
                <span className="mb-1 block text-2xl font-medium text-stone-400 sm:text-3xl">
                  Category
                </span>
                {category}
              </>
            ) : (
              'All Products'
            )}
          </h1>
          <p className="mt-3 text-stone-400">
            {category
              ? `Browsing ${category} — handpicked natural goods`
              : 'Explore our full range of farm-fresh natural foods'}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Filter row */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-charcoal">Filter by Category</h2>
            <p className="mt-0.5 text-xs text-stone-400">
              {category ? `Showing: ${category}` : 'Showing all products'}
            </p>
          </div>
          <Suspense fallback={<div className="skeleton h-9 w-64 rounded-full" />}>
            <CategoryFilter categories={categories} />
          </Suspense>
        </div>

        {/* Products grid */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid category={category} />
        </Suspense>
      </div>
    </div>
  );
}

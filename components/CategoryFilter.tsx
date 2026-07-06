'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const current      = searchParams.get('category') ?? '';

  const setCategory = useCallback(
    (cat: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (cat) {
        params.set('category', cat);
      } else {
        params.delete('category');
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const pills = [{ label: 'All', value: '' }, ...categories.map((c) => ({ label: c, value: c }))];

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="flex flex-wrap gap-2"
      id="category-filter"
    >
      {pills.map(({ label, value }) => {
        const active = current === value;
        return (
          <button
            key={value || 'all'}
            id={`category-filter-${value || 'all'}`}
            onClick={() => setCategory(value)}
            aria-pressed={active}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-1
              ${active
                ? 'border-brass bg-brass text-charcoal shadow-md shadow-brass/30'
                : 'border-stone-200 bg-white text-stone-600 hover:border-yellow-300 hover:bg-brass/5 hover:text-brass'
              }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

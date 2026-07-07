'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get('category') ?? '';

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
    [router, pathname, searchParams]
  );

  const pills = [{ label: 'All Products', value: '' }, ...categories.map((c) => ({ label: c, value: c }))];

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="flex w-full flex-row gap-6 overflow-x-auto pb-4 lg:flex-col lg:gap-4 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
            className={`whitespace-nowrap pb-2 text-left text-sm transition-all lg:pb-0 lg:pl-4 lg:text-base ${
              active
                ? 'border-b-2 border-brass font-semibold text-content lg:border-b-0 lg:border-l-2'
                : 'border-b-2 border-transparent font-medium text-muted hover:text-content lg:border-b-0 lg:border-l-2'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

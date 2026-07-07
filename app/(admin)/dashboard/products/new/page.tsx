'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
    isActive: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create product');
      }

      router.push('/dashboard/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-6">
        <Link
          href="/dashboard/products"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-brass hover:text-brass shadow-sm"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass">Catalogue</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-content tracking-tight">Add New Product</h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="rounded-[2.5rem] border border-border bg-surface shadow-xl shadow-stone-200/50 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 sm:p-12">
          
          {error && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-600 animate-scale-in">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              
              <div className="sm:col-span-2">
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-content uppercase tracking-widest">
                  Product Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium text-content outline-none transition-all placeholder:font-normal placeholder:text-muted focus:border-brass focus:ring-2 focus:ring-brass/20"
                  placeholder="e.g. Organic Matcha Powder"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="mb-2 block text-sm font-semibold text-content uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium text-content outline-none transition-all placeholder:font-normal placeholder:text-muted focus:border-brass focus:ring-2 focus:ring-brass/20 resize-none"
                  placeholder="Describe the product details..."
                />
              </div>

              <div>
                <label htmlFor="price" className="mb-2 block text-sm font-semibold text-content uppercase tracking-widest">
                  Price (₹)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium text-content outline-none transition-all placeholder:font-normal placeholder:text-muted focus:border-brass focus:ring-2 focus:ring-brass/20"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="stock" className="mb-2 block text-sm font-semibold text-content uppercase tracking-widest">
                  Stock Quantity
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  required
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium text-content outline-none transition-all placeholder:font-normal placeholder:text-muted focus:border-brass focus:ring-2 focus:ring-brass/20"
                  placeholder="0"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="category" className="mb-2 block text-sm font-semibold text-content uppercase tracking-widest">
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    required
                    value={form.category}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-2xl border border-border bg-background px-4 py-4 pr-12 text-base font-medium text-content outline-none transition-all focus:border-brass focus:ring-2 focus:ring-brass/20"
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Condiments">Condiments</option>
                    <option value="Pantry">Pantry</option>
                  </select>
                  <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="imageUrl" className="mb-2 block text-sm font-semibold text-content uppercase tracking-widest">
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  required
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium text-content outline-none transition-all placeholder:font-normal placeholder:text-muted focus:border-brass focus:ring-2 focus:ring-brass/20"
                />
              </div>

              <div className="flex items-center gap-4 pt-6 sm:col-span-2">
                <div className="relative flex h-6 items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-border bg-background transition-all checked:border-brass checked:bg-brass hover:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20 focus:ring-offset-2"
                  />
                  <svg
                    className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <label htmlFor="isActive" className="cursor-pointer text-sm font-semibold text-content">
                  Active (visible to customers)
                </label>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col-reverse items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push('/dashboard/products')}
              className="btn-secondary w-full sm:w-auto px-8"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full sm:w-auto px-10 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

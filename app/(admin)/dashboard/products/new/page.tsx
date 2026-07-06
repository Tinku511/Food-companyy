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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition hover:border-stone-300 hover:text-charcoal"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass">Products</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-charcoal">Add New Product</h1>
        </div>
      </div>

      {/* Form */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-stone-700">Product Name</label>
                <input
                  id="name" name="name" type="text" required
                  value={form.name} onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-stone-700">Description</label>
                <textarea
                  id="description" name="description" rows={3} required
                  value={form.description} onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-stone-700">Price (₹)</label>
                <input
                  id="price" name="price" type="number" step="0.01" min="0" required
                  value={form.price} onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="stock" className="mb-1.5 block text-sm font-medium text-stone-700">Stock Quantity</label>
                <input
                  id="stock" name="stock" type="number" min="0" required
                  value={form.stock} onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-stone-700">Category</label>
                <select
                  id="category" name="category" required
                  value={form.category} onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select a category</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Condiments">Condiments</option>
                  <option value="Pantry">Pantry</option>
                </select>
              </div>

              <div>
                <label htmlFor="imageUrl" className="mb-1.5 block text-sm font-medium text-stone-700">Image URL</label>
                <input
                  id="imageUrl" name="imageUrl" type="url" required
                  value={form.imageUrl} onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="form-input"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 sm:col-span-2">
                <input
                  id="isActive" name="isActive" type="checkbox"
                  checked={form.isActive} onChange={handleChange}
                  className="h-5 w-5 rounded border-stone-300 text-brass focus:ring-brass/20"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-stone-700">
                  Active (visible to customers)
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 border-t border-stone-100 pt-6">
            <button
              type="button"
              onClick={() => router.push('/dashboard/products')}
              className="rounded-xl border border-stone-200 px-6 py-2.5 text-sm font-medium text-stone-600 transition hover:border-stone-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-charcoal px-6 py-2 text-sm font-medium text-white transition hover:bg-charcoal/90 disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

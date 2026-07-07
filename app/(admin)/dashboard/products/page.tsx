'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Product } from '@prisma/client';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function fetchProducts() {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
    setConfirmDelete(null);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-content tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted">{products.length} products in your catalogue.</p>
        </div>
        <Link href="/dashboard/products/new" className="btn-secondary py-2 px-4 text-xs font-semibold shadow-sm flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center text-muted">
            <svg className="mx-auto mb-4 h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="font-medium text-content">No products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background/50 text-left text-[10px] font-bold uppercase tracking-widest text-muted">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-background/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 shrink-0 rounded-lg border border-border bg-background overflow-hidden">
                          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-content">{product.name}</p>
                          <p className="line-clamp-1 text-xs text-muted max-w-[150px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted border border-border">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-medium text-content">
                      ₹{Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-mono text-xs font-medium ${Number(product.stock) === 0 ? 'text-red-500' : 'text-content'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.isActive ? (
                        <span className="inline-flex rounded-md bg-green-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex rounded-md bg-stone-100 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold text-content shadow-sm transition-colors hover:bg-background hover:text-brass hover:border-brass/30"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(product.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold text-content shadow-sm transition-colors hover:bg-background hover:text-red-500 hover:border-red-200"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="mx-4 w-full max-w-sm rounded-[2rem] bg-surface p-8 shadow-2xl animate-scale-in border border-border">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 border border-red-100">
              <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mb-2 font-display text-xl font-medium text-content">Delete Product?</h3>
            <p className="mb-8 text-sm text-muted">
              This action cannot be undone. The product will be permanently removed from your catalogue.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-border bg-background py-3 text-sm font-semibold text-content transition-colors hover:bg-stone-200/50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete}
                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
              >
                {deletingId === confirmDelete ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

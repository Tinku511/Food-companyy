'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    isPublished: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    // Auto-generate slug from title if slug is empty
    if (name === 'title' && !form.slug) {
      setForm((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create post');
      }

      router.push('/dashboard/blog');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/blog" className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition hover:border-stone-300 hover:text-charcoal">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass">Blog</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-charcoal">Write New Post</h1>
        </div>
      </div>

      {/* Form */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-stone-700">Title</label>
              <input
                id="title" name="title" type="text" required
                value={form.title} onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-stone-700">URL Slug</label>
              <input
                id="slug" name="slug" type="text" required
                value={form.slug} onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="coverImage" className="mb-1.5 block text-sm font-medium text-stone-700">Cover Image URL</label>
              <input
                id="coverImage" name="coverImage" type="url"
                value={form.coverImage} onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="excerpt" className="mb-1.5 block text-sm font-medium text-stone-700">Excerpt (Short Summary)</label>
              <textarea
                id="excerpt" name="excerpt" rows={2}
                value={form.excerpt} onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="content" className="mb-1.5 flex justify-between text-sm font-medium text-stone-700">
                <span>Content (Markdown supported)</span>
              </label>
              <textarea
                id="content" name="content" rows={12} required
                value={form.content} onChange={handleChange}
                className="form-input font-mono"
              />
            </div>

            <div className="flex items-center gap-3 pt-2 sm:col-span-2">
              <input
                id="isPublished" name="isPublished" type="checkbox"
                checked={form.isPublished} onChange={handleChange}
                className="h-5 w-5 rounded border-stone-300 text-brass focus:ring-brass/20"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-stone-700">
                Publish immediately (visible to public)
              </label>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 border-t border-stone-100 pt-6">
            <Link
              href="/dashboard/blog"
              className="rounded-lg border border-stone-200 px-6 py-2 text-sm font-medium text-stone-600 transition hover:border-stone-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-charcoal px-6 py-2 text-sm font-medium text-white transition hover:bg-charcoal/90 disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

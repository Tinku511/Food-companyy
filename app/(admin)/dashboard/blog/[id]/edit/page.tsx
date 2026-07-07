'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    isPublished: false,
  });

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/admin/blog/${params.id}`);
        if (!res.ok) throw new Error('Failed to load post');
        const data = await res.json();
        setForm({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt || '',
          coverImage: data.coverImage || '',
          isPublished: !!data.publishedAt,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/blog/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update post');
      }

      router.push('/dashboard/blog');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-6">
        <Link
          href="/dashboard/blog"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-brass hover:text-brass shadow-sm"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass">Blog</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-content tracking-tight">Edit Post</h1>
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
                <label htmlFor="title" className="mb-2 block text-sm font-semibold text-content uppercase tracking-widest">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium text-content outline-none transition-all placeholder:font-normal placeholder:text-muted focus:border-brass focus:ring-2 focus:ring-brass/20"
                />
              </div>

              <div>
                <label htmlFor="slug" className="mb-2 block text-sm font-semibold text-content uppercase tracking-widest">
                  URL Slug
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  value={form.slug}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium text-content outline-none transition-all placeholder:font-normal placeholder:text-muted focus:border-brass focus:ring-2 focus:ring-brass/20"
                />
              </div>

              <div>
                <label htmlFor="coverImage" className="mb-2 block text-sm font-semibold text-content uppercase tracking-widest">
                  Cover Image URL
                </label>
                <input
                  id="coverImage"
                  name="coverImage"
                  type="url"
                  value={form.coverImage}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium text-content outline-none transition-all placeholder:font-normal placeholder:text-muted focus:border-brass focus:ring-2 focus:ring-brass/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="excerpt" className="mb-2 block text-sm font-semibold text-content uppercase tracking-widest">
                  Excerpt (Short Summary)
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={2}
                  value={form.excerpt}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium text-content outline-none transition-all placeholder:font-normal placeholder:text-muted focus:border-brass focus:ring-2 focus:ring-brass/20 resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="content" className="mb-2 flex justify-between text-sm font-semibold text-content uppercase tracking-widest">
                  <span>Content (Markdown supported)</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={12}
                  required
                  value={form.content}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-base font-medium text-content outline-none transition-all placeholder:font-normal placeholder:text-muted focus:border-brass focus:ring-2 focus:ring-brass/20 font-mono resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-4 pt-6 sm:col-span-2">
                <div className="relative flex h-6 items-center">
                  <input
                    id="isPublished"
                    name="isPublished"
                    type="checkbox"
                    checked={form.isPublished}
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
                <label htmlFor="isPublished" className="cursor-pointer text-sm font-semibold text-content">
                  Published (visible to public)
                </label>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col-reverse items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push('/dashboard/blog')}
              className="btn-secondary w-full sm:w-auto px-8"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full sm:w-auto px-10 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@prisma/client';

type BlogPostWithAuthor = BlogPost & { author: { name: string } };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchPosts() {
    const res = await fetch('/api/admin/blog');
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setDeletingId(id);
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass">Content</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-charcoal">Blog Posts</h1>
          <p className="mt-1 text-sm text-stone-500">Manage your store's blog content</p>
        </div>
        <Link
          href="/dashboard/blog/new"
          className="flex items-center gap-2 rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-white transition hover:bg-charcoal/90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Write Post
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center text-stone-400">
            <p className="mb-4 text-4xl">✍️</p>
            <p className="font-medium">No blog posts yet.</p>
            <Link href="/dashboard/blog/new" className="mt-3 inline-block text-sm text-brass hover:underline">Write your first post →</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-background text-left text-xs font-semibold uppercase tracking-wider text-stone-400">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {posts.map((post) => (
                <tr key={post.id} className="transition hover:bg-background/60">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-charcoal">{post.title}</p>
                    <p className="text-xs text-stone-400">/{post.slug}</p>
                  </td>
                  <td className="px-5 py-3.5 text-stone-600">{post.author.name}</td>
                  <td className="px-5 py-3.5">
                    {post.publishedAt ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">Published</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-500">Draft</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-stone-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/blog/${post.id}/edit`}
                        className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:border-brass hover:text-brass"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === post.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

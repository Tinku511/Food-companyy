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

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setDeletingId(id);
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-content tracking-tight">Blog Posts</h1>
          <p className="mt-1 text-sm text-muted">Manage your store's blog content.</p>
        </div>
        <Link href="/dashboard/blog/new" className="btn-secondary py-2 px-4 text-xs font-semibold shadow-sm flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Write Post
        </Link>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-24 text-center text-muted">
            <svg className="mx-auto mb-4 h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <p className="font-medium text-content">No blog posts found.</p>
            <Link
              href="/dashboard/blog/new"
              className="mt-3 inline-block text-sm text-brass hover:underline"
            >
              Write your first post →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background/50 text-left text-[10px] font-bold uppercase tracking-widest text-muted">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post) => (
                  <tr key={post.id} className="transition-colors hover:bg-background/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-content">{post.title}</p>
                      <p className="text-xs text-muted mt-0.5">/{post.slug}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-content">
                      {post.author.name}
                    </td>
                    <td className="px-6 py-4">
                      {post.publishedAt ? (
                        <span className="inline-flex rounded-md bg-green-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-green-700">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex rounded-md bg-stone-100 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/dashboard/blog/${post.id}/edit`}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold text-content shadow-sm transition-colors hover:bg-background hover:text-brass hover:border-brass/30"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deletingId === post.id}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold text-content shadow-sm transition-colors hover:bg-background hover:text-red-500 hover:border-red-200"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {deletingId === post.id ? '...' : 'Delete'}
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
    </div>
  );
}

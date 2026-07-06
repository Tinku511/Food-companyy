'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@prisma/client';

type BlogPostWithAuthor = BlogPost & { author: { name: string } };

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/blog');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
          The Seseme Journal
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-500">
          Stories, recipes, and insights from the world of premium food.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center text-stone-400">
          <p className="mb-4 text-4xl">🌱</p>
          <p className="text-lg font-medium">No stories published yet.</p>
          <p className="mt-1 text-sm">Check back soon for fresh content!</p>
        </div>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-stone-300">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-charcoal backdrop-blur-sm">
                  {new Date(post.publishedAt!).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h2 className="line-clamp-2 font-display text-xl font-bold text-foreground transition-colors group-hover:text-brass">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-500">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-500">
                    {post.author.name.charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-charcoal">{post.author.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

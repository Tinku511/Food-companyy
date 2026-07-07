'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@prisma/client';
import Image from 'next/image';

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
      <div className="flex min-h-[70vh] items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
      </div>
    );
  }

  // Feature the first post if it exists
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const standardPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="min-h-screen bg-background pb-32 pt-16 lg:pt-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="mb-20 border-b border-border pb-12 text-center animate-slide-up">
          <h1 className="font-display text-5xl font-light tracking-tight text-content lg:text-7xl">
            The Journal
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Stories, recipes, and insights from the world of premium natural food. Curated for the modern palate.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="py-32 text-center text-muted animate-fade-in">
            <svg className="mx-auto mb-6 h-16 w-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="font-display text-2xl font-light text-content">No stories published yet</h2>
            <p className="mt-2 text-sm">Check back soon for fresh content.</p>
          </div>
        ) : (
          <div className="space-y-24">
            
            {/* Featured Post (Medium Style) */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} className="group block animate-fade-in">
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] bg-surface shadow-sm">
                  {featuredPost.coverImage ? (
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface">
                      <span className="text-muted/50">No Cover Image</span>
                    </div>
                  )}
                  {/* Overlay gradient for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                  
                  {/* Featured Content overlay */}
                  <div className="absolute bottom-0 left-0 flex w-full flex-col justify-end p-8 sm:p-12">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="rounded-full bg-brass px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                        Featured
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
                        {new Date(featuredPost.publishedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                      {featuredPost.title}
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="mt-4 max-w-2xl text-base text-white/80 line-clamp-2 sm:text-lg">
                        {featuredPost.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )}

            {/* Standard Posts Grid */}
            {standardPosts.length > 0 && (
              <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2">
                {standardPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col items-start animate-fade-in"
                  >
                    <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-surface shadow-sm">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-surface">
                          <span className="text-muted/50 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                      <span>{new Date(post.publishedAt!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span className="h-1 w-1 rounded-full bg-stone-300"></span>
                      <span>By {post.author.name}</span>
                    </div>

                    <h2 className="mb-3 font-display text-2xl font-bold leading-snug text-content transition-colors group-hover:text-brass line-clamp-3">
                      {post.title}
                    </h2>
                    
                    {post.excerpt && (
                      <p className="text-muted leading-relaxed line-clamp-3 text-sm">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <span className="mt-6 text-sm font-bold text-charcoal transition-colors group-hover:text-brass flex items-center gap-2">
                      Read article
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

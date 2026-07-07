'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';

type BlogPost = {
  id: string;
  title: string;
  content: string;
  coverImage: string | null;
  publishedAt: string;
  author: { name: string; avatarUrl: string | null };
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog/${params.slug}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [params.slug]);

  // Scroll Progress logic
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
        <h1 className="font-display text-4xl font-light text-content">Story Not Found</h1>
        <p className="mt-4 text-muted">We couldn't find the article you're looking for.</p>
        <Link href="/blog" className="mt-8 btn-secondary px-8">
          Return to Journal
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background pb-32 pt-20 lg:pt-32">
      
      {/* ── Reading Progress Bar ─────────────────────────────────────────── */}
      <div className="fixed left-0 top-0 z-50 h-1.5 w-full bg-border/50">
        <div 
          className="h-full bg-brass transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── Editorial Header ───────────────────────────────────────────── */}
      <header className="mx-auto max-w-3xl px-6 text-center animate-slide-up">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brass transition-colors hover:text-brass/80">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to Journal
          </Link>
        </div>

        <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-content sm:text-5xl lg:text-6xl">
          {post.title}
        </h1>

        {/* Premium Author Byline */}
        <div className="mt-12 flex items-center justify-center gap-4 text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface shadow-sm border border-border">
            {post.author.avatarUrl ? (
              <img src={post.author.avatarUrl} alt={post.author.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-muted">{post.author.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-content">{post.author.name}</p>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
              <span className="mx-2">•</span>
              5 min read
            </p>
          </div>
        </div>
      </header>

      {/* ── Breakout Hero Image ────────────────────────────────────────── */}
      {post.coverImage && (
        <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 animate-fade-in delay-200">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2.5rem] bg-surface shadow-2xl lg:aspect-[21/9]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* ── Article Content ────────────────────────────────────────────── */}
      <div className="mx-auto mt-20 max-w-[680px] px-6 animate-fade-in delay-300">
        
        {/* Drop cap effect on first paragraph is handled via prose styling below */}
        <div className="prose prose-lg md:prose-xl prose-stone max-w-none text-content/90 
          prose-headings:font-display prose-headings:font-bold prose-headings:text-content prose-headings:tracking-tight 
          prose-p:leading-[1.8] prose-p:font-light prose-p:tracking-normal
          prose-a:text-brass prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:decoration-brass/30
          prose-blockquote:border-l-brass prose-blockquote:bg-surface prose-blockquote:py-2 prose-blockquote:pr-6 prose-blockquote:pl-8 prose-blockquote:rounded-r-2xl prose-blockquote:font-display prose-blockquote:text-xl prose-blockquote:font-light prose-blockquote:italic
          prose-img:rounded-3xl prose-img:shadow-xl
          first-letter:prose-p:float-left first-letter:prose-p:mr-3 first-letter:prose-p:text-7xl first-letter:prose-p:font-display first-letter:prose-p:font-bold first-letter:prose-p:text-brass first-letter:prose-p:leading-none"
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Article Footer */}
        <div className="mt-20 border-t border-border pt-10">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-brass">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-brass">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </button>
            </div>
            <p className="text-sm font-semibold text-muted">Share this article</p>
          </div>
        </div>

      </div>
    </article>
  );
}

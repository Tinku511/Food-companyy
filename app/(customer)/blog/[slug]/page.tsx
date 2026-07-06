'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">Post Not Found</h1>
        <p className="mt-2 text-stone-500">The article you're looking for doesn't exist or was removed.</p>
        <Link href="/blog" className="mt-6 font-semibold text-brass hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-ivory pb-24 pt-12 sm:pt-20">
      {/* Header section */}
      <header className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <Link href="/blog" className="inline-flex mb-10 text-sm font-semibold tracking-wide text-brass hover:underline">
          ← Back to Journal
        </Link>
        <h1 className="font-display text-4xl font-bold leading-snug text-charcoal sm:text-5xl md:text-6xl">
          {post.title}
        </h1>
        
        {/* Clean byline and date */}
        <div className="mt-10 flex items-center justify-center gap-4 text-sm font-medium text-stone-500">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 text-sm font-bold text-stone-600 shadow-sm">
              {post.author.name.charAt(0)}
            </div>
            <span className="text-charcoal tracking-wide">{post.author.name}</span>
          </div>
          <span className="text-stone-300">&mdash;</span>
          <time dateTime={post.publishedAt} className="tracking-wide">
            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mx-auto mt-14 max-w-5xl px-4 sm:px-6 lg:px-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="aspect-[21/9] w-full rounded-3xl object-cover shadow-xl shadow-stone-200/50"
          />
        </div>
      )}

      {/* Content */}
      <div className="mx-auto mt-20 max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="prose prose-stone prose-lg max-w-none text-charcoal/85 prose-headings:font-display prose-headings:font-semibold prose-headings:text-charcoal prose-p:leading-loose prose-a:text-brass hover:prose-a:text-brass/80 prose-img:rounded-2xl prose-img:shadow-md">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}

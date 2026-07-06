'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import CartIcon from './CartIcon';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/',         label: 'Home'     },
    { href: '/products', label: 'Products' },
    { href: '/blog',     label: 'Blog'     },
    { href: '/track',    label: 'Track Order' },
    { href: '/about',    label: 'About'    },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-charcoal/95 backdrop-blur-md shadow-xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5" id="navbar-logo">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brass to-plum/80 shadow-md shadow-brass/40 transition-transform duration-200 group-hover:scale-110">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </span>
          <span className="font-display text-xl font-bold text-white">
            Seseme<span className="text-brass">Foods</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-stone-300 transition-all duration-150 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <CartIcon />

          {session ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/orders" className="text-sm font-medium text-stone-300 transition hover:text-white">
                Orders
              </Link>
              {session.user.role === 'ADMIN' && (
                <Link href="/dashboard" className="text-sm font-medium text-stone-300 transition hover:text-white">
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-stone-300 transition hover:text-white"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/login" className="text-sm font-medium text-stone-300 transition hover:text-white">
                Log in
              </Link>
              <Link href="/signup" className="rounded-full bg-brass px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brass/90">
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            id="navbar-menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-300 transition hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="animate-slide-down border-t border-white/10 bg-charcoal/98 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-stone-300 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-white/10" />
            {session ? (
              <>
                <Link
                  href="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-stone-300 transition hover:bg-white/10 hover:text-white"
                >
                  My Orders
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-stone-300 transition hover:bg-white/10 hover:text-white"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { setMenuOpen(false); signOut(); }}
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-stone-300 transition hover:bg-white/10 hover:text-white"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-stone-300 transition hover:bg-white/10 hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-stone-300 transition hover:bg-white/10 hover:text-white"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

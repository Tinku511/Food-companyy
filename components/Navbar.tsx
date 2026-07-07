'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import CartIcon from './CartIcon';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/products', label: 'Shop' },
    { href: '/about', label: 'Story' },
    { href: '/journal', label: 'Journal' },
  ];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-center pt-6 px-6 pointer-events-none transition-all duration-700">
      <div className={`pointer-events-auto flex items-center justify-between w-full max-w-[1400px] transition-all duration-700 ${scrolled ? 'bg-surface/80 backdrop-blur-2xl shadow-brand-md px-8 py-4 rounded-full border border-white/20' : 'bg-transparent py-4 px-4'}`}>
        
        {/* Left: Nav Links */}
        <nav className="hidden items-center gap-8 md:flex w-1/3" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-[0.15em] text-content/70 transition-colors duration-300 hover:text-content"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center: Monogram SVG Logo */}
        <div className="flex w-1/3 justify-start md:justify-center z-50">
          <Link href="/" className="group flex items-center justify-center" aria-label="Seseme Home">
            <svg 
              className="h-10 w-10 text-content transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-90 group-hover:rotate-[360deg]" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" className="opacity-20" />
              <path 
                d="M50 20C33.4315 20 20 33.4315 20 50C20 57.5 24 64 30 67" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="square"
              />
              <path 
                d="M50 80C66.5685 80 80 66.5685 80 50C80 42.5 76 36 70 33" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="square"
              />
              <path 
                d="M35 50H65" 
                stroke="currentColor" 
                strokeWidth="4" 
              />
            </svg>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex w-1/3 items-center justify-end gap-6">
          
          <div className="relative hidden items-center md:flex">
            <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${searchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full border-b border-content/20 bg-transparent py-1 pl-2 pr-8 text-xs uppercase tracking-widest text-content placeholder-content/30 outline-none focus:border-content"
              />
            </div>
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="group flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-content/5"
              aria-label="Toggle search"
            >
              <svg className={`h-4 w-4 text-content transition-transform duration-500 ${searchOpen ? 'rotate-90 scale-110' : 'group-hover:scale-110'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {searchOpen ? (
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden h-4 w-px bg-content/20 md:block"></div>

          {session ? (
            <div className="group relative hidden items-center md:flex">
              <button className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-content/70 transition hover:text-content">
                Account
              </button>
              <div className="absolute right-0 top-full mt-6 w-48 origin-top-right rounded-2xl bg-surface p-2 opacity-0 shadow-2xl transition-all duration-300 invisible group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 border border-border">
                <Link href="/orders" className="block rounded-xl px-4 py-3 text-sm text-muted hover:bg-light-section hover:text-content transition-colors">Orders</Link>
                {session.user.role === 'ADMIN' && (
                  <Link href="/dashboard" className="block rounded-xl px-4 py-3 text-sm text-muted hover:bg-light-section hover:text-content transition-colors">Dashboard</Link>
                )}
                <button onClick={() => signOut()} className="block w-full text-left rounded-xl px-4 py-3 text-sm text-muted hover:bg-light-section hover:text-danger transition-colors">Sign out</button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hidden text-xs font-semibold uppercase tracking-[0.15em] text-content/70 transition hover:text-content md:block">
              Log in
            </Link>
          )}

          <div className="scale-90 opacity-80 hover:opacity-100 transition-opacity">
            <CartIcon />
          </div>

          <button
            aria-label="Toggle menu"
            className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-full text-content transition-colors hover:bg-content/5 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Cinematic Full Screen Menu */}
      <div className={`fixed inset-0 z-50 bg-dark/98 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <nav className="mx-auto flex h-full flex-col justify-center px-10 pb-10 pt-24">
          <div className="flex flex-col gap-6">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-5xl font-display font-light tracking-tight text-surface transition-all duration-700 delay-[${i * 100}ms] hover:text-brass ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className={`my-8 h-px w-full bg-surface/10 transition-all duration-1000 delay-300 ${menuOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>
            
            {session ? (
              <>
                <Link href="/orders" onClick={() => setMenuOpen(false)} className={`text-2xl font-light text-surface/70 transition-all duration-700 delay-400 hover:text-brass ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>Orders</Link>
                {session.user.role === 'ADMIN' && (
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className={`text-2xl font-light text-surface/70 transition-all duration-700 delay-500 hover:text-brass ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>Dashboard</Link>
                )}
                <button onClick={() => { setMenuOpen(false); signOut(); }} className={`text-left text-2xl font-light text-danger/80 transition-all duration-700 delay-600 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>Sign out</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className={`text-2xl font-light text-surface/70 transition-all duration-700 delay-400 hover:text-brass ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>Log in</Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

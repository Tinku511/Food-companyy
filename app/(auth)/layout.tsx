import { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Ambient background glows for premium feel */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass/5 blur-[120px]"></div>
      
      <div className="z-10 w-full max-w-md animate-slide-up space-y-10">
        
        {/* Branding */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex flex-col items-center justify-center gap-4 transition-transform duration-300 hover:scale-105"
            aria-label="Home"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark shadow-xl shadow-dark/20">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
            </span>
            <span className="font-display text-2xl font-light tracking-tight text-content">
              Seseme<span className="font-medium text-brass">Foods</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-[2.5rem] border border-border bg-surface p-8 shadow-2xl shadow-stone-200/50 sm:p-12">
          {children}
        </div>

      </div>
    </div>
  );
}

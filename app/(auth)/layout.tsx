import { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2" aria-label="Home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brass to-plum/80 shadow-md shadow-brass/30">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </span>
            <span className="font-display text-2xl font-bold text-foreground">
              Seseme<span className="text-brass">Foods</span>
            </span>
          </Link>
        </div>
        <div className="card p-10 sm:p-12 shadow-card-hover">
          {children}
        </div>
      </div>
    </div>
  );
}

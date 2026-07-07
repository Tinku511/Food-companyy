import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from '@/components/Providers';

import { Inter, Fraunces } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
});

export const metadata: Metadata = {
  title: {
    default: 'SesemeFoods — Farm-Fresh Natural Foods',
    template: '%s | SesemeFoods',
  },
  description:
    'Discover the finest natural, farm-to-table food products. Shop snacks, beverages, dairy, and bakery items crafted with care.',
  keywords: ['organic food', 'natural snacks', 'farm fresh', 'healthy eating', 'SesemeFoods'],
  openGraph: {
    siteName: 'SesemeFoods',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} font-sans leading-relaxed antialiased bg-background text-content`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

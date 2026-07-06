import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from '@/components/Providers';

import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
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
        className={`${inter.variable} ${playfair.variable} font-sans leading-relaxed antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

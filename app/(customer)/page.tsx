import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'SesemeFoods | Farm-Fresh Natural Foods',
  description:
    'Discover the finest natural, farm-to-table food products. Shop snacks, beverages, dairy, and bakery items crafted with care.',
};

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });
  } catch {
    return [];
  }
}

const categories = [
  {
    name: 'Artisan Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&q=80',
    desc: 'Baked every morning using heritage grains.',
    path: 'Bakery',
  },
  {
    name: 'Premium Dairy',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=1600&q=80',
    desc: 'Rich, unhomogenized milk from pasture-raised cows.',
    path: 'Dairy',
  },
  {
    name: 'Natural Beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1600&q=80',
    desc: 'Cold-pressed and ethically brewed.',
    path: 'Beverages',
  },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div className="bg-[#FAF8F4] overflow-hidden selection:bg-[#4A2E35] selection:text-surface">
      
      {/* ─── 1. MASKED CINEMATIC HERO ────────────────────────────────── */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=2400&q=90"
          alt="Immersive nature"
          fill
          className="object-cover scale-110 animate-[scale-in_10s_cubic-bezier(0.16,1,0.3,1)_forwards]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
        
        <div className="absolute inset-x-0 bottom-0 flex flex-col p-8 md:p-16 lg:p-24 pb-32">
          
          {/* Masked Typography Reveal */}
          <div className="overflow-hidden mb-6">
            <span className="block font-sans text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-brass animate-mask-up">
              Uncompromised Quality
            </span>
          </div>

          <div className="overflow-hidden">
             <h1 className="font-display text-[14vw] leading-[0.8] tracking-tighter text-surface animate-mask-up mix-blend-overlay" style={{ animationDelay: '0.1s' }}>
               Nature's
             </h1>
          </div>
          <div className="overflow-hidden">
             <h1 className="font-display text-[14vw] leading-[0.8] tracking-tighter text-surface animate-mask-up mix-blend-overlay" style={{ animationDelay: '0.2s' }}>
               Purest.
             </h1>
          </div>
          
          <div className="mt-16 overflow-hidden w-max">
            <Link href="/products" className="group relative flex cursor-pointer items-center justify-center bg-surface px-12 py-5 text-sm font-semibold uppercase tracking-[0.2em] text-dark overflow-hidden animate-mask-up" style={{ animationDelay: '0.4s' }}>
              <span className="relative z-10 transition-colors duration-700 group-hover:text-surface">Enter Collection</span>
              <div className="absolute inset-0 z-0 h-full w-full translate-y-full bg-[#4A2E35] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
            </Link>
          </div>
        </div>

        {/* Floating Scroll indicator */}
        <div className="absolute bottom-12 right-12 flex flex-col items-center gap-4 opacity-0 animate-[fade-in_2s_ease_2s_both]">
          <span className="text-[9px] uppercase tracking-[0.4em] text-surface/50 rotate-90 origin-right">Scroll</span>
          <div className="h-24 w-[1px] bg-gradient-to-b from-surface/50 to-transparent overflow-hidden">
             <div className="w-full h-full bg-surface animate-[mask-up_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ─── 2. STICKY STORYTELLING ────────────────────────────────────── */}
      <section className="bg-dark text-surface relative h-[200vh]" aria-label="Philosophy">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
           
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

           <div className="z-10 max-w-[1600px] px-6 lg:px-24 w-full flex flex-col md:flex-row justify-between items-center gap-16">
              <div className="w-full md:w-1/2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-brass mb-8 block">
                  The Philosophy
                </span>
                <h2 className="font-display text-5xl md:text-7xl leading-[1.1] tracking-tighter">
                  We reject the <span className="italic text-[#4A2E35]">artificial.</span>
                </h2>
                <p className="mt-8 text-lg font-light leading-relaxed text-surface/60 max-w-md">
                  No shortcuts. No additives. We partner exclusively with sustainable farms to bring you food exactly as nature intended—raw, untamed, and entirely authentic.
                </p>
              </div>

              {/* Massive Parallax Typography */}
              <div className="hidden md:block w-full md:w-1/2 relative h-[50vh]">
                 <h2 className="absolute top-1/2 -translate-y-1/2 left-0 font-display text-[25vw] leading-none text-surface/5 select-none pointer-events-none">
                    PURE.
                 </h2>
              </div>
           </div>
        </div>
      </section>

      {/* ─── 3. BORDERLESS GALLERY (Featured Products) ────────────────── */}
      <section className="py-40 lg:py-64 relative bg-[#FAF8F4]" aria-label="Selected works">
        <div className="mx-auto max-w-[1800px] px-6 lg:px-12 xl:px-24">
          
          <div className="mb-32 flex flex-col md:flex-row items-end justify-between border-b border-dark/10 pb-16">
             <div className="overflow-hidden">
               <h2 className="font-display text-[7vw] leading-none tracking-tighter text-content animate-mask-up" style={{ animationDelay: '0.2s' }}>
                 Curated <br/><span className="italic text-muted">Archive.</span>
               </h2>
             </div>
             <Link href="/products" className="group mt-12 md:mt-0 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-content transition-colors hover:text-[#4A2E35]">
               <span>View Complete Index</span>
               <div className="h-px w-12 bg-content transition-all duration-500 group-hover:w-24 group-hover:bg-[#4A2E35]" />
             </Link>
          </div>

          {featured.length > 0 && (
            <div className="flex flex-col gap-32 md:gap-48">
              {featured.map((product, index) => (
                <div key={product.id} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}>
                   
                   {/* Massive Borderless Image */}
                   <div className="w-full md:w-7/12 relative aspect-[4/5] overflow-hidden group cursor-pointer">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 60vw"
                      />
                      {/* Interactive Cursor Area (Conceptual hover effect) */}
                      <div className="absolute inset-0 bg-[#4A2E35]/20 opacity-0 transition-opacity duration-700 group-hover:opacity-100 mix-blend-multiply" />
                   </div>

                   {/* Detached Typography Block */}
                   <div className="w-full md:w-4/12 flex flex-col justify-center">
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-brass mb-6">
                        No. 0{index + 1} &mdash; {product.category}
                      </span>
                      <h3 className="font-display text-5xl md:text-6xl font-light text-content mb-8 tracking-tight">
                        {product.name}
                      </h3>
                      <p className="text-lg text-muted font-light mb-12 max-w-sm">
                        {product.description.substring(0, 100)}...
                      </p>
                      
                      <div className="flex items-center justify-between border-t border-dark/10 pt-8">
                         <span className="font-sans text-lg tracking-widest text-content">
                           ₹{Number(product.price).toFixed(2)}
                         </span>
                         <Link href={`/products/${product.id}`} className="group relative overflow-hidden rounded-full border border-dark/20 px-8 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-content transition-colors duration-500 hover:border-transparent hover:text-surface">
                            <span className="relative z-10">Discover</span>
                            <div className="absolute inset-0 z-0 h-full w-full translate-y-full bg-[#4A2E35] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                         </Link>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 4. TYPOGRAPHY ACCORDION CATEGORIES ──────────────────────── */}
      <section className="h-[100svh] flex flex-col lg:flex-row bg-[#FAF8F4] overflow-hidden" aria-label="Collections">
         {categories.map((cat, i) => (
           <Link
             key={cat.name}
             href={`/products?category=${cat.path}`}
             className="group relative flex-1 border-t lg:border-t-0 lg:border-r border-dark/10 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] hover:flex-[3] overflow-hidden flex flex-col justify-end p-8 md:p-12"
           >
             {/* Background Image Reveal */}
             <div className="absolute inset-0 z-0">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover scale-125 grayscale-[0.8] opacity-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:grayscale-0 group-hover:opacity-100"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
             </div>

             <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between w-full">
                <div>
                   <span className="font-display text-2xl text-muted group-hover:text-brass transition-colors duration-500">0{i + 1}</span>
                   <h3 className="font-display text-3xl md:text-5xl lg:text-[4vw] leading-none font-light text-content group-hover:text-surface transition-colors duration-500 mt-4 whitespace-nowrap">
                     {cat.name}
                   </h3>
                </div>
                
                <div className="hidden lg:block opacity-0 translate-y-8 transition-all duration-700 delay-100 group-hover:opacity-100 group-hover:translate-y-0">
                   <p className="text-surface/80 text-sm max-w-[200px]">{cat.desc}</p>
                </div>
             </div>
           </Link>
         ))}
      </section>

    </div>
  );
}

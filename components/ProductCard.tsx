import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@prisma/client';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const price = Number(product.price).toFixed(2);
  const outOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col">
      {/* Detached Typography (Top) */}
      <div className="mb-6 flex flex-col items-center text-center opacity-0 transition-all duration-[1000ms] group-hover:opacity-100 group-hover:-translate-y-2">
        <span className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brass">
          {product.category}
        </span>
        <h3 className="font-display text-3xl font-light text-content mb-2">
          {product.name}
        </h3>
        <span className="font-sans text-sm tracking-widest text-muted">
          ₹{price}
        </span>
      </div>

      {/* Image Block */}
      <Link
        href={`/products/${product.id}`}
        id={`product-card-${product.id}`}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-[#e0dcd3]"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.08] grayscale-[0.2] group-hover:grayscale-0"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
        />
        
        {/* Abstract Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/30 via-transparent to-transparent opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />

        {/* Minimal Add Button (Reveals on Hover) */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-8 opacity-0 transition-all duration-[1000ms] ease-out group-hover:translate-y-0 group-hover:opacity-100 translate-y-8">
           <button className="rounded-full bg-surface/90 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-content shadow-2xl backdrop-blur-md transition-colors duration-300 hover:bg-dark hover:text-surface">
             {outOfStock ? 'Sold Out' : 'Add to Cart'}
           </button>
        </div>
      </Link>
    </div>
  );
}

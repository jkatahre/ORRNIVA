import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products, columns = 4, priorityCount = 0 }: { products: Product[]; columns?: 3 | 4; priorityCount?: number }) {
  const cols = columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4';
  const sizes = columns === 3 ? '(min-width: 1024px) 25vw, 50vw' : '(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 50vw';
  return (
    <div className={`grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 ${cols}`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} sizes={sizes} />
      ))}
    </div>
  );
}

/** Horizontally scrollable product row with arrow controls. */
export function ProductRail({ products, label }: { products: Product[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };
  if (!products.length) return null;
  return (
    <div className="relative">
      <div
        ref={ref}
        role="region"
        aria-label={label}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 sm:-mx-6 sm:gap-5 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {products.map((p) => (
          <div key={p.id} className="w-[46%] flex-none snap-start sm:w-[31%] lg:w-[calc((100%-60px)/4)]">
            <ProductCard product={p} sizes="(min-width: 1024px) 22vw, 46vw" />
          </div>
        ))}
      </div>
      {products.length > 4 && (
        <div className="mt-6 hidden justify-end gap-2 lg:flex">
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className="flex h-10 w-10 items-center justify-center rounded-full border border-stone transition-colors hover:border-charcoal">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className="flex h-10 w-10 items-center justify-center rounded-full border border-stone transition-colors hover:border-charcoal">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

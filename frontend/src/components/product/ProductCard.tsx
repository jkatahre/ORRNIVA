import { memo } from 'react';
import { Link } from 'react-router';
import { Heart, Plus } from 'lucide-react';
import type { Product } from '../../types';
import { CATEGORY_MAP } from '../../data/categories';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { discountPercent } from '../../utils/format';
import { Img, Price, Rating } from '../common';

export function ProductLabels({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.originalPrice);
  const labels: { text: string; cls: string }[] = [];
  if (!product.availability) labels.push({ text: 'Sold out', cls: 'bg-charcoal text-ivory' });
  if (product.isNewArrival) labels.push({ text: 'New', cls: 'bg-ivory text-ink' });
  if (product.isBestSeller) labels.push({ text: 'Bestseller', cls: 'bg-ivory text-ink' });
  if (off > 0 && product.availability) labels.push({ text: `Sale −${off}%`, cls: 'bg-sale text-ivory' });
  if (!labels.length) return null;
  return (
    <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1">
      {labels.slice(0, 2).map((l) => (
        <span key={l.text} className={`px-2 py-[3px] text-[10px] font-medium uppercase tracking-[0.14em] ${l.cls}`}>
          {l.text}
        </span>
      ))}
    </div>
  );
}

function ProductCardBase({ product, priority = false, sizes }: { product: Product; priority?: boolean; sizes?: string }) {
  const { add } = useCart();
  const wishlist = useWishlist();
  const saved = wishlist.has(product.id);
  const url = `/products/${product.slug}`;
  const cat = CATEGORY_MAP[product.category];
  const sub = cat.subCategories.find((s) => s.slug === product.subCategory)?.name;
  const primary = product.images[0];

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden bg-cream">
        <Link to={url} className="block aspect-square" aria-label={product.name} tabIndex={-1}>
          <Img
            imageKey={primary}
            alt={product.name}
            priority={priority}
            sizes={sizes}
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03] ${!product.availability ? 'grayscale-[35%]' : ''}`}
          />
        </Link>

        <ProductLabels product={product} />

        <button
          type="button"
          onClick={() => wishlist.toggle(product)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          className="absolute top-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/85 text-charcoal backdrop-blur-sm transition-colors hover:bg-ivory"
        >
          <Heart size={16} strokeWidth={1.6} className={saved ? 'fill-sale text-sale' : ''} />
        </button>

        {/* Quick add: slides up on hover (desktop), compact icon button on touch */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-10 hidden translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:block">
          <button
            type="button"
            onClick={() => add(product)}
            disabled={!product.availability}
            className="w-full bg-ivory/95 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink backdrop-blur-sm transition-colors hover:bg-charcoal hover:text-ivory disabled:hover:bg-ivory/95 disabled:hover:text-ink"
          >
            {product.availability ? 'Quick add' : 'Sold out'}
          </button>
        </div>
        {product.availability && (
          <button
            type="button"
            onClick={() => add(product)}
            aria-label={`Add ${product.name} to bag`}
            className="absolute right-2 bottom-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-ink md:hidden"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3.5">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-taupe">
          {sub ?? cat.name}
          <span className="mx-1.5 text-stone">·</span>
          {product.material}
        </p>
        <h3 className="mt-1 font-serif text-[19px] leading-snug text-ink">
          <Link to={url} className="after:absolute after:inset-0 after:z-0 hover:underline hover:decoration-stone hover:underline-offset-4 focus:outline-none">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1.5">
          <Price price={product.price} original={product.originalPrice} />
        </div>
        {product.rating && (
          <div className="mt-1.5">
            <Rating value={product.rating} count={product.reviewCount} size={11} />
          </div>
        )}
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardBase);

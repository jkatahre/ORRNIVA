import { Link } from 'react-router';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../hooks';
import { EmptyState, Img, PageHeader, Price } from '../components/common';

export default function Wishlist() {
  usePageMeta('Wishlist');
  const { products, remove, clear } = useWishlist();
  const cart = useCart();
  const toast = useToast();

  const moveToCart = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (p && cart.add(p)) remove(id);
  };

  const moveAll = () => {
    const available = products.filter((p) => p.availability);
    available.forEach((p) => {
      cart.add(p, 1, { silent: true });
      remove(p.id);
    });
    toast.show({
      kind: 'success',
      title: `${available.length} ${available.length === 1 ? 'piece' : 'pieces'} moved to your bag`,
      message: available.length < products.length ? 'Sold-out pieces stayed on your wishlist.' : undefined,
      action: { label: 'View bag', to: '/cart' },
    });
  };

  const inStock = products.filter((p) => p.availability).length;

  return (
    <div>
      <PageHeader
        title="Wishlist"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]}
        description={products.length ? `${products.length} saved ${products.length === 1 ? 'piece' : 'pieces'}. Saved on this device.` : undefined}
      />
      <div className="container-x py-10 md:py-14">
        {products.length === 0 ? (
          <EmptyState icon={<Heart size={22} strokeWidth={1.5} />} title="Your wishlist is empty" message="Tap the heart on any piece to save it here for later.">
            <Link to="/collections/all" className="btn-dark">
              Explore the catalogue
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-muted">{inStock} of {products.length} in stock</p>
              <div className="flex gap-2">
                <button onClick={clear} className="btn-light px-4 py-2.5">
                  Clear wishlist
                </button>
                <button onClick={moveAll} disabled={!inStock} className="btn-dark px-4 py-2.5">
                  <ShoppingBag size={14} /> Move all to bag
                </button>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <li key={p.id} className="flex flex-col">
                  <div className="relative">
                    <Link to={`/products/${p.slug}`} className="block aspect-square overflow-hidden bg-cream">
                      <Img imageKey={p.images[0]} alt={p.name} className={`h-full w-full object-cover ${p.availability ? '' : 'grayscale-[40%]'}`} />
                    </Link>
                    <button onClick={() => remove(p.id)} aria-label={`Remove ${p.name} from wishlist`} className="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-charcoal hover:bg-ivory">
                      <X size={16} />
                    </button>
                    {!p.availability && <span className="absolute top-2.5 left-2.5 bg-charcoal px-2 py-[3px] text-[10px] font-medium uppercase tracking-[0.14em] text-ivory">Sold out</span>}
                  </div>
                  <p className="mt-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-taupe">{p.material}</p>
                  <Link to={`/products/${p.slug}`} className="mt-1 font-serif text-[19px] leading-snug text-ink hover:underline hover:underline-offset-4">
                    {p.name}
                  </Link>
                  <div className="mt-1.5">
                    <Price price={p.price} original={p.originalPrice} />
                  </div>
                  <button onClick={() => moveToCart(p.id)} disabled={!p.availability} className="btn-outline mt-4 w-full px-3 py-2.5">
                    {p.availability ? 'Move to bag' : 'Sold out'}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

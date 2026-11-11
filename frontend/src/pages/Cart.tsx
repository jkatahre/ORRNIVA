import { Link } from 'react-router';
import { Heart, ShoppingBag, Trash2, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { COMMERCE } from '../config/site';
import { PRODUCTS } from '../data/products';
import { usePageMeta } from '../hooks';
import { computeTotals } from '../utils/pricing';
import { formatPrice } from '../utils/format';
import { EmptyState, Img, PageHeader, Price, QuantityStepper, SectionHeading } from '../components/common';
import { CouponForm, TotalsTable } from '../components/cart/OrderSummary';
import { FreeShippingMeter } from '../components/cart/FreeShippingMeter';
import { ProductRail } from '../components/product/ProductGrid';
import { PaymentBadges } from '../components/common/Brand';

export default function Cart() {
  usePageMeta('Shopping Bag');
  const { lines, count, subtotal, savings, coupon, setQuantity, remove } = useCart();
  const wishlist = useWishlist();
  const totals = computeTotals(subtotal, coupon);
  const inBag = new Set(lines.map((l) => l.productId));
  const suggestions = PRODUCTS.filter((p) => p.isBestSeller && p.availability && !inBag.has(p.id)).slice(0, 8);

  const moveToWishlist = (id: string) => {
    const l = lines.find((x) => x.productId === id);
    if (!l) return;
    if (!wishlist.has(id)) wishlist.toggle(l.product);
    remove(id);
  };

  return (
    <div>
      <PageHeader title="Your Bag" crumbs={[{ label: 'Home', to: '/' }, { label: 'Shopping Bag' }]} description={count ? `${count} ${count === 1 ? 'item' : 'items'} in your bag` : undefined} />

      <div className="container-x py-10 md:py-14">
        {lines.length === 0 ? (
          <EmptyState icon={<ShoppingBag size={22} strokeWidth={1.5} />} title="Your bag is empty" message="Pieces you add to your bag will appear here. Start with our best sellers or browse the full catalogue.">
            <Link to="/collections/all" className="btn-dark">
              Continue shopping
            </Link>
            {wishlist.count > 0 && (
              <Link to="/wishlist" className="btn-light">
                View wishlist ({wishlist.count})
              </Link>
            )}
          </EmptyState>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12">
            <section className="lg:col-span-8" aria-label="Items in bag">
              <div className="mb-6 border border-sand bg-cream/50 p-4">
                <FreeShippingMeter subtotal={subtotal} />
              </div>
              <div className="hidden grid-cols-[1fr_140px_120px] border-b border-sand pb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-taupe md:grid">
                <span>Product</span>
                <span>Quantity</span>
                <span className="text-right">Total</span>
              </div>
              <ul className="divide-y divide-sand">
                {lines.map((l) => (
                  <li key={l.productId} className="grid grid-cols-[88px_1fr] gap-4 py-6 md:grid-cols-[1fr_140px_120px] md:items-center md:gap-0">
                    <div className="flex gap-5 md:pr-6">
                      <Link to={`/products/${l.product.slug}`} className="w-[88px] flex-none md:w-28">
                        <div className="aspect-square overflow-hidden bg-cream">
                          <Img imageKey={l.product.images[0]} alt={l.product.name} sizes="112px" className="h-full w-full object-cover" />
                        </div>
                      </Link>
                      <div className="hidden min-w-0 md:block">
                        <ItemInfo line={l} onRemove={() => remove(l.productId)} onSave={() => moveToWishlist(l.productId)} />
                      </div>
                    </div>
                    <div className="min-w-0 md:hidden">
                      <ItemInfo line={l} onRemove={() => remove(l.productId)} onSave={() => moveToWishlist(l.productId)} />
                      <div className="mt-3 flex items-center justify-between">
                        <QuantityStepper size="sm" value={l.quantity} max={Math.min(COMMERCE.maxQtyPerItem, l.product.stock)} onChange={(n) => setQuantity(l.productId, n)} />
                        <span className="text-[15px] text-ink">{formatPrice(l.lineTotal)}</span>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <QuantityStepper size="sm" value={l.quantity} max={Math.min(COMMERCE.maxQtyPerItem, l.product.stock)} onChange={(n) => setQuantity(l.productId, n)} />
                      {l.product.stock <= 6 && <p className="mt-1.5 text-[11px] text-sale">Only {l.product.stock} left</p>}
                    </div>
                    <p className="hidden text-right text-[15px] text-ink md:block">{formatPrice(l.lineTotal)}</p>
                  </li>
                ))}
              </ul>
              <Link to="/collections/all" className="mt-6 inline-block text-[12px] font-medium uppercase tracking-[0.16em] link-underline">
                ← Continue shopping
              </Link>
            </section>

            <aside className="lg:col-span-4" aria-label="Order summary">
              <div className="border border-sand bg-white/40 p-6 lg:sticky lg:top-[150px]">
                <h2 className="mb-5 text-[26px]">Order summary</h2>
                <CouponForm />
                <div className="mt-6">
                  <TotalsTable totals={totals} couponCode={coupon?.code} />
                </div>
                {savings + totals.discount > 0 && (
                  <p className="mt-3 bg-success/10 px-3 py-2 text-[12.5px] text-success">You are saving {formatPrice(savings + totals.discount)} on this order</p>
                )}
                <p className="mt-3 text-[12px] text-taupe">Pay online with UPI or card at checkout for an extra 5% off (up to ₹{COMMERCE.prepaidDiscountCap}).</p>
                <Link to="/checkout" className="btn-dark mt-6 h-12 w-full">
                  <Lock size={14} /> Proceed to checkout
                </Link>
                <PaymentBadges className="mt-4 justify-center" />
              </div>
            </aside>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <section className="container-x pt-8">
          <SectionHeading eyebrow="Complete your home" title="You might also love" />
          <ProductRail products={suggestions} label="Suggested products" />
        </section>
      )}
    </div>
  );

  function ItemInfo({ line, onRemove, onSave }: { line: (typeof lines)[number]; onRemove: () => void; onSave: () => void }) {
    return (
      <div>
        <Link to={`/products/${line.product.slug}`} className="font-serif text-[19px] leading-snug text-ink hover:underline hover:underline-offset-4">
          {line.product.name}
        </Link>
        <p className="mt-0.5 text-[12px] text-taupe">
          {line.product.material} · {line.product.finish}
        </p>
        <div className="mt-1.5">
          <Price price={line.product.price} original={line.product.originalPrice} />
        </div>
        <div className="mt-3 flex gap-4 text-[12px] text-muted">
          <button onClick={onSave} className="flex items-center gap-1.5 hover:text-ink">
            <Heart size={13} strokeWidth={1.5} /> Move to wishlist
          </button>
          <button onClick={onRemove} className="flex items-center gap-1.5 hover:text-ink">
            <Trash2 size={13} strokeWidth={1.5} /> Remove
          </button>
        </div>
      </div>
    );
  }
}

import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useEscape, useLockBody } from '../../hooks';
import { COMMERCE } from '../../config/site';
import { formatPrice } from '../../utils/format';
import { Img, QuantityStepper } from '../common';
import { FreeShippingMeter } from './FreeShippingMeter';

export function CartDrawer() {
  const { isOpen, closeCart, lines, subtotal, count, setQuantity, remove } = useCart();
  const location = useLocation();
  useEscape(isOpen, closeCart);
  useLockBody(isOpen);

  useEffect(() => {
    closeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={closeCart} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[420px] animate-slide-in-right flex-col bg-ivory">
        <div className="flex h-16 items-center justify-between border-b border-sand px-5">
          <h2 className="font-serif text-[24px]">
            Your bag <span className="text-[15px] text-taupe">({count})</span>
          </h2>
          <button onClick={closeCart} aria-label="Close bag" className="-mr-2 flex h-10 w-10 items-center justify-center">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cream">
              <ShoppingBag size={22} strokeWidth={1.5} />
            </span>
            <p className="font-serif text-[24px] text-ink">Your bag is empty</p>
            <p className="mt-1 text-muted">Discover pieces made to be lived with.</p>
            <Link to="/collections/all" onClick={closeCart} className="btn-dark mt-6">
              Browse the catalogue
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-sand px-5 py-4">
              <FreeShippingMeter subtotal={subtotal} />
            </div>
            <ul className="flex-1 divide-y divide-sand overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={l.productId} className="flex gap-4 py-5">
                  <Link to={`/products/${l.product.slug}`} onClick={closeCart} className="w-20 flex-none">
                    <div className="aspect-square overflow-hidden bg-cream">
                      <Img imageKey={l.product.images[0]} alt={l.product.name} sizes="80px" className="h-full w-full object-cover" />
                    </div>
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/products/${l.product.slug}`} onClick={closeCart} className="font-serif text-[17px] leading-snug text-ink hover:underline hover:underline-offset-4">
                        {l.product.name}
                      </Link>
                      <button onClick={() => remove(l.productId)} aria-label={`Remove ${l.product.name}`} className="p-1 text-taupe hover:text-ink">
                        <Trash2 size={15} strokeWidth={1.5} />
                      </button>
                    </div>
                    <p className="text-[12px] text-taupe">{l.product.material} · {l.product.finish}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QuantityStepper size="sm" value={l.quantity} max={Math.min(COMMERCE.maxQtyPerItem, l.product.stock)} onChange={(n) => setQuantity(l.productId, n)} />
                      <span className="text-[14px] text-ink">{formatPrice(l.lineTotal)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-sand px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] uppercase tracking-[0.16em] text-muted">Subtotal</span>
                <span className="font-serif text-[24px] text-ink">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-[12px] text-taupe">Shipping, coupons and prepaid savings are calculated at checkout.</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link to="/cart" onClick={closeCart} className="btn-outline">
                  View bag
                </Link>
                <Link to="/checkout" onClick={closeCart} className="btn-dark">
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

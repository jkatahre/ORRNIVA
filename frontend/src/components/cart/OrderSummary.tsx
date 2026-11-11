import { useState, type FormEvent, type ReactNode } from 'react';
import { Tag, X } from 'lucide-react';
import { COUPONS } from '../../config/site';
import { useCart } from '../../context/CartContext';
import type { Totals } from '../../utils/pricing';
import { formatPrice } from '../../utils/format';

export function CouponForm() {
  const { coupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showCodes, setShowCodes] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return setError('Please enter a coupon code.');
    const err = applyCoupon(code);
    setError(err);
    if (!err) setCode('');
  };

  if (coupon)
    return (
      <div className="flex items-center justify-between border border-dashed border-gold/70 bg-gold/5 px-3 py-2.5 text-[13px]">
        <span className="flex items-center gap-2 text-charcoal">
          <Tag size={14} className="text-gold" />
          <strong className="font-medium">{coupon.code}</strong>
          <span className="text-taupe">applied</span>
        </span>
        <button onClick={removeCoupon} aria-label="Remove coupon" className="p-1 text-taupe hover:text-ink">
          <X size={14} />
        </button>
      </div>
    );

  return (
    <div>
      <form onSubmit={submit} className="flex gap-2" noValidate>
        <label htmlFor="coupon" className="sr-only">
          Coupon code
        </label>
        <input
          id="coupon"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          placeholder="Coupon code"
          aria-invalid={!!error}
          aria-describedby={error ? 'coupon-error' : undefined}
          className="field py-2.5 uppercase placeholder:normal-case"
        />
        <button type="submit" className="btn-outline flex-none px-5 py-2.5">
          Apply
        </button>
      </form>
      {error && (
        <p id="coupon-error" className="field-error">
          {error}
        </p>
      )}
      <button type="button" onClick={() => setShowCodes((s) => !s)} className="mt-2 text-[12px] text-taupe underline underline-offset-4 hover:text-ink">
        {showCodes ? 'Hide available offers' : 'View available offers'}
      </button>
      {showCodes && (
        <ul className="mt-2 space-y-1.5 animate-fade-in">
          {COUPONS.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                onClick={() => {
                  setCode(c.code);
                  setError(null);
                }}
                className="flex w-full items-baseline gap-2 text-left text-[12.5px]"
              >
                <span className="border border-dashed border-stone px-1.5 font-medium tracking-wider text-charcoal">{c.code}</span>
                <span className="text-muted">{c.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TotalsTable({ totals, couponCode }: { totals: Totals; couponCode?: string }) {
  const Row = ({ label, value, accent }: { label: ReactNode; value: string; accent?: boolean }) => (
    <div className="flex justify-between py-1.5 text-[14px]">
      <dt className="text-muted">{label}</dt>
      <dd className={accent ? 'text-success' : 'text-charcoal'}>{value}</dd>
    </div>
  );
  return (
    <dl>
      <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
      {totals.discount > 0 && <Row label={`Coupon${couponCode ? ` (${couponCode})` : ''}`} value={`− ${formatPrice(totals.discount)}`} accent />}
      {totals.prepaidDiscount > 0 && <Row label="Prepaid discount (5%)" value={`− ${formatPrice(totals.prepaidDiscount)}`} accent />}
      <Row label="Shipping" value={totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)} />
      {totals.codFee > 0 && <Row label="Cash on Delivery fee" value={formatPrice(totals.codFee)} />}
      <div className="mt-3 flex items-baseline justify-between border-t border-sand pt-4">
        <dt className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink">Total</dt>
        <dd className="font-serif text-[28px] text-ink">{formatPrice(totals.total)}</dd>
      </div>
      <p className="text-right text-[11px] text-taupe">Inclusive of GST</p>
    </dl>
  );
}

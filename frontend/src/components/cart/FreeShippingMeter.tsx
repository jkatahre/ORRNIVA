import { Truck } from 'lucide-react';
import { COMMERCE } from '../../config/site';
import { formatPrice } from '../../utils/format';

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const remaining = COMMERCE.freeShippingThreshold - subtotal;
  const pct = Math.min(100, (subtotal / COMMERCE.freeShippingThreshold) * 100);
  return (
    <div>
      <p className="flex items-center gap-2 text-[13px] text-charcoal">
        <Truck size={15} strokeWidth={1.5} className="text-gold" />
        {remaining > 0 ? (
          <span>
            You are <strong className="font-medium">{formatPrice(remaining)}</strong> away from free shipping
          </span>
        ) : (
          <span>Your order qualifies for complimentary shipping</span>
        )}
      </p>
      <div className="mt-2.5 h-[3px] w-full bg-sand" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to free shipping">
        <div className="h-full bg-charcoal transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

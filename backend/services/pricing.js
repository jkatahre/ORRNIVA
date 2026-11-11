/**
 * Server-side pricing. Mirrors frontend/src/utils/pricing.ts and config/site.ts.
 * Order totals are always recomputed here — client-sent totals are never trusted.
 */
export const COMMERCE = {
  freeShippingThreshold: 999,
  standardShipping: 99,
  codFee: 49,
  prepaidDiscountPercent: 5,
  prepaidDiscountCap: 250,
  maxQtyPerItem: 10,
};

export const COUPONS = [
  { code: 'ORRNIVA10', type: 'percent', value: 10, minSubtotal: 0, maxDiscount: 500 },
  { code: 'WELCOME200', type: 'flat', value: 200, minSubtotal: 1499 },
  { code: 'FESTIVE15', type: 'percent', value: 15, minSubtotal: 2999, maxDiscount: 1200 },
];

export function computeTotals(subtotal, couponCode, payment) {
  const coupon = couponCode ? COUPONS.find((c) => c.code === String(couponCode).toUpperCase()) : undefined;
  let discount = 0;
  if (coupon && subtotal >= coupon.minSubtotal) {
    const raw = coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value;
    discount = Math.round(Math.min(raw, coupon.maxDiscount ?? Infinity, subtotal));
  }
  const afterCoupon = subtotal - discount;
  const prepaidDiscount =
    payment !== 'cod' ? Math.round(Math.min((afterCoupon * COMMERCE.prepaidDiscountPercent) / 100, COMMERCE.prepaidDiscountCap)) : 0;
  const shipping = subtotal === 0 || subtotal >= COMMERCE.freeShippingThreshold ? 0 : COMMERCE.standardShipping;
  const codFee = payment === 'cod' ? COMMERCE.codFee : 0;
  return {
    couponCode: discount > 0 ? coupon.code : undefined,
    subtotal,
    discount,
    prepaidDiscount,
    shipping,
    codFee,
    total: Math.max(0, afterCoupon - prepaidDiscount + shipping + codFee),
  };
}

export const newOrderId = () => `ORV${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 10)}`;

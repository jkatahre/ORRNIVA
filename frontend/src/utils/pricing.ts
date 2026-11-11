import { COMMERCE, COUPONS } from '../config/site';
import type { Coupon, PaymentMethod } from '../types';

export function findCoupon(code: string): Coupon | undefined {
  return COUPONS.find((c) => c.code === code.trim().toUpperCase());
}

/** Validate a coupon against a subtotal. Returns an error message, or null when valid. */
export function couponError(coupon: Coupon | undefined, subtotal: number): string | null {
  if (!coupon) return 'This code is not valid.';
  if (subtotal < coupon.minSubtotal)
    return `Add ₹${(coupon.minSubtotal - subtotal).toLocaleString('en-IN')} more to use ${coupon.code}.`;
  return null;
}

export function couponDiscount(coupon: Coupon | undefined, subtotal: number) {
  if (!coupon || couponError(coupon, subtotal)) return 0;
  const raw = coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value;
  return Math.round(Math.min(raw, coupon.maxDiscount ?? Infinity, subtotal));
}

export function shippingFor(subtotal: number) {
  if (subtotal === 0) return 0;
  return subtotal >= COMMERCE.freeShippingThreshold ? 0 : COMMERCE.standardShipping;
}

export interface Totals {
  subtotal: number;
  discount: number;
  prepaidDiscount: number;
  shipping: number;
  codFee: number;
  total: number;
}

export function computeTotals(subtotal: number, coupon?: Coupon, payment?: PaymentMethod): Totals {
  const discount = couponDiscount(coupon, subtotal);
  const afterCoupon = subtotal - discount;
  const prepaidDiscount =
    payment && payment !== 'cod'
      ? Math.round(Math.min((afterCoupon * COMMERCE.prepaidDiscountPercent) / 100, COMMERCE.prepaidDiscountCap))
      : 0;
  // the free-shipping threshold is checked against the merchandise subtotal
  const shipping = shippingFor(subtotal);
  const codFee = payment === 'cod' && subtotal > 0 ? COMMERCE.codFee : 0;
  return {
    subtotal,
    discount,
    prepaidDiscount,
    shipping,
    codFee,
    total: Math.max(0, afterCoupon - prepaidDiscount + shipping + codFee),
  };
}

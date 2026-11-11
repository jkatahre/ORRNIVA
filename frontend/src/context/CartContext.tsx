import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { COMMERCE } from '../config/site';
import { PRODUCT_BY_ID } from '../data/products';
import type { CartItem, Coupon, Product } from '../types';
import { couponDiscount, couponError, findCoupon } from '../utils/pricing';
import { readStore, writeStore } from '../utils/storage';
import { imageSrc } from '../utils/image';
import { useToast } from './ToastContext';

export interface CartLine extends CartItem {
  product: Product;
  lineTotal: number;
}

interface CartApi {
  lines: CartLine[];
  count: number;
  subtotal: number;
  savings: number;
  coupon?: Coupon;
  couponDiscount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (product: Product, qty?: number, opts?: { silent?: boolean; openDrawer?: boolean }) => boolean;
  setQuantity: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => string | null;
  removeCoupon: () => void;
  quantityOf: (productId: string) => number;
}

const CartContext = createContext<CartApi | null>(null);

const clampQty = (q: number, p: Product) => Math.max(1, Math.min(q, COMMERCE.maxQtyPerItem, p.stock));

export function CartProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [items, setItems] = useState<CartItem[]>(() =>
    readStore<CartItem[]>('cart', []).filter((i) => PRODUCT_BY_ID.has(i.productId)),
  );
  const [couponCode, setCouponCode] = useState<string | null>(() => readStore<string | null>('coupon', null));
  const [isOpen, setOpen] = useState(false);

  useEffect(() => writeStore('cart', items), [items]);
  useEffect(() => writeStore('coupon', couponCode), [couponCode]);

  // keep tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'orrniva:cart') setItems(readStore<CartItem[]>('cart', []));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const lines = useMemo<CartLine[]>(
    () =>
      items.flatMap((i) => {
        const product = PRODUCT_BY_ID.get(i.productId);
        return product ? [{ ...i, product, lineTotal: product.price * i.quantity }] : [];
      }),
    [items],
  );

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const savings = lines.reduce((s, l) => s + ((l.product.originalPrice ?? l.product.price) - l.product.price) * l.quantity, 0);
  const count = lines.reduce((s, l) => s + l.quantity, 0);
  const coupon = couponCode ? findCoupon(couponCode) : undefined;
  const discount = couponDiscount(coupon, subtotal);

  const add = useCallback<CartApi['add']>(
    (product, qty = 1, opts) => {
      if (!product.availability) {
        toast.show({ kind: 'info', title: 'Currently out of stock', message: product.name });
        return false;
      }
      const existing = items.find((i) => i.productId === product.id);
      const desired = (existing?.quantity ?? 0) + qty;
      const next = clampQty(desired, product);
      const capped = next < desired;
      setItems((prev) =>
        prev.some((i) => i.productId === product.id)
          ? prev.map((i) => (i.productId === product.id ? { ...i, quantity: next } : i))
          : [...prev, { productId: product.id, quantity: next }],
      );
      if (!opts?.silent) {
        toast.show({
          kind: 'success',
          title: capped ? 'Maximum quantity in bag' : 'Added to your bag',
          message: product.name,
          image: imageSrc(product.images[0], 'sm'),
          action: { label: 'View bag', to: '/cart' },
        });
      }
      if (opts?.openDrawer) setOpen(true);
      return true;
    },
    [items, toast],
  );

  const setQuantity = useCallback((productId: string, qty: number) => {
    const product = PRODUCT_BY_ID.get(productId);
    if (!product) return;
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity: clampQty(qty, product) } : i)),
    );
  }, []);

  const remove = useCallback((productId: string) => setItems((prev) => prev.filter((i) => i.productId !== productId)), []);
  const clear = useCallback(() => {
    setItems([]);
    setCouponCode(null);
  }, []);

  const applyCoupon = useCallback(
    (code: string) => {
      const c = findCoupon(code);
      const err = couponError(c, subtotal);
      if (err) return err;
      setCouponCode(c!.code);
      return null;
    },
    [subtotal],
  );

  const api: CartApi = {
    lines,
    count,
    subtotal,
    savings,
    coupon: coupon && !couponError(coupon, subtotal) ? coupon : undefined,
    couponDiscount: discount,
    isOpen,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
    add,
    setQuantity,
    remove,
    clear,
    applyCoupon,
    removeCoupon: () => setCouponCode(null),
    quantityOf: (id) => items.find((i) => i.productId === id)?.quantity ?? 0,
  };

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

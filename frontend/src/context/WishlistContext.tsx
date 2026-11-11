import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { PRODUCT_BY_ID } from '../data/products';
import type { Product } from '../types';
import { readStore, writeStore } from '../utils/storage';
import { imageSrc } from '../utils/image';
import { useToast } from './ToastContext';

interface WishlistApi {
  ids: string[];
  products: Product[];
  count: number;
  has: (id: string) => boolean;
  toggle: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistApi | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [ids, setIds] = useState<string[]>(() => readStore<string[]>('wishlist', []).filter((id) => PRODUCT_BY_ID.has(id)));

  useEffect(() => writeStore('wishlist', ids), [ids]);

  const toggle = useCallback(
    (product: Product) => {
      const exists = ids.includes(product.id);
      setIds((prev) => (exists ? prev.filter((i) => i !== product.id) : [product.id, ...prev.filter((i) => i !== product.id)]));
      toast.show(
        exists
          ? { kind: 'wishlist', title: 'Removed from wishlist', message: product.name }
          : {
              kind: 'wishlist',
              title: 'Saved to wishlist',
              message: product.name,
              image: imageSrc(product.images[0], 'sm'),
              action: { label: 'View wishlist', to: '/wishlist' },
            },
      );
    },
    [ids, toast],
  );

  const products = useMemo(() => ids.map((id) => PRODUCT_BY_ID.get(id)).filter((p): p is Product => !!p), [ids]);

  const api: WishlistApi = {
    ids,
    products,
    count: ids.length,
    has: (id) => ids.includes(id),
    toggle,
    remove: (id) => setIds((prev) => prev.filter((i) => i !== id)),
    clear: () => setIds([]),
  };

  return <WishlistContext.Provider value={api}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}

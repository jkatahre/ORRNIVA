import { useCallback, useEffect, useState } from 'react';
import { PRODUCT_BY_ID } from '../data/products';
import type { Product } from '../types';
import { readStore, writeStore } from '../utils/storage';
import { SITE } from '../config/site';

/** Sets document title and meta description for SEO. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE.name}` : `${SITE.name} — Home Decor & Lifestyle Catalogue`;
    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);
}

const RECENT_VIEW_KEY = 'recently-viewed';

export function useRecentlyViewed(currentId?: string) {
  const [ids, setIds] = useState<string[]>(() => readStore<string[]>(RECENT_VIEW_KEY, []));

  useEffect(() => {
    if (!currentId) return;
    setIds((prev) => {
      const next = [currentId, ...prev.filter((id) => id !== currentId)].slice(0, 12);
      writeStore(RECENT_VIEW_KEY, next);
      return next;
    });
  }, [currentId]);

  return ids
    .filter((id) => id !== currentId)
    .map((id) => PRODUCT_BY_ID.get(id))
    .filter((p): p is Product => !!p);
}

const RECENT_SEARCH_KEY = 'recent-searches';

export function useRecentSearches() {
  const [items, setItems] = useState<string[]>(() => readStore<string[]>(RECENT_SEARCH_KEY, []));

  const add = useCallback((q: string) => {
    const term = q.trim();
    if (!term) return;
    setItems((prev) => {
      const next = [term, ...prev.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, 6);
      writeStore(RECENT_SEARCH_KEY, next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    writeStore(RECENT_SEARCH_KEY, []);
    setItems([]);
  }, []);

  return { items, add, clear };
}

/** Lock body scroll while an overlay (drawer, modal) is open. */
export function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

/** Close on Escape. */
export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onEscape();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [active, onEscape]);
}

export function useDebounced<T>(value: T, ms = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

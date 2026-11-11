import { CATEGORY_MAP } from '../data/categories';
import { PRODUCTS } from '../data/products';
import type { Product } from '../types';

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, 'and');

function haystack(p: Product) {
  const cat = CATEGORY_MAP[p.category];
  const sub = cat.subCategories.find((s) => s.slug === p.subCategory)?.name ?? '';
  return {
    name: norm(p.name),
    meta: norm([cat.name, sub, p.productType, p.material, p.finish, ...p.tags].join(' ')),
    desc: norm(p.description),
  };
}

const INDEX = PRODUCTS.map((p) => ({ p, h: haystack(p) }));

/** Weighted keyword search across name, category, material and description. Every term must match. */
export function searchProducts(query: string): { results: Product[]; scores: Map<string, number> } {
  const q = norm(query.trim());
  const terms = q.split(/\s+/).filter((t) => t.length > 1);
  const scores = new Map<string, number>();
  if (!terms.length) return { results: [], scores };
  for (const { p, h } of INDEX) {
    let score = 0;
    let matchedAll = true;
    for (const t of terms) {
      const stem = t.length > 3 ? t.replace(/(es|s)$/, '') : t;
      const s = (h.name.includes(stem) ? 10 : 0) + (h.meta.includes(stem) ? 5 : 0) + (h.desc.includes(stem) ? 1 : 0);
      if (!s) matchedAll = false;
      score += s;
    }
    if (matchedAll && score) scores.set(p.id, score + (h.name.startsWith(q) ? 5 : 0));
  }
  const results = INDEX.filter(({ p }) => scores.has(p.id))
    .map(({ p }) => p)
    .sort((a, b) => scores.get(b.id)! - scores.get(a.id)!);
  return { results, scores };
}

export const POPULAR_SEARCHES = ['Brass', 'Marble coasters', 'Vases', 'Chopping board', 'Candle holders', 'Gift box'];

import { PRODUCT_TYPES, MATERIALS } from '../data/categories';
import type { CategorySlug, FilterState, Material, Product, ProductType, SortKey } from '../types';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
];

const CATS: CategorySlug[] = ['home-accessories', 'kitchen-bar', 'gifting'];
const toSlug = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
const TYPE_BY_SLUG = Object.fromEntries(PRODUCT_TYPES.map((t) => [toSlug(t), t])) as Record<string, ProductType>;
const MAT_BY_SLUG = Object.fromEntries(MATERIALS.map((m) => [toSlug(m), m])) as Record<string, Material>;
export const typeSlug = (t: ProductType) => toSlug(t);
export const materialSlug = (m: Material) => toSlug(m);

const list = (sp: URLSearchParams, key: string) =>
  (sp.get(key) ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const num = (v: string | null) => {
  if (v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/** Filter state lives in the URL so collection pages are shareable and back-button friendly. */
export function parseFilters(sp: URLSearchParams, defaultSort: SortKey = 'featured'): FilterState {
  const sort = sp.get('sort') as SortKey | null;
  return {
    categories: list(sp, 'category').filter((c): c is CategorySlug => CATS.includes(c as CategorySlug)),
    types: list(sp, 'type')
      .map((t) => TYPE_BY_SLUG[t])
      .filter(Boolean),
    materials: list(sp, 'material')
      .map((m) => MAT_BY_SLUG[m])
      .filter(Boolean),
    availability: list(sp, 'availability').filter(
      (a): a is 'in-stock' | 'out-of-stock' => a === 'in-stock' || a === 'out-of-stock',
    ),
    minPrice: num(sp.get('min')),
    maxPrice: num(sp.get('max')),
    sort: sort && SORT_OPTIONS.some((o) => o.value === sort) ? sort : defaultSort,
  };
}

export function filtersToParams(f: FilterState, base: URLSearchParams, defaultSort: SortKey = 'featured') {
  const sp = new URLSearchParams(base);
  const set = (k: string, v: string) => (v ? sp.set(k, v) : sp.delete(k));
  set('category', f.categories.join(','));
  set('type', f.types.map(typeSlug).join(','));
  set('material', f.materials.map(materialSlug).join(','));
  set('availability', f.availability.join(','));
  set('min', f.minPrice !== null ? String(f.minPrice) : '');
  set('max', f.maxPrice !== null ? String(f.maxPrice) : '');
  set('sort', f.sort !== defaultSort ? f.sort : '');
  return sp;
}

export function activeFilterCount(f: FilterState) {
  return (
    f.categories.length +
    f.types.length +
    f.materials.length +
    f.availability.length +
    (f.minPrice !== null || f.maxPrice !== null ? 1 : 0)
  );
}

/**
 * Apply all filters. `exclude` skips one facet so its option counts reflect
 * what would match if that facet changed (standard faceted-search behaviour).
 */
export function applyFilters(products: Product[], f: FilterState, exclude?: keyof FilterState) {
  return products.filter((p) => {
    if (exclude !== 'categories' && f.categories.length && !f.categories.includes(p.category)) return false;
    if (exclude !== 'types' && f.types.length && !f.types.includes(p.productType)) return false;
    if (exclude !== 'materials' && f.materials.length && !f.materials.includes(p.material)) return false;
    if (exclude !== 'availability' && f.availability.length) {
      const state = p.availability ? 'in-stock' : 'out-of-stock';
      if (!f.availability.includes(state)) return false;
    }
    if (exclude !== 'minPrice') {
      if (f.minPrice !== null && p.price < f.minPrice) return false;
      if (f.maxPrice !== null && p.price > f.maxPrice) return false;
    }
    return true;
  });
}

/** Relevance: featured & bestselling items first, then rating weighted by review volume. */
const relevanceScore = (p: Product) =>
  (p.isFeatured ? 3 : 0) +
  (p.isBestSeller ? 2 : 0) +
  (p.isNewArrival ? 1 : 0) +
  (p.rating ?? 0) * Math.log10((p.reviewCount ?? 0) + 1);

export function sortProducts(products: Product[], sort: SortKey, scores?: Map<string, number>) {
  const arr = [...products];
  const inStockFirst = (a: Product, b: Product) => Number(b.availability) - Number(a.availability);
  switch (sort) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'newest':
      return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'best-selling':
      return arr.sort((a, b) => a.salesRank - b.salesRank);
    case 'rating':
      return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    case 'relevance':
      return arr.sort(
        (a, b) => (scores?.get(b.id) ?? 0) - (scores?.get(a.id) ?? 0) || relevanceScore(b) - relevanceScore(a),
      );
    case 'featured':
    default:
      return arr.sort(
        (a, b) =>
          inStockFirst(a, b) || Number(b.isFeatured) - Number(a.isFeatured) || relevanceScore(b) - relevanceScore(a),
      );
  }
}

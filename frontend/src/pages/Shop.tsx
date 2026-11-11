import { useCallback, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { SlidersHorizontal, ArrowUpDown, X, SearchX } from 'lucide-react';
import { CATEGORIES, CATEGORY_MAP, COLLECTION_MAP } from '../data/categories';
import { PRODUCTS } from '../data/products';
import type { CategorySlug, FilterState, Product, SortKey } from '../types';
import { activeFilterCount, applyFilters, filtersToParams, parseFilters, SORT_OPTIONS, sortProducts } from '../utils/filters';
import { pluralize } from '../utils/format';
import { usePageMeta, useEscape, useLockBody } from '../hooks';
import { Breadcrumbs, EmptyState } from '../components/common';
import { ProductGrid } from '../components/product/ProductGrid';
import { FilterPanel } from '../components/filters/FilterPanel';
import { FilterChips, SortMenu } from '../components/filters/FilterBar';
import NotFound from './NotFound';

interface Scope {
  title: string;
  description: string;
  products: Product[];
  crumbs: { label: string; to?: string }[];
  isCategory?: CategorySlug;
  subLinks?: { label: string; to: string; active: boolean; count: number }[];
  defaultSort?: SortKey;
}

function resolveScope(handle?: string, sub?: string): Scope | null {
  const home = { label: 'Home', to: '/' };
  if (!handle || handle === 'all') {
    return {
      title: 'All Products',
      description:
        'The complete Orrniva catalogue — handcrafted home accessories, kitchen and bar essentials, and gifts, made in small batches by artisan workshops across India.',
      products: PRODUCTS,
      crumbs: [home, { label: 'All Products' }],
      subLinks: CATEGORIES.map((c) => ({
        label: c.name,
        to: `/collections/${c.slug}`,
        active: false,
        count: PRODUCTS.filter((p) => p.category === c.slug).length,
      })),
    };
  }
  const cat = CATEGORY_MAP[handle as CategorySlug];
  if (cat) {
    const inCat = PRODUCTS.filter((p) => p.category === cat.slug);
    const subCat = sub ? cat.subCategories.find((s) => s.slug === sub) : undefined;
    if (sub && !subCat) return null;
    const subLinks = [
      { label: 'All', to: `/collections/${cat.slug}`, active: !subCat, count: inCat.length },
      ...cat.subCategories.map((s) => ({
        label: s.name,
        to: `/collections/${cat.slug}/${s.slug}`,
        active: s.slug === sub,
        count: inCat.filter((p) => p.subCategory === s.slug).length,
      })),
    ].filter((l) => l.count > 0);
    return {
      title: subCat ? subCat.name : cat.name,
      description: subCat ? `${subCat.name} from our ${cat.name} catalogue. ${cat.description}` : cat.description,
      products: subCat ? inCat.filter((p) => p.subCategory === subCat.slug) : inCat,
      crumbs: [home, { label: 'Shop', to: '/collections/all' }, ...(subCat ? [{ label: cat.name, to: `/collections/${cat.slug}` }, { label: subCat.name }] : [{ label: cat.name }])],
      isCategory: cat.slug,
      subLinks,
    };
  }
  const col = COLLECTION_MAP[handle];
  if (col && !sub) {
    return {
      title: col.name,
      description: col.description,
      products: PRODUCTS.filter(col.match),
      crumbs: [home, { label: 'Collections', to: '/collections/all' }, { label: col.name }],
      defaultSort: handle === 'new-arrivals' ? 'newest' : handle === 'best-sellers' ? 'best-selling' : 'featured',
    };
  }
  return null;
}

export default function Shop() {
  const { handle, sub } = useParams();
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState<null | 'filter' | 'sort'>(null);
  const closeDrawer = useCallback(() => setDrawer(null), []);
  useEscape(!!drawer, closeDrawer);
  useLockBody(!!drawer);

  const scope = useMemo(() => resolveScope(handle, sub), [handle, sub]);
  const defaultSort = scope?.defaultSort ?? 'featured';
  const filters = useMemo(() => parseFilters(params, defaultSort), [params, defaultSort]);

  usePageMeta(scope?.title ?? 'Not found', scope?.description);

  const priceBounds = useMemo(() => {
    const prices = (scope?.products ?? PRODUCTS).map((p) => p.price);
    return { min: Math.floor(Math.min(...prices) / 100) * 100, max: Math.ceil(Math.max(...prices) / 100) * 100 };
  }, [scope]);

  const results = useMemo(() => (scope ? sortProducts(applyFilters(scope.products, filters), filters.sort) : []), [scope, filters]);

  const update = useCallback(
    (f: FilterState) => setParams(filtersToParams(f, params, defaultSort), { replace: true, preventScrollReset: true }),
    [params, setParams, defaultSort],
  );
  const clearAll = useCallback(
    () => update({ categories: [], types: [], materials: [], availability: [], minPrice: null, maxPrice: null, sort: filters.sort }),
    [update, filters.sort],
  );

  if (!scope) return <NotFound />;
  const active = activeFilterCount(filters);
  const hideCategory = !!scope.isCategory;

  return (
    <div>
      {/* Collection header */}
      <header className="border-b border-sand">
        <div className="container-x pt-8 pb-8 md:pt-10 md:pb-10">
          <Breadcrumbs items={scope.crumbs} />
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-[40px] md:text-[56px]">{scope.title}</h1>
              <p className="mt-3 text-[15.5px] text-muted">{scope.description}</p>
            </div>
            <p className="text-[13px] text-taupe md:text-right">
              <span className="font-serif text-[28px] text-ink">{scope.products.length}</span>
              <span className="ml-2">pieces in this collection</span>
            </p>
          </div>
          {scope.subLinks && scope.subLinks.length > 1 && (
            <nav aria-label="Sub-categories" className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
              {scope.subLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  aria-current={l.active ? 'page' : undefined}
                  className={`flex-none border px-4 py-2 text-[12.5px] transition-colors ${l.active ? 'border-charcoal bg-charcoal text-ivory' : 'border-stone text-charcoal hover:border-charcoal'}`}
                >
                  {l.label} <span className={l.active ? 'text-ivory/60' : 'text-taupe'}>{l.count}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      <div className="container-x py-8 lg:grid lg:grid-cols-[250px_1fr] lg:gap-12 lg:py-10">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-[150px] max-h-[calc(100vh-170px)] overflow-y-auto pr-2 pb-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-ink">
                Filters {active > 0 && <span className="text-gold">· {active}</span>}
              </h2>
              {active > 0 && (
                <button onClick={clearAll} className="text-[12px] text-muted underline underline-offset-4 hover:text-ink">
                  Clear all
                </button>
              )}
            </div>
            <FilterPanel idPrefix="desk" scope={scope.products} filters={filters} onChange={update} priceBounds={priceBounds} hideCategory={hideCategory} />
          </div>
        </aside>

        <section aria-label="Products">
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-sand pb-4">
            <p className="text-[13px] text-muted" aria-live="polite">
              Showing <span className="text-ink">{pluralize(results.length, 'product')}</span>
              {results.length !== scope.products.length && <> of {scope.products.length}</>}
            </p>
            <div className="hidden lg:block">
              <SortMenu value={filters.sort} onChange={(s) => update({ ...filters, sort: s })} />
            </div>
          </div>

          {/* Mobile toolbar */}
          <div className="sticky top-16 z-20 -mx-4 mb-6 grid grid-cols-2 border-y border-sand bg-ivory/95 backdrop-blur sm:-mx-6 lg:hidden">
            <button onClick={() => setDrawer('filter')} className="flex items-center justify-center gap-2 border-r border-sand py-3 text-[12px] font-medium uppercase tracking-[0.16em]">
              <SlidersHorizontal size={15} strokeWidth={1.5} /> Filter {active > 0 && <span className="text-gold">({active})</span>}
            </button>
            <button onClick={() => setDrawer('sort')} className="flex items-center justify-center gap-2 py-3 text-[12px] font-medium uppercase tracking-[0.16em]">
              <ArrowUpDown size={15} strokeWidth={1.5} /> Sort
            </button>
          </div>

          {active > 0 && (
            <div className="mb-6">
              <FilterChips filters={filters} onChange={update} onClear={clearAll} />
            </div>
          )}

          {results.length === 0 ? (
            <EmptyState
              icon={<SearchX size={22} strokeWidth={1.5} />}
              title="No pieces match these filters"
              message="Try removing a filter or widening the price range to see more of the catalogue."
            >
              <button onClick={clearAll} className="btn-dark">
                Reset filters
              </button>
              <Link to="/collections/all" className="btn-light">
                View all products
              </Link>
            </EmptyState>
          ) : (
            <ProductGrid products={results} columns={3} priorityCount={3} />
          )}
        </section>
      </div>

      {/* Mobile drawers */}
      {drawer && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label={drawer === 'filter' ? 'Filters' : 'Sort'}>
          <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={closeDrawer} />
          {drawer === 'filter' ? (
            <div className="absolute inset-y-0 right-0 flex w-[90%] max-w-sm animate-slide-in-right flex-col bg-ivory">
              <div className="flex h-16 items-center justify-between border-b border-sand px-5">
                <h2 className="font-serif text-[24px]">Filters {active > 0 && <span className="text-[15px] text-gold">({active})</span>}</h2>
                <button onClick={closeDrawer} aria-label="Close filters" className="-mr-2 flex h-10 w-10 items-center justify-center">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <FilterPanel idPrefix="mob" scope={scope.products} filters={filters} onChange={update} priceBounds={priceBounds} hideCategory={hideCategory} />
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-sand p-4">
                <button onClick={clearAll} className="btn-light" disabled={!active}>
                  Clear all
                </button>
                <button onClick={closeDrawer} className="btn-dark">
                  Show {results.length}
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute inset-x-0 bottom-0 animate-fade-in bg-ivory pb-[env(safe-area-inset-bottom)]">
              <div className="flex items-center justify-between border-b border-sand px-5 py-4">
                <h2 className="font-serif text-[22px]">Sort by</h2>
                <button onClick={closeDrawer} aria-label="Close sort" className="-mr-2 flex h-10 w-10 items-center justify-center">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              <ul className="py-2" role="listbox" aria-label="Sort products">
                {SORT_OPTIONS.map((o) => (
                  <li key={o.value} role="option" aria-selected={filters.sort === o.value}>
                    <button
                      onClick={() => {
                        update({ ...filters, sort: o.value });
                        closeDrawer();
                      }}
                      className={`flex w-full items-center justify-between px-5 py-3 text-left text-[15px] ${filters.sort === o.value ? 'font-normal text-ink' : 'text-muted'}`}
                    >
                      {o.label}
                      {filters.sort === o.value && <span className="h-1.5 w-1.5 rounded-full bg-charcoal" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

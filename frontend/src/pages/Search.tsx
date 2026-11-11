import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search as SearchIcon, SearchX } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { usePageMeta, useRecentSearches } from '../hooks';
import { POPULAR_SEARCHES, searchProducts } from '../utils/search';
import { sortProducts, SORT_OPTIONS } from '../utils/filters';
import type { SortKey } from '../types';
import { Breadcrumbs, EmptyState, SectionHeading } from '../components/common';
import { ProductGrid } from '../components/product/ProductGrid';
import { SortMenu } from '../components/filters/FilterBar';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const sort = (params.get('sort') as SortKey) || 'relevance';
  const [input, setInput] = useState(q);
  const recent = useRecentSearches();
  const { add } = recent;

  usePageMeta(q ? `Search: ${q}` : 'Search');
  useEffect(() => {
    setInput(q);
    if (q) add(q);
  }, [q, add]);

  const { results, scores } = useMemo(() => searchProducts(q), [q]);
  const sorted = useMemo(() => sortProducts(results, sort, scores), [results, sort, scores]);
  const matchingCats = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    return CATEGORIES.flatMap((c) => [
      ...(c.name.toLowerCase().includes(t) ? [{ name: c.name, to: `/collections/${c.slug}` }] : []),
      ...c.subCategories.filter((s) => s.name.toLowerCase().includes(t)).map((s) => ({ name: s.name, to: `/collections/${c.slug}/${s.slug}` })),
    ]);
  }, [q]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = input.trim();
    if (t) setParams({ q: t });
  };

  const popular = sortProducts(PRODUCTS.filter((p) => p.availability), 'best-selling').slice(0, 4);

  return (
    <div>
      <header className="border-b border-sand">
        <div className="container-x py-8 md:py-10">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
          <h1 className="mt-6 text-[36px] md:text-[48px]">{q ? <>Results for “{q}”</> : 'Search the catalogue'}</h1>
          <form onSubmit={submit} role="search" className="mt-6 flex max-w-2xl items-center gap-3 border-b border-charcoal pb-2">
            <SearchIcon size={18} strokeWidth={1.5} className="text-taupe" />
            <label htmlFor="search-page-input" className="sr-only">Search products</label>
            <input
              id="search-page-input"
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Try ‘brass candle’, ‘marble’ or ‘gift box’"
              className="min-w-0 flex-1 bg-transparent py-2 text-[16px] focus:outline-none"
            />
            <button type="submit" className="text-[11px] font-medium uppercase tracking-[0.18em]">Search</button>
          </form>
          {matchingCats.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-[13px]">
              <span className="text-taupe">Categories:</span>
              {matchingCats.map((c) => (
                <Link key={c.to} to={c.to} className="border border-stone px-3 py-1 hover:border-charcoal">{c.name}</Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="container-x py-10">
        {!q ? (
          <div className="grid gap-10 md:grid-cols-2">
            {recent.items.length > 0 && (
              <div>
                <p className="eyebrow mb-3">Recent searches</p>
                <div className="flex flex-wrap gap-2">
                  {recent.items.map((t) => (
                    <button key={t} onClick={() => setParams({ q: t })} className="border border-stone px-3.5 py-1.5 text-[13px] hover:border-charcoal">{t}</button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="eyebrow mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((t) => (
                  <button key={t} onClick={() => setParams({ q: t })} className="border border-stone px-3.5 py-1.5 text-[13px] hover:border-charcoal">{t}</button>
                ))}
              </div>
            </div>
          </div>
        ) : sorted.length === 0 ? (
          <>
            <EmptyState icon={<SearchX size={22} strokeWidth={1.5} />} title={`No results for “${q}”`} message="Check the spelling, try a more general term, or search by material — brass, marble, wood, ceramic or glass.">
              {POPULAR_SEARCHES.slice(0, 4).map((t) => (
                <button key={t} onClick={() => setParams({ q: t })} className="btn-light px-4 py-2">{t}</button>
              ))}
            </EmptyState>
            <section className="pt-16">
              <SectionHeading eyebrow="Popular right now" title="You might like these" />
              <ProductGrid products={popular} />
            </section>
          </>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between border-b border-sand pb-4">
              <p className="text-[13px] text-muted" aria-live="polite">
                {sorted.length} {sorted.length === 1 ? 'piece' : 'pieces'} found
              </p>
              <SortMenu value={sort} options={SORT_OPTIONS} onChange={(s) => setParams({ q, ...(s !== 'relevance' ? { sort: s } : {}) })} />
            </div>
            <ProductGrid products={sorted} priorityCount={4} />
          </>
        )}
      </div>
    </div>
  );
}

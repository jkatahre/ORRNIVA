import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, Clock, Search, X } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { useDebounced, useEscape, useLockBody, useRecentSearches } from '../../hooks';
import { POPULAR_SEARCHES, searchProducts } from '../../utils/search';
import { formatPrice } from '../../utils/format';
import { Img } from '../common';

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const debounced = useDebounced(q, 120);
  const recent = useRecentSearches();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  useEscape(open, onClose);
  useLockBody(open);

  useEffect(() => {
    if (open) {
      setQ('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const { results } = useMemo(() => searchProducts(debounced), [debounced]);
  const subMatches = useMemo(() => {
    const t = debounced.trim().toLowerCase();
    if (t.length < 2) return [];
    return CATEGORIES.flatMap((c) =>
      [{ name: c.name, to: `/collections/${c.slug}`, parent: '' }, ...c.subCategories.map((s) => ({ name: s.name, to: `/collections/${c.slug}/${s.slug}`, parent: c.name }))],
    )
      .filter((x) => x.name.toLowerCase().includes(t))
      .slice(0, 4);
  }, [debounced]);

  const go = (term: string) => {
    const t = term.trim();
    if (!t) return;
    recent.add(t);
    onClose();
    navigate(`/search?q=${encodeURIComponent(t)}`);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    go(q);
  };

  if (!open) return null;
  const hasQuery = debounced.trim().length >= 2;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={onClose} />
      <div className="relative max-h-[100dvh] animate-fade-in overflow-y-auto border-b border-sand bg-ivory">
        <div className="container-x py-5 md:py-8">
          <form onSubmit={submit} role="search" className="flex items-center gap-3 border-b border-charcoal pb-3">
            <Search size={20} strokeWidth={1.5} className="flex-none text-taupe" />
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <input
              ref={inputRef}
              id="site-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by product, category or material"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent font-serif text-[22px] text-ink placeholder:text-taupe/70 focus:outline-none md:text-[30px] [&::-webkit-search-cancel-button]:hidden"
            />
            {q && (
              <button type="button" onClick={() => setQ('')} className="text-[11px] uppercase tracking-[0.16em] text-taupe hover:text-ink">
                Clear
              </button>
            )}
            <button type="button" onClick={onClose} aria-label="Close search" className="flex h-10 w-10 items-center justify-center">
              <X size={20} strokeWidth={1.5} />
            </button>
          </form>

          {!hasQuery ? (
            <div className="grid gap-8 py-8 md:grid-cols-2">
              {recent.items.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="eyebrow">Recent searches</p>
                    <button onClick={recent.clear} className="text-[11px] text-taupe underline underline-offset-4 hover:text-ink">
                      Clear
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {recent.items.map((t) => (
                      <li key={t}>
                        <button onClick={() => go(t)} className="flex items-center gap-3 py-1.5 text-[15px] text-charcoal hover:text-ink">
                          <Clock size={14} className="text-taupe" />
                          {t}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="eyebrow mb-3">Popular searches</p>
                <ul className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((t) => (
                    <li key={t}>
                      <button onClick={() => go(t)} className="border border-stone px-3.5 py-1.5 text-[13px] text-charcoal transition-colors hover:border-charcoal">
                        {t}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 py-8 md:grid-cols-[220px_1fr]">
              <div>
                <p className="eyebrow mb-3">Suggestions</p>
                <ul className="space-y-1.5">
                  <li>
                    <button onClick={() => go(debounced)} className="flex items-center gap-2 text-[15px] text-ink">
                      Search “{debounced.trim()}” <ArrowRight size={14} />
                    </button>
                  </li>
                  {subMatches.map((s) => (
                    <li key={s.to}>
                      <Link to={s.to} onClick={onClose} className="text-[14px] text-charcoal hover:underline hover:underline-offset-4">
                        {s.name}
                        {s.parent && <span className="text-taupe"> in {s.parent}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-3">
                  Products {results.length > 0 && <span className="text-gold">({results.length})</span>}
                </p>
                {results.length === 0 ? (
                  <p className="text-muted">No pieces match “{debounced.trim()}”. Try a material like brass or marble, or browse a category.</p>
                ) : (
                  <>
                    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                      {results.slice(0, 5).map((p) => (
                        <li key={p.id}>
                          <Link to={`/products/${p.slug}`} onClick={() => { recent.add(debounced); onClose(); }} className="group block">
                            <div className="aspect-square overflow-hidden bg-cream">
                              <Img imageKey={p.images[0]} alt="" sizes="160px" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                            </div>
                            <p className="mt-2 font-serif text-[16px] leading-snug text-ink">{p.name}</p>
                            <p className="text-[13px] text-muted">{formatPrice(p.price)}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {results.length > 5 && (
                      <button onClick={() => go(debounced)} className="btn-outline mt-6">
                        View all {results.length} results
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

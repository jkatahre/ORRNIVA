import { useState, type ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { CATEGORIES, MATERIALS, PRODUCT_TYPES } from '../../data/categories';
import type { CategorySlug, FilterState, Material, Product, ProductType } from '../../types';
import { applyFilters } from '../../utils/filters';
import { PriceRange } from './PriceRange';

interface Props {
  scope: Product[]; // products in the current collection, before facet filters
  filters: FilterState;
  onChange: (f: FilterState) => void;
  priceBounds: { min: number; max: number };
  hideCategory?: boolean;
  idPrefix: string;
}

function Group({ title, count, children, defaultOpen = true }: { title: string; count?: number; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-sand py-5 first:pt-0">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between text-left">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
          {title}
          {!!count && <span className="ml-2 text-gold">({count})</span>}
        </span>
        <ChevronDown size={15} className={`text-taupe transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-4 animate-fade-in">{children}</div>}
    </section>
  );
}

function CheckRow({ label, count, checked, onToggle, disabled }: { label: string; count: number; checked: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <label className={`group flex cursor-pointer items-center gap-3 py-[5px] text-[14px] ${disabled && !checked ? 'cursor-default opacity-40' : ''}`}>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onToggle} disabled={disabled && !checked} />
      <span className={`flex h-4 w-4 flex-none items-center justify-center border transition-colors peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-gold ${checked ? 'border-charcoal bg-charcoal text-ivory' : 'border-stone group-hover:border-charcoal'}`}>
        {checked && <Check size={11} strokeWidth={2.5} />}
      </span>
      <span className="flex-1 text-charcoal">{label}</span>
      <span className="text-[12px] text-taupe tabular-nums">{count}</span>
    </label>
  );
}

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export function FilterPanel({ scope, filters, onChange, priceBounds, hideCategory, idPrefix }: Props) {
  // Facet counts: each facet counts against all *other* active filters.
  const countBy = <K extends string>(exclude: keyof FilterState, key: (p: Product) => K) => {
    const m = new Map<K, number>();
    for (const p of applyFilters(scope, filters, exclude)) m.set(key(p), (m.get(key(p)) ?? 0) + 1);
    return m;
  };
  const catCounts = countBy<CategorySlug>('categories', (p) => p.category);
  const typeCounts = countBy<ProductType>('types', (p) => p.productType);
  const matCounts = countBy<Material>('materials', (p) => p.material);
  const availCounts = countBy<'in-stock' | 'out-of-stock'>('availability', (p) => (p.availability ? 'in-stock' : 'out-of-stock'));

  // only show options that exist in this collection at all
  const inScope = <T,>(all: T[], key: (p: Product) => T) => all.filter((v) => scope.some((p) => key(p) === v));
  const types = inScope(PRODUCT_TYPES, (p) => p.productType);
  const materials = inScope(MATERIALS, (p) => p.material);
  const cats = CATEGORIES.filter((c) => scope.some((p) => p.category === c.slug));

  return (
    <div>
      {!hideCategory && cats.length > 1 && (
        <Group title="Category" count={filters.categories.length}>
          {cats.map((c) => (
            <CheckRow
              key={c.slug}
              label={c.name}
              count={catCounts.get(c.slug) ?? 0}
              checked={filters.categories.includes(c.slug)}
              disabled={!catCounts.get(c.slug)}
              onToggle={() => onChange({ ...filters, categories: toggle(filters.categories, c.slug) })}
            />
          ))}
        </Group>
      )}

      {types.length > 1 && (
        <Group title="Product Type" count={filters.types.length}>
          {types.map((t) => (
            <CheckRow
              key={t}
              label={t}
              count={typeCounts.get(t) ?? 0}
              checked={filters.types.includes(t)}
              disabled={!typeCounts.get(t)}
              onToggle={() => onChange({ ...filters, types: toggle(filters.types, t) })}
            />
          ))}
        </Group>
      )}

      {materials.length > 1 && (
        <Group title="Material" count={filters.materials.length}>
          {materials.map((m) => (
            <CheckRow
              key={m}
              label={m}
              count={matCounts.get(m) ?? 0}
              checked={filters.materials.includes(m)}
              disabled={!matCounts.get(m)}
              onToggle={() => onChange({ ...filters, materials: toggle(filters.materials, m) })}
            />
          ))}
        </Group>
      )}

      <Group title="Availability" count={filters.availability.length}>
        {(['in-stock', 'out-of-stock'] as const).map((a) => (
          <CheckRow
            key={a}
            label={a === 'in-stock' ? 'In stock' : 'Out of stock'}
            count={availCounts.get(a) ?? 0}
            checked={filters.availability.includes(a)}
            disabled={!availCounts.get(a)}
            onToggle={() => onChange({ ...filters, availability: toggle(filters.availability, a) })}
          />
        ))}
      </Group>

      <Group title="Price" count={filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0}>
        <PriceRange
          idPrefix={idPrefix}
          bounds={priceBounds}
          value={{ min: filters.minPrice, max: filters.maxPrice }}
          onChange={(min, max) => onChange({ ...filters, minPrice: min, maxPrice: max })}
        />
      </Group>
    </div>
  );
}

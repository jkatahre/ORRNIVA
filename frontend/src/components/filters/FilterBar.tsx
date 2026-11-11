import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { CATEGORY_MAP } from '../../data/categories';
import type { FilterState, SortKey } from '../../types';
import { SORT_OPTIONS } from '../../utils/filters';
import { formatPrice } from '../../utils/format';

export function SortMenu({ value, onChange, options = SORT_OPTIONS }: { value: SortKey; onChange: (s: SortKey) => void; options?: typeof SORT_OPTIONS }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);
  const current = options.find((o) => o.value === value) ?? options[0];
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 text-[13px] text-charcoal"
      >
        <span className="text-taupe">Sort by:</span>
        <span className="font-normal">{current.label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul role="listbox" aria-label="Sort products" className="absolute right-0 z-30 mt-3 w-56 animate-fade-in border border-sand bg-ivory py-2 shadow-[0_16px_40px_-16px_rgba(43,39,36,0.3)]">
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-[13px] text-charcoal hover:bg-cream"
              >
                {o.label}
                {o.value === value && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FilterChips({ filters, onChange, onClear }: { filters: FilterState; onChange: (f: FilterState) => void; onClear: () => void }) {
  const chips: { label: string; remove: () => FilterState }[] = [
    ...filters.categories.map((c) => ({ label: CATEGORY_MAP[c].name, remove: () => ({ ...filters, categories: filters.categories.filter((x) => x !== c) }) })),
    ...filters.types.map((t) => ({ label: t, remove: () => ({ ...filters, types: filters.types.filter((x) => x !== t) }) })),
    ...filters.materials.map((m) => ({ label: m, remove: () => ({ ...filters, materials: filters.materials.filter((x) => x !== m) }) })),
    ...filters.availability.map((a) => ({
      label: a === 'in-stock' ? 'In stock' : 'Out of stock',
      remove: () => ({ ...filters, availability: filters.availability.filter((x) => x !== a) }),
    })),
  ];
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const label =
      filters.minPrice !== null && filters.maxPrice !== null
        ? `${formatPrice(filters.minPrice)} – ${formatPrice(filters.maxPrice)}`
        : filters.minPrice !== null
          ? `From ${formatPrice(filters.minPrice)}`
          : `Up to ${formatPrice(filters.maxPrice!)}`;
    chips.push({ label, remove: () => ({ ...filters, minPrice: null, maxPrice: null }) });
  }
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.label}
          type="button"
          onClick={() => onChange(c.remove())}
          className="group flex items-center gap-1.5 border border-stone bg-white/50 py-1 pr-2 pl-3 text-[12px] text-charcoal transition-colors hover:border-charcoal"
          aria-label={`Remove filter ${c.label}`}
        >
          {c.label}
          <X size={12} className="text-taupe group-hover:text-charcoal" />
        </button>
      ))}
      <button type="button" onClick={onClear} className="ml-1 text-[12px] font-medium text-charcoal underline underline-offset-4">
        Clear all
      </button>
    </div>
  );
}

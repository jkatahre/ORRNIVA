import { useEffect, useState } from 'react';
import { formatPrice } from '../../utils/format';

interface Props {
  bounds: { min: number; max: number };
  value: { min: number | null; max: number | null };
  onChange: (min: number | null, max: number | null) => void;
  idPrefix: string;
}

const STEP = 100;

/** Dual-thumb range slider with linked min/max number inputs. Commits on release / blur. */
export function PriceRange({ bounds, value, onChange, idPrefix }: Props) {
  const [lo, setLo] = useState(value.min ?? bounds.min);
  const [hi, setHi] = useState(value.max ?? bounds.max);

  useEffect(() => {
    setLo(value.min ?? bounds.min);
    setHi(value.max ?? bounds.max);
  }, [value.min, value.max, bounds.min, bounds.max]);

  const commit = (l = lo, h = hi) => {
    let a = Math.max(bounds.min, Math.min(l, bounds.max));
    let b = Math.max(bounds.min, Math.min(h, bounds.max));
    if (a > b) [a, b] = [b, a];
    setLo(a);
    setHi(b);
    onChange(a <= bounds.min ? null : a, b >= bounds.max ? null : b);
  };

  const pct = (v: number) => ((v - bounds.min) / (bounds.max - bounds.min)) * 100;

  return (
    <div>
      <div className="relative mt-2 mb-5 h-4">
        <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-stone" />
        <div className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-charcoal" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input
          type="range"
          aria-label="Minimum price"
          min={bounds.min}
          max={bounds.max}
          step={STEP}
          value={lo}
          onChange={(e) => setLo(Math.min(Number(e.target.value), hi - STEP))}
          onPointerUp={() => commit()}
          onKeyUp={() => commit()}
          className="range-thumb absolute inset-0 h-4 w-full"
        />
        <input
          type="range"
          aria-label="Maximum price"
          min={bounds.min}
          max={bounds.max}
          step={STEP}
          value={hi}
          onChange={(e) => setHi(Math.max(Number(e.target.value), lo + STEP))}
          onPointerUp={() => commit()}
          onKeyUp={() => commit()}
          className="range-thumb absolute inset-0 h-4 w-full"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="flex-1" htmlFor={`${idPrefix}-min`}>
          <span className="sr-only">Minimum price in rupees</span>
          <div className="flex items-center border border-stone bg-white/60 px-2.5 focus-within:border-charcoal">
            <span className="text-[13px] text-taupe">₹</span>
            <input
              id={`${idPrefix}-min`}
              type="number"
              inputMode="numeric"
              min={bounds.min}
              max={bounds.max}
              value={lo}
              onChange={(e) => setLo(Number(e.target.value))}
              onBlur={() => commit()}
              onKeyDown={(e) => e.key === 'Enter' && commit()}
              className="w-full bg-transparent py-2 pl-1 text-[13px] focus:outline-none"
            />
          </div>
        </label>
        <span className="text-taupe">–</span>
        <label className="flex-1" htmlFor={`${idPrefix}-max`}>
          <span className="sr-only">Maximum price in rupees</span>
          <div className="flex items-center border border-stone bg-white/60 px-2.5 focus-within:border-charcoal">
            <span className="text-[13px] text-taupe">₹</span>
            <input
              id={`${idPrefix}-max`}
              type="number"
              inputMode="numeric"
              min={bounds.min}
              max={bounds.max}
              value={hi}
              onChange={(e) => setHi(Number(e.target.value))}
              onBlur={() => commit()}
              onKeyDown={(e) => e.key === 'Enter' && commit()}
              className="w-full bg-transparent py-2 pl-1 text-[13px] focus:outline-none"
            />
          </div>
        </label>
      </div>
      <p className="mt-2 text-[12px] text-taupe">
        {formatPrice(lo)} – {formatPrice(hi)}
      </p>
    </div>
  );
}

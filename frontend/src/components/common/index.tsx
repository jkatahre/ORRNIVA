import { useState, type ImgHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronDown, ChevronRight, Minus, Plus, Star } from 'lucide-react';
import { imageSrc, imageSrcSet } from '../../utils/image';
import { discountPercent, formatPrice } from '../../utils/format';

// ——— Responsive, lazy image from an image key
interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  imageKey: string;
  sizes?: string;
  priority?: boolean;
}
export function Img({ imageKey, sizes = '(min-width: 1024px) 25vw, 50vw', priority, className = '', alt = '', ...rest }: ImgProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      ref={(el) => {
        // cached images can finish before React's onLoad is attached
        if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true);
      }}
      onError={() => setLoaded(true)}
      src={imageSrc(imageKey)}
      srcSet={imageSrcSet(imageKey)}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      {...rest}
    />
  );
}

// ——— Brand wordmark
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 flex-none" aria-hidden>
        <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="16" cy="16" r="8.5" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" />
        <path d="M16 1.5v29M1.5 16h29" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      </svg>
      <span className="font-serif text-[26px] leading-none font-medium tracking-[0.2em] text-ink">ORRNIVA</span>
    </span>
  );
}

// ——— Breadcrumbs
export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[12px] text-taupe">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} className="text-stone" />}
            {it.to ? (
              <Link to={it.to} className="transition-colors hover:text-charcoal">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-charcoal">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ——— Price
export function Price({ price, original, size = 'sm' }: { price: number; original?: number; size?: 'sm' | 'lg' }) {
  const off = discountPercent(price, original);
  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${size === 'lg' ? 'text-2xl' : 'text-[14px]'}`}>
      <span className="font-normal text-ink">{formatPrice(price)}</span>
      {off > 0 && (
        <>
          <span className={`text-taupe line-through ${size === 'lg' ? 'text-base' : 'text-[12px]'}`}>{formatPrice(original!)}</span>
          <span className={`font-medium text-sale ${size === 'lg' ? 'text-sm' : 'text-[11px]'}`}>{off}% off</span>
        </>
      )}
    </div>
  );
}

// ——— Rating stars
export function Rating({ value, count, size = 12, showValue }: { value?: number; count?: number; size?: number; showValue?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5${count ? ` from ${count} reviews` : ''}`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i + 1));
          return (
            <span key={i} className="relative" style={{ width: size, height: size }}>
              <Star size={size} className="absolute text-stone" strokeWidth={1.5} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={size} className="fill-gold text-gold" strokeWidth={1.5} />
              </span>
            </span>
          );
        })}
      </div>
      {showValue && <span className="text-[12px] font-normal text-charcoal">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="text-[12px] text-taupe">({count})</span>}
    </div>
  );
}

// ——— Section heading used across catalogue sections
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  action,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-sand pb-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {(index || eyebrow) && (
          <p className="eyebrow mb-2 flex items-center gap-3">
            {index && <span className="font-serif text-[15px] tracking-normal text-gold normal-case italic">{index}</span>}
            {eyebrow}
          </p>
        )}
        <h2 className="text-[32px] md:text-[40px]">{title}</h2>
        {description && <p className="mt-2 max-w-xl text-muted">{description}</p>}
      </div>
      {action && (
        <Link to={action.to} className="group inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.18em] text-charcoal">
          <span className="link-underline">{action.label}</span>
          <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

// ——— Empty state
export function EmptyState({ icon, title, message, children }: { icon?: ReactNode; title: string; message?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-stone px-6 py-16 text-center">
      {icon && <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cream text-charcoal">{icon}</div>}
      <h3 className="text-2xl">{title}</h3>
      {message && <p className="mt-2 max-w-md text-muted">{message}</p>}
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}

// ——— Quantity stepper
export function QuantityStepper({
  value,
  onChange,
  max = 10,
  size = 'md',
  label = 'Quantity',
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}) {
  const h = size === 'sm' ? 'h-9' : 'h-12';
  return (
    <div className={`inline-flex items-center border border-stone ${h}`} role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className="flex h-full w-9 items-center justify-center text-charcoal transition-colors hover:bg-cream disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="w-9 text-center text-[14px] font-normal tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="flex h-full w-9 items-center justify-center text-charcoal transition-colors hover:bg-cream disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// ——— Accordion
export function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-sand">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-[15px] font-normal text-ink"
      >
        {title}
        <ChevronDown size={16} className={`flex-none text-taupe transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="pb-5 text-muted">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ——— Simple page header for content pages
export function PageHeader({ eyebrow, title, description, crumbs }: { eyebrow?: string; title: string; description?: string; crumbs?: { label: string; to?: string }[] }) {
  return (
    <header className="border-b border-sand bg-cream/50">
      <div className="container-x py-10 md:py-14">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <p className="eyebrow mt-6">{eyebrow}</p>}
        <h1 className={`text-[40px] md:text-[56px] ${eyebrow ? 'mt-2' : 'mt-6'}`}>{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-[16px] text-muted">{description}</p>}
      </div>
    </header>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return <span className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent ${className}`} aria-hidden />;
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-taupe" role="status" aria-label="Loading">
      <Spinner className="h-6 w-6" />
    </div>
  );
}

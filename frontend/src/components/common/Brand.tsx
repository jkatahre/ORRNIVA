import { SITE } from '../../config/site';

const ICONS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />,
  pinterest: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M11 8.5c3.5-1 6 1 5 4s-3.5 3-4.5 2M12 11l-2.5 9" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
    </>
  ),
} as const;

export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {(Object.keys(ICONS) as (keyof typeof ICONS)[]).map((k) => (
        <li key={k}>
          <a
            href={SITE.social[k]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${SITE.name} on ${k[0].toUpperCase() + k.slice(1)}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone/70 text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-ivory"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {ICONS[k]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

const PAYMENTS = ['UPI', 'VISA', 'Mastercard', 'RuPay', 'Net Banking', 'COD'];

export function PaymentBadges({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-1.5 ${className}`} aria-label="Accepted payment methods">
      {PAYMENTS.map((p) => (
        <li key={p} className="rounded-[3px] border border-stone/80 bg-white/70 px-2 py-0.5 text-[10px] font-medium tracking-wider text-muted">
          {p}
        </li>
      ))}
    </ul>
  );
}

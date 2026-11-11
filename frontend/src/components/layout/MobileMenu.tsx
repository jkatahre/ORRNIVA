import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown, Heart, Package, User, X } from 'lucide-react';
import { CATEGORIES, COLLECTIONS } from '../../data/categories';
import { useEscape, useLockBody } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common';
import { SocialLinks } from '../common/Brand';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { user } = useAuth();
  useEscape(open, onClose);
  useLockBody(open);
  if (!open) return null;

  const row = 'flex w-full items-center justify-between py-3.5 text-left font-serif text-[21px] text-ink';

  return (
    <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm animate-slide-in-left flex-col bg-ivory">
        <div className="flex h-16 items-center justify-between border-b border-sand px-5">
          <Logo className="[&>span]:text-[20px] [&>svg]:h-6 [&>svg]:w-6" />
          <button onClick={onClose} aria-label="Close menu" className="-mr-2 flex h-10 w-10 items-center justify-center">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-2">
          <ul className="divide-y divide-sand">
            <li>
              <Link to="/collections/all" onClick={onClose} className={row}>
                Shop All
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <button onClick={() => setExpanded(expanded === c.slug ? null : c.slug)} aria-expanded={expanded === c.slug} className={row}>
                  {c.name}
                  <ChevronDown size={18} className={`text-taupe transition-transform ${expanded === c.slug ? 'rotate-180' : ''}`} />
                </button>
                {expanded === c.slug && (
                  <ul className="animate-fade-in pb-4 pl-1">
                    <li>
                      <Link to={`/collections/${c.slug}`} onClick={onClose} className="block py-2 text-[14px] font-medium text-ink">
                        View all {c.name}
                      </Link>
                    </li>
                    {c.subCategories.map((s) => (
                      <li key={s.slug}>
                        <Link to={`/collections/${c.slug}/${s.slug}`} onClick={onClose} className="block py-2 text-[14px] text-muted">
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li>
              <button onClick={() => setExpanded(expanded === 'col' ? null : 'col')} aria-expanded={expanded === 'col'} className={row}>
                Collections
                <ChevronDown size={18} className={`text-taupe transition-transform ${expanded === 'col' ? 'rotate-180' : ''}`} />
              </button>
              {expanded === 'col' && (
                <ul className="animate-fade-in pb-4 pl-1">
                  {COLLECTIONS.map((c) => (
                    <li key={c.slug}>
                      <Link to={`/collections/${c.slug}`} onClick={onClose} className="block py-2 text-[14px] text-muted">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <Link to="/about" onClick={onClose} className={row}>
                Our Story
              </Link>
            </li>
          </ul>

          <ul className="mt-6 space-y-1 border-t border-sand pt-5 text-[14px]">
            <li>
              <Link to={user ? '/account' : '/login'} onClick={onClose} className="flex items-center gap-3 py-2 text-charcoal">
                <User size={17} strokeWidth={1.5} /> {user ? `Hello, ${user.name.split(' ')[0]}` : 'Sign in / Register'}
              </Link>
            </li>
            <li>
              <Link to="/wishlist" onClick={onClose} className="flex items-center gap-3 py-2 text-charcoal">
                <Heart size={17} strokeWidth={1.5} /> Wishlist
              </Link>
            </li>
            <li>
              <Link to="/track-order" onClick={onClose} className="flex items-center gap-3 py-2 text-charcoal">
                <Package size={17} strokeWidth={1.5} /> Track order
              </Link>
            </li>
          </ul>
        </nav>
        <div className="border-t border-sand px-5 py-4">
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { CATEGORIES, COLLECTIONS } from '../../data/categories';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { Img, Logo } from '../common';
import { SearchOverlay } from './SearchOverlay';
import { MobileMenu } from './MobileMenu';
import type { CategorySlug } from '../../types';

type MenuKey = CategorySlug | 'collections' | null;

function CountBadge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -top-1 -right-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-charcoal px-1 text-[10px] font-medium text-ivory tabular-nums">
      {n > 99 ? '99+' : n}
    </span>
  );
}

function MegaPanel({ menu, onNavigate }: { menu: Exclude<MenuKey, null>; onNavigate: () => void }) {
  if (menu === 'collections') {
    return (
      <div className="container-x grid grid-cols-12 gap-10 py-10">
        <div className="col-span-3">
          <p className="eyebrow mb-4">Curated edits</p>
          <ul className="space-y-2.5">
            {COLLECTIONS.map((c) => (
              <li key={c.slug}>
                <Link to={`/collections/${c.slug}`} onClick={onNavigate} className="font-serif text-[20px] text-ink transition-colors hover:text-gold">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-9 grid grid-cols-4 gap-5">
          {COLLECTIONS.slice(2, 6).map((c) => (
            <Link key={c.slug} to={`/collections/${c.slug}`} onClick={onNavigate} className="group">
              <div className="aspect-[4/5] overflow-hidden bg-cream">
                <Img imageKey={c.image} alt="" sizes="20vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <p className="mt-3 font-serif text-[18px] text-ink">{c.name}</p>
              <p className="text-[12px] text-taupe">{PRODUCTS.filter(c.match).length} pieces</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }
  const cat = CATEGORIES.find((c) => c.slug === menu)!;
  const featured = PRODUCTS.filter((p) => p.category === menu && p.availability)
    .sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, 3);
  const cols = cat.subCategories.length > 8 ? 'columns-3' : cat.subCategories.length > 4 ? 'columns-2' : 'columns-1';
  return (
    <div className="container-x grid grid-cols-12 gap-10 py-10">
      <div className="col-span-5">
        <p className="eyebrow mb-4">{cat.name}</p>
        <ul className={`${cols} gap-8`}>
          {cat.subCategories.map((s) => {
            const n = PRODUCTS.filter((p) => p.category === cat.slug && p.subCategory === s.slug).length;
            return (
              <li key={s.slug} className="break-inside-avoid py-1.5">
                <Link to={`/collections/${cat.slug}/${s.slug}`} onClick={onNavigate} className="group flex items-baseline gap-2 text-[14.5px] text-charcoal">
                  <span className="group-hover:underline group-hover:decoration-stone group-hover:underline-offset-4">{s.name}</span>
                  <span className="text-[11px] text-taupe">{n}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link to={`/collections/${cat.slug}`} onClick={onNavigate} className="mt-6 inline-block text-[11px] font-medium uppercase tracking-[0.18em] text-ink link-underline">
          View all {cat.name}
        </Link>
      </div>
      <div className="col-span-7 grid grid-cols-3 gap-5">
        {featured.map((p) => (
          <Link key={p.id} to={`/products/${p.slug}`} onClick={onNavigate} className="group">
            <div className="aspect-square overflow-hidden bg-cream">
              <Img imageKey={p.images[0]} alt="" sizes="18vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <p className="mt-3 font-serif text-[17px] leading-snug text-ink">{p.name}</p>
            <p className="text-[12px] text-taupe">Most loved in {cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const { count, openCart } = useCart();
  const wishlist = useWishlist();
  const { user } = useAuth();
  const [menu, setMenu] = useState<MenuKey>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    setMenu(null);
    setSearchOpen(false);
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const openMenu = (m: MenuKey) => {
    window.clearTimeout(closeTimer.current);
    setMenu(m);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), 140);
  };

  const navItem = 'relative py-4 text-[11.5px] font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:text-ink';
  const activeLine = 'after:absolute after:inset-x-0 after:bottom-3 after:h-px after:bg-charcoal';

  const megaItems: { key: Exclude<MenuKey, null>; label: string; to: string }[] = [
    ...CATEGORIES.map((c) => ({ key: c.slug, label: c.name, to: `/collections/${c.slug}` })),
    { key: 'collections', label: 'Collections', to: '/collections/the-brass-edit' },
  ];

  return (
    <>
      <a href="#main" className="sr-only z-[100] bg-charcoal px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Skip to content
      </a>
      <header
        className={`sticky top-0 z-50 border-b bg-ivory/95 backdrop-blur-md transition-shadow ${scrolled ? 'border-sand shadow-[0_6px_24px_-18px_rgba(43,39,36,0.35)]' : 'border-sand/70'}`}
        onMouseLeave={scheduleClose}
      >
        <div className="container-x grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[76px]">
          {/* left */}
          <div className="flex items-center gap-1">
            <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="-ml-2 flex h-10 w-10 items-center justify-center lg:hidden">
              <Menu size={21} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search the catalogue"
              className="flex h-10 items-center gap-3 lg:w-64 lg:border-b lg:border-stone lg:pr-2 lg:text-left lg:transition-colors lg:hover:border-charcoal"
            >
              <Search size={18} strokeWidth={1.5} className="mx-auto flex-none lg:mx-0" />
              <span className="hidden text-[13px] text-taupe lg:inline">Search vases, brass, boards…</span>
            </button>
          </div>

          {/* centre */}
          <Link to="/" aria-label="Orrniva — home" className="flex justify-center">
            <Logo className="[&>span]:text-[20px] [&>svg]:h-6 [&>svg]:w-6 md:[&>span]:text-[26px] md:[&>svg]:h-7 md:[&>svg]:w-7" />
          </Link>

          {/* right */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-1.5">
            <Link to={user ? '/account' : '/login'} aria-label={user ? 'My account' : 'Sign in'} className="hidden h-10 w-10 items-center justify-center sm:flex">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <Link to="/wishlist" aria-label={`Wishlist, ${wishlist.count} items`} className="relative flex h-10 w-10 items-center justify-center">
              <span className="relative">
                <Heart size={20} strokeWidth={1.5} />
                <CountBadge n={wishlist.count} />
              </span>
            </Link>
            <button onClick={openCart} aria-label={`Shopping bag, ${count} items`} className="relative -mr-2 flex h-10 w-10 items-center justify-center">
              <span className="relative">
                <ShoppingBag size={20} strokeWidth={1.5} />
                <CountBadge n={count} />
              </span>
            </button>
          </div>
        </div>

        {/* desktop nav */}
        <nav aria-label="Main" className="hidden border-t border-sand/70 lg:block">
          <ul className="container-x flex items-center justify-center gap-9">
            <li>
              <NavLink to="/collections/all" className={({ isActive }) => `${navItem} ${isActive ? activeLine : ''}`} onMouseEnter={scheduleClose}>
                Shop All
              </NavLink>
            </li>
            {megaItems.map((m) => (
              <li key={m.key} onMouseEnter={() => openMenu(m.key)}>
                <NavLink
                  to={m.to}
                  aria-expanded={menu === m.key}
                  aria-haspopup="true"
                  onFocus={() => openMenu(m.key)}
                  onKeyDown={(e) => e.key === 'Escape' && setMenu(null)}
                  className={({ isActive }) => `${navItem} ${isActive || menu === m.key ? activeLine : ''}`}
                >
                  {m.label}
                </NavLink>
              </li>
            ))}
            <li onMouseEnter={scheduleClose}>
              <NavLink to="/collections/new-arrivals" className={({ isActive }) => `${navItem} ${isActive ? activeLine : ''}`}>
                New Arrivals
              </NavLink>
            </li>
            <li onMouseEnter={scheduleClose}>
              <NavLink to="/collections/best-sellers" className={({ isActive }) => `${navItem} ${isActive ? activeLine : ''}`}>
                Best Sellers
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* mega menu */}
        {menu && (
          <div
            className="absolute inset-x-0 top-full hidden animate-fade-in border-b border-sand bg-ivory shadow-[0_24px_40px_-28px_rgba(43,39,36,0.35)] lg:block"
            onMouseEnter={() => openMenu(menu)}
            onMouseLeave={scheduleClose}
          >
            <MegaPanel menu={menu} onNavigate={() => setMenu(null)} />
          </div>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

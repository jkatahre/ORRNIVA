import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { Heart, LogOut, Package, User as UserIcon, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchOrders, STATUS_STEPS } from '../services/api';
import { usePageMeta } from '../hooks';
import { formatDate, formatPrice } from '../utils/format';
import type { Order } from '../types';
import { EmptyState, PageHeader, PageLoader, Spinner } from '../components/common';

type Tab = 'orders' | 'profile';

export default function Account() {
  const { user, logout, updateUser } = useAuth();
  const wishlist = useWishlist();
  const [tab, setTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [saved, setSaved] = useState(false);
  usePageMeta('My Account');

  useEffect(() => {
    if (user) fetchOrders(user.email).then(setOrders);
  }, [user]);

  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty }, reset } = useForm<{ name: string; phone: string }>({
    values: { name: user?.name ?? '', phone: user?.phone ?? '' },
  });

  if (!user) return <Navigate to="/login?redirect=/account" replace />;

  const onSave = handleSubmit(async (v) => {
    await updateUser({ ...user, name: v.name.trim(), phone: v.phone || undefined });
    reset(v);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  });

  const navBtn = (t: Tab, label: string, Icon: typeof Package) => (
    <button onClick={() => setTab(t)} aria-current={tab === t ? 'page' : undefined} className={`flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] transition-colors ${tab === t ? 'bg-cream text-ink' : 'text-muted hover:text-ink'}`}>
      <Icon size={16} strokeWidth={1.5} /> {label}
    </button>
  );

  return (
    <div>
      <PageHeader eyebrow="My account" title={`Hello, ${user.name.split(' ')[0]}`} crumbs={[{ label: 'Home', to: '/' }, { label: 'My Account' }]} description={`Member since ${formatDate(user.createdAt)}`} />
      <div className="container-x grid gap-10 py-10 md:grid-cols-[220px_1fr] md:py-14">
        <nav aria-label="Account" className="h-fit border border-sand">
          {navBtn('orders', 'Order history', Package)}
          {navBtn('profile', 'Profile', UserIcon)}
          <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 text-[14px] text-muted hover:text-ink">
            <Heart size={16} strokeWidth={1.5} /> Wishlist ({wishlist.count})
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-3 border-t border-sand px-4 py-3 text-left text-[14px] text-muted hover:text-ink">
            <LogOut size={16} strokeWidth={1.5} /> Sign out
          </button>
        </nav>

        <section>
          {tab === 'orders' &&
            (orders === null ? (
              <PageLoader />
            ) : orders.length === 0 ? (
              <EmptyState icon={<Package size={22} strokeWidth={1.5} />} title="No orders yet" message="Orders placed with this email address will appear here.">
                <Link to="/collections/all" className="btn-dark">Start shopping</Link>
              </EmptyState>
            ) : (
              <div className="space-y-6">
                <h2 className="text-[28px]">Order history</h2>
                {orders.map((o) => {
                  const step = STATUS_STEPS.indexOf(o.status);
                  return (
                    <article key={o.id} className="border border-sand">
                      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-sand bg-cream/50 px-5 py-3 text-[13px]">
                        <div className="flex flex-wrap gap-x-6 gap-y-1">
                          <span><span className="text-taupe">Order </span><span className="text-ink">{o.id}</span></span>
                          <span><span className="text-taupe">Placed </span>{formatDate(o.createdAt)}</span>
                          <span><span className="text-taupe">Total </span>{formatPrice(o.total)}</span>
                        </div>
                        <span className={`px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] ${step === 4 ? 'bg-success/15 text-success' : 'bg-gold/15 text-gold'}`}>{o.status}</span>
                      </header>
                      <ul className="divide-y divide-sand px-5">
                        {o.lines.map((l) => (
                          <li key={l.productId} className="flex items-center gap-4 py-4">
                            <img src={l.image} alt="" className="h-16 w-13 flex-none object-cover" />
                            <span className="flex-1 font-serif text-[16px] text-ink">{l.name}</span>
                            <span className="text-[13px] text-taupe">× {l.quantity}</span>
                          </li>
                        ))}
                      </ul>
                      <footer className="flex justify-end border-t border-sand px-5 py-3">
                        <Link to={`/track-order?id=${o.id}`} className="text-[12px] font-medium uppercase tracking-[0.16em] link-underline">Track order</Link>
                      </footer>
                    </article>
                  );
                })}
              </div>
            ))}

          {tab === 'profile' && (
            <form onSubmit={onSave} noValidate className="max-w-lg space-y-5">
              <h2 className="text-[28px]">Profile</h2>
              <div>
                <label htmlFor="acc-name" className="field-label">Full name</label>
                <input id="acc-name" className="field" aria-invalid={!!errors.name} {...register('name', { required: 'Name is required.' })} />
                {errors.name && <p className="field-error">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="acc-email" className="field-label">Email</label>
                <input id="acc-email" value={user.email} readOnly className="field bg-cream text-muted" />
              </div>
              <div>
                <label htmlFor="acc-phone" className="field-label">Mobile</label>
                <input id="acc-phone" type="tel" inputMode="numeric" maxLength={10} className="field" aria-invalid={!!errors.phone} {...register('phone', { pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit mobile number.' } })} />
                {errors.phone && <p className="field-error">{errors.phone.message}</p>}
              </div>
              <div className="flex items-center gap-4">
                <button type="submit" disabled={isSubmitting || !isDirty} className="btn-dark">{isSubmitting ? <Spinner /> : 'Save changes'}</button>
                {saved && <span className="flex items-center gap-1.5 text-[13px] text-success" role="status"><Check size={14} /> Saved</span>}
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

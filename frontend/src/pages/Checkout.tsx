import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { Banknote, CreditCard, Lock, ShieldCheck, ShoppingBag, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { INDIAN_STATES, COMMERCE } from '../config/site';
import { placeOrder } from '../services/api';
import { usePageMeta } from '../hooks';
import { computeTotals } from '../utils/pricing';
import { formatPrice } from '../utils/format';
import { imageSrc } from '../utils/image';
import type { PaymentMethod } from '../types';
import { Breadcrumbs, EmptyState, Img, Spinner } from '../components/common';
import { CouponForm, TotalsTable } from '../components/cart/OrderSummary';
import { EMAIL_PATTERN } from '../components/common/NewsletterForm';

interface CheckoutForm {
  email: string;
  phone: string;
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  payment: PaymentMethod;
  notes: string;
  giftWrap: boolean;
}

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; note: string; icon: typeof Smartphone }[] = [
  { value: 'upi', label: 'UPI', note: 'GPay, PhonePe, Paytm or any UPI app · extra 5% off', icon: Smartphone },
  { value: 'card', label: 'Credit / Debit Card', note: 'Visa, Mastercard, RuPay · extra 5% off', icon: CreditCard },
  { value: 'cod', label: 'Cash on Delivery', note: `Pay when it arrives · ₹${COMMERCE.codFee} handling fee`, icon: Banknote },
];

function Field({ label, error, children, htmlFor, hint }: { label: string; error?: string; children: React.ReactNode; htmlFor: string; hint?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label}
      </label>
      {children}
      {error ? (
        <p className="field-error" id={`${htmlFor}-error`}>
          {error}
        </p>
      ) : (
        hint && <p className="mt-1 text-[12px] text-taupe">{hint}</p>
      )}
    </div>
  );
}

export default function Checkout() {
  usePageMeta('Checkout');
  const { lines, subtotal, coupon, clear, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    defaultValues: { email: user?.email ?? '', phone: user?.phone ?? '', fullName: user?.name ?? '', payment: 'upi', state: '', giftWrap: false },
    mode: 'onTouched',
  });

  const payment = watch('payment');
  const totals = computeTotals(subtotal, coupon, payment);

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitError(null);
    try {
      const order = await placeOrder({
        email: data.email.trim().toLowerCase(),
        lines: lines.map((l) => ({ productId: l.productId, name: l.product.name, image: imageSrc(l.product.images[0], 'sm'), price: l.product.price, quantity: l.quantity })),
        address: { fullName: data.fullName, phone: data.phone, line1: data.line1, line2: data.line2, city: data.city, state: data.state, pincode: data.pincode },
        payment: data.payment,
        couponCode: coupon?.code,
        ...totals,
      });
      await navigate(`/order-confirmation/${order.id}`, { replace: true });
      clear();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    }
  };

  if (lines.length === 0) {
    return (
      <div className="container-x py-16">
        <EmptyState icon={<ShoppingBag size={22} strokeWidth={1.5} />} title="Your bag is empty" message="Add a few pieces to your bag before checking out.">
          <Link to="/collections/all" className="btn-dark">
            Browse the catalogue
          </Link>
        </EmptyState>
      </div>
    );
  }

  const err = (k: keyof CheckoutForm) => errors[k]?.message as string | undefined;
  const aria = (k: keyof CheckoutForm) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${k}-error` : undefined });

  return (
    <div className="container-x py-8 md:py-12">
      <Breadcrumbs items={[{ label: 'Bag', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="mt-5 text-[40px] md:text-[52px]">Checkout</h1>
      {!user && (
        <p className="mt-2 text-[14px] text-muted">
          Have an account?{' '}
          <Link to="/login?redirect=/checkout" className="text-charcoal link-underline">
            Sign in
          </Link>{' '}
          for faster checkout and order history.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10 grid gap-12 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-7">
          {/* Contact */}
          <fieldset>
            <legend className="mb-5 flex items-center gap-3 font-serif text-[26px] text-ink">
              <span className="font-serif text-[16px] text-gold italic">01</span> Contact information
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" htmlFor="email" error={err('email')}>
                <input id="email" type="email" autoComplete="email" className="field" {...aria('email')} {...register('email', { required: 'Email is required.', pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address.' } })} />
              </Field>
              <Field label="Mobile number" htmlFor="phone" error={err('phone')} hint="For delivery updates on WhatsApp/SMS">
                <div className="flex">
                  <span className="flex items-center border border-r-0 border-stone bg-cream px-3 text-[14px] text-muted">+91</span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    className="field"
                    {...aria('phone')}
                    {...register('phone', { required: 'Mobile number is required.', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number.' } })}
                  />
                </div>
              </Field>
            </div>
          </fieldset>

          {/* Shipping */}
          <fieldset>
            <legend className="mb-5 flex items-center gap-3 font-serif text-[26px] text-ink">
              <span className="font-serif text-[16px] text-gold italic">02</span> Shipping address
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Full name" htmlFor="fullName" error={err('fullName')}>
                  <input id="fullName" autoComplete="name" className="field" {...aria('fullName')} {...register('fullName', { required: 'Full name is required.', minLength: { value: 2, message: 'Please enter your full name.' } })} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Flat, house no., building, street" htmlFor="line1" error={err('line1')}>
                  <input id="line1" autoComplete="address-line1" className="field" {...aria('line1')} {...register('line1', { required: 'Address is required.', minLength: { value: 5, message: 'Please enter a complete address.' } })} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Area, landmark (optional)" htmlFor="line2">
                  <input id="line2" autoComplete="address-line2" className="field" {...register('line2')} />
                </Field>
              </div>
              <Field label="City" htmlFor="city" error={err('city')}>
                <input id="city" autoComplete="address-level2" className="field" {...aria('city')} {...register('city', { required: 'City is required.' })} />
              </Field>
              <Field label="State" htmlFor="state" error={err('state')}>
                <select id="state" autoComplete="address-level1" className="field appearance-none" {...aria('state')} {...register('state', { required: 'Please select a state.' })}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="PIN code" htmlFor="pincode" error={err('pincode')}>
                <input
                  id="pincode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  className="field"
                  {...aria('pincode')}
                  {...register('pincode', { required: 'PIN code is required.', pattern: { value: /^[1-9]\d{5}$/, message: 'Enter a valid 6-digit PIN code.' } })}
                />
              </Field>
              <Field label="Country" htmlFor="country">
                <input id="country" value="India" readOnly className="field bg-cream text-muted" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Delivery notes (optional)" htmlFor="notes">
                  <textarea id="notes" rows={2} className="field resize-none" placeholder="Gate code, preferred delivery time, gift message…" {...register('notes', { maxLength: { value: 300, message: 'Keep notes under 300 characters.' } })} />
                </Field>
              </div>
              <label className="flex items-center gap-3 text-[14px] text-charcoal sm:col-span-2">
                <input type="checkbox" className="h-4 w-4 accent-charcoal" {...register('giftWrap')} />
                Gift-wrap this order with a handwritten note (complimentary)
              </label>
            </div>
          </fieldset>

          {/* Payment */}
          <fieldset>
            <legend className="mb-5 flex items-center gap-3 font-serif text-[26px] text-ink">
              <span className="font-serif text-[16px] text-gold italic">03</span> Payment method
            </legend>
            <div className="divide-y divide-sand border border-sand">
              {PAYMENT_OPTIONS.map((o) => (
                <label key={o.value} className={`flex cursor-pointer items-center gap-4 p-4 transition-colors ${payment === o.value ? 'bg-cream/70' : 'hover:bg-cream/40'}`}>
                  <input type="radio" value={o.value} className="h-4 w-4 accent-charcoal" {...register('payment', { required: true })} />
                  <o.icon size={20} strokeWidth={1.4} className="flex-none text-charcoal" />
                  <span className="flex-1">
                    <span className="block text-[15px] text-ink">{o.label}</span>
                    <span className="block text-[12.5px] text-taupe">{o.note}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 flex items-start gap-2 text-[12.5px] text-taupe">
              <ShieldCheck size={15} className="mt-0.5 flex-none text-success" />
              {payment === 'cod'
                ? 'Please keep the exact amount ready. Our delivery partner also accepts UPI on delivery.'
                : 'This is a demonstration checkout. No payment details are collected or stored here — in production you would complete payment securely with our payment partner.'}
            </p>
          </fieldset>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-5" aria-label="Order summary">
          <div className="border border-sand bg-white/40 p-6 lg:sticky lg:top-[150px]">
            <h2 className="mb-5 text-[26px]">
              Order summary <span className="text-[15px] text-taupe">({count})</span>
            </h2>
            <ul className="max-h-72 space-y-4 overflow-y-auto pr-1">
              {lines.map((l) => (
                <li key={l.productId} className="flex items-center gap-4">
                  <div className="relative w-16 flex-none">
                    <div className="aspect-square overflow-hidden bg-cream">
                      <Img imageKey={l.product.images[0]} alt="" sizes="64px" className="h-full w-full object-cover" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-charcoal px-1 text-[10px] text-ivory">{l.quantity}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-[16px] text-ink">{l.product.name}</p>
                    <p className="text-[12px] text-taupe">{l.product.material}</p>
                  </div>
                  <span className="text-[14px]">{formatPrice(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-sand pt-5">
              <CouponForm />
            </div>
            <div className="mt-5">
              <TotalsTable totals={totals} couponCode={coupon?.code} />
            </div>
            {submitError && (
              <p role="alert" className="mt-4 bg-sale/10 px-3 py-2 text-[13px] text-sale">
                {submitError}
              </p>
            )}
            <button type="submit" disabled={isSubmitting} className="btn-dark mt-6 h-12 w-full">
              {isSubmitting ? <Spinner /> : <Lock size={14} />}
              {isSubmitting ? 'Placing order…' : `Place order · ${formatPrice(totals.total)}`}
            </button>
            {Object.keys(errors).length > 0 && <p className="mt-2 text-center text-[12px] text-sale">Please complete the highlighted fields.</p>}
            <p className="mt-4 text-center text-[11.5px] text-taupe">
              By placing your order you agree to our{' '}
              <Link to="/return-policy" className="underline underline-offset-2">
                return policy
              </Link>{' '}
              and{' '}
              <Link to="/privacy-policy" className="underline underline-offset-2">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

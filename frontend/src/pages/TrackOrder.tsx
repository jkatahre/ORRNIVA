import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { Check, PackageSearch } from 'lucide-react';
import { trackOrder, STATUS_STEPS } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePageMeta } from '../hooks';
import { formatDate, formatPrice } from '../utils/format';
import type { Order } from '../types';
import { PageHeader, Spinner } from '../components/common';

interface TrackForm {
  orderId: string;
  contact: string;
}

export default function TrackOrder() {
  usePageMeta('Track Order');
  const [params] = useSearchParams();
  const { user } = useAuth();
  const [result, setResult] = useState<Order | null | undefined>(undefined);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<TrackForm>({
    defaultValues: { orderId: params.get('id') ?? '', contact: user?.email ?? '' },
  });

  const lookup = handleSubmit(async ({ orderId, contact }) => {
    setResult((await trackOrder(orderId, contact)) ?? null);
  });

  // auto-lookup when arriving from an order link while signed in
  useEffect(() => {
    const id = params.get('id');
    if (id && user) {
      setValue('orderId', id);
      setValue('contact', user.email);
      lookup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = result ? STATUS_STEPS.indexOf(result.status) : -1;

  return (
    <div>
      <PageHeader title="Track Your Order" crumbs={[{ label: 'Home', to: '/' }, { label: 'Track Order' }]} description="Enter your order number and the email or mobile number used at checkout." />
      <div className="container-x grid gap-12 py-12 md:py-16 lg:grid-cols-12">
        <form onSubmit={lookup} noValidate className="space-y-5 lg:col-span-4">
          <div>
            <label htmlFor="t-id" className="field-label">Order number</label>
            <input id="t-id" placeholder="e.g. ORV12345678" aria-invalid={!!errors.orderId} className="field uppercase placeholder:normal-case" {...register('orderId', { required: 'Please enter your order number.', pattern: { value: /^ORV\d{6,}$/i, message: 'Order numbers look like ORV12345678.' } })} />
            {errors.orderId && <p className="field-error">{errors.orderId.message}</p>}
          </div>
          <div>
            <label htmlFor="t-contact" className="field-label">Email or mobile number</label>
            <input id="t-contact" aria-invalid={!!errors.contact} className="field" {...register('contact', { required: 'Please enter the email or mobile used at checkout.' })} />
            {errors.contact && <p className="field-error">{errors.contact.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-dark h-12 w-full">{isSubmitting ? <Spinner /> : 'Track order'}</button>
        </form>

        <div className="lg:col-span-8">
          {result === undefined && (
            <div className="flex h-full min-h-48 flex-col items-center justify-center border border-dashed border-stone p-8 text-center text-muted">
              <PackageSearch size={28} strokeWidth={1.3} className="mb-3 text-taupe" />
              Your order status will appear here.
            </div>
          )}
          {result === null && (
            <div role="alert" className="border border-sale/30 bg-sale/5 p-6">
              <h2 className="text-[24px]">We couldn't find that order</h2>
              <p className="mt-2 text-muted">
                Please check the order number and contact details, or{' '}
                <Link to="/contact" className="text-charcoal link-underline">contact our care team</Link>.
              </p>
            </div>
          )}
          {result && (
            <div className="border border-sand bg-white/40 p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-[28px]">Order {result.id}</h2>
                <span className="text-[13px] text-taupe">Placed {formatDate(result.createdAt)} · {formatPrice(result.total)}</span>
              </div>
              <ol className="mt-8 grid gap-6 sm:grid-cols-5 sm:gap-0">
                {STATUS_STEPS.map((s, i) => {
                  const done = i <= step;
                  return (
                    <li key={s} className="relative flex items-center gap-3 sm:flex-col sm:text-center">
                      {i > 0 && <span className={`absolute top-3.5 right-1/2 hidden h-px w-full sm:block ${i <= step ? 'bg-charcoal' : 'bg-stone'}`} aria-hidden />}
                      <span className={`relative z-10 flex h-7 w-7 flex-none items-center justify-center rounded-full border ${done ? 'border-charcoal bg-charcoal text-ivory' : 'border-stone bg-ivory text-taupe'}`}>
                        {done ? <Check size={13} /> : <span className="text-[11px]">{i + 1}</span>}
                      </span>
                      <span className={`text-[13px] sm:mt-2 ${i === step ? 'font-medium text-ink' : done ? 'text-charcoal' : 'text-taupe'}`}>{s}</span>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-8 border-t border-sand pt-6">
                <p className="text-[14px] text-muted">
                  Shipping to {result.address.fullName}, {result.address.city}, {result.address.state} {result.address.pincode}
                </p>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {result.lines.map((l) => (
                    <li key={l.productId} title={l.name}>
                      <img src={l.image} alt={l.name} className="h-20 w-16 object-cover" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

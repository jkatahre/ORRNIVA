import { useParams, Link } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { usePageMeta } from '../hooks';
import { readStore } from '../utils/storage';
import { formatDate, formatPrice } from '../utils/format';
import type { Order } from '../types';
import { EmptyState } from '../components/common';
import { TotalsTable } from '../components/cart/OrderSummary';

const PAYMENT_LABEL = { upi: 'UPI', card: 'Credit / Debit Card', cod: 'Cash on Delivery' } as const;

export default function OrderConfirmation() {
  const { id } = useParams();
  usePageMeta('Order confirmed');
  const order = readStore<Order[]>('orders', []).find((o) => o.id === id);

  if (!order)
    return (
      <div className="container-x py-16">
        <EmptyState title="Order not found" message="We couldn't find this order on this device. You can look it up with your order number and email.">
          <Link to="/track-order" className="btn-dark">
            Track an order
          </Link>
        </EmptyState>
      </div>
    );

  const eta = new Date(new Date(order.createdAt).getTime() + 5 * 86400000).toISOString();

  return (
    <div className="container-x max-w-4xl py-12 md:py-16">
      <div className="text-center">
        <CheckCircle2 size={44} strokeWidth={1.2} className="mx-auto text-success" />
        <p className="eyebrow mt-5">Order {order.id}</p>
        <h1 className="mt-2 text-[40px] md:text-[52px]">Thank you, {order.address.fullName.split(' ')[0]}.</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          Your order is confirmed. A confirmation has been sent to <span className="text-charcoal">{order.email}</span>. Estimated delivery by{' '}
          <span className="text-charcoal">{formatDate(eta)}</span>.
        </p>
      </div>

      <div className="mt-12 grid gap-8 border border-sand bg-white/40 p-6 md:grid-cols-2 md:p-8">
        <div>
          <h2 className="mb-4 text-[22px]">Items</h2>
          <ul className="space-y-4">
            {order.lines.map((l) => (
              <li key={l.productId} className="flex items-center gap-4">
                <img src={l.image} alt="" className="h-20 w-16 flex-none object-cover" />
                <div className="flex-1">
                  <p className="font-serif text-[16px] text-ink">{l.name}</p>
                  <p className="text-[12px] text-taupe">Qty {l.quantity}</p>
                </div>
                <span className="text-[14px]">{formatPrice(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-[22px]">Delivering to</h2>
            <address className="text-[14px] text-muted not-italic">
              {order.address.fullName}
              <br />
              {order.address.line1}
              {order.address.line2 && <>, {order.address.line2}</>}
              <br />
              {order.address.city}, {order.address.state} {order.address.pincode}
              <br />
              +91 {order.address.phone}
            </address>
          </div>
          <div>
            <h2 className="mb-1 text-[22px]">Payment</h2>
            <p className="text-[14px] text-muted">{PAYMENT_LABEL[order.payment]}</p>
          </div>
          <TotalsTable totals={order} couponCode={order.couponCode} />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link to={`/track-order?id=${order.id}`} className="btn-outline">
          Track this order
        </Link>
        <Link to="/collections/all" className="btn-dark">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

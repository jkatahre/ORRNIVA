import { Link } from 'react-router';
import { COMMERCE, SITE } from '../config/site';
import { usePageMeta } from '../hooks';
import { PageHeader } from '../components/common';

type Kind = 'privacy' | 'returns' | 'shipping';

const META: Record<Kind, { title: string; description: string }> = {
  privacy: { title: 'Privacy Policy', description: 'How Orrniva collects, uses and protects your personal information.' },
  returns: { title: 'Return & Refund Policy', description: 'Orrniva’s 7-day return window, damage claims and refund timelines.' },
  shipping: { title: 'Shipping Policy', description: 'Orrniva shipping charges, dispatch times and delivery estimates across India.' },
};

function Privacy() {
  return (
    <>
      <p>
        This policy explains how {SITE.name} Living Pvt. Ltd. (“{SITE.name}”, “we”) collects, uses and protects your information when you use this website. It is
        written in line with India’s Digital Personal Data Protection Act, 2023.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Details you provide: name, email, mobile number and delivery address when you place an order, create an account or contact us.</li>
        <li>Order history and preferences, such as wishlist items and recently viewed products.</li>
        <li>Technical data such as browser type and pages visited, collected through essential cookies.</li>
      </ul>
      <h2>Payment information</h2>
      <p>
        We never store your card number, CVV or UPI PIN. Payments are processed by PCI-DSS compliant payment partners; we only receive a confirmation
        of whether the payment succeeded.
      </p>
      <h2>How we use your information</h2>
      <ul>
        <li>To process, ship and support your orders.</li>
        <li>To send order and delivery updates by email, SMS or WhatsApp.</li>
        <li>To send our newsletter, only if you subscribe. You can unsubscribe at any time.</li>
        <li>To improve our website and catalogue.</li>
      </ul>
      <h2>Sharing</h2>
      <p>We share only what is necessary with logistics and payment partners to fulfil your order. We do not sell your personal data.</p>
      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data by writing to <a href={`mailto:${SITE.email}`} className="text-charcoal underline underline-offset-4">{SITE.email}</a>.
      </p>
      <p className="text-[13px]">Last updated: 1 November 2026.</p>
    </>
  );
}

function Returns() {
  return (
    <>
      <p>We want you to love every piece. If something isn’t right, here is how returns and refunds work.</p>
      <h2>7-day returns</h2>
      <ul>
        <li>Unused items in their original packaging can be returned within 7 days of delivery.</li>
        <li>Raise a return from your account or by writing to {SITE.email} with your order number.</li>
        <li>We arrange a free reverse pickup from most PIN codes. Where pickup is unavailable, we reimburse self-shipping up to ₹150.</li>
      </ul>
      <h2>Damaged or incorrect items</h2>
      <p>
        Share an unboxing photo or video within 48 hours of delivery. We will send a replacement or issue a full refund — including shipping — at no cost to
        you.
      </p>
      <h2>Non-returnable items</h2>
      <ul>
        <li>Gift boxes, hampers and curated gift collections.</li>
        <li>Personalised or made-to-order pieces.</li>
        <li>Candles once the seal has been broken.</li>
      </ul>
      <h2>Refunds</h2>
      <ul>
        <li>Refunds are initiated within 48 hours of the returned item passing a quality check.</li>
        <li>Prepaid orders are refunded to the original payment method within 5–7 business days.</li>
        <li>Cash on Delivery orders are refunded to your bank account or UPI ID, or as store credit with an extra 5% value.</li>
        <li>Shipping and COD fees are non-refundable except for damaged or incorrect items.</li>
      </ul>
      <h2>Natural variation</h2>
      <p>Variations in grain, veining, glaze and hammer marks are characteristics of handmade pieces and are not considered defects.</p>
    </>
  );
}

function Shipping() {
  return (
    <>
      <p>We ship across India from our Bengaluru studio. Every piece is packed by hand in recycled honeycomb paper.</p>
      <h2>Shipping charges</h2>
      <ul>
        <li>Free shipping on orders of ₹{COMMERCE.freeShippingThreshold} and above.</li>
        <li>A flat ₹{COMMERCE.standardShipping} on orders below ₹{COMMERCE.freeShippingThreshold}.</li>
        <li>Cash on Delivery carries an additional ₹{COMMERCE.codFee} handling fee and is available on orders up to ₹15,000.</li>
      </ul>
      <h2>Dispatch & delivery times</h2>
      <ul>
        <li>In-stock orders are dispatched within 1–2 business days.</li>
        <li>Metro cities: 2–4 business days after dispatch.</li>
        <li>Rest of India: 4–7 business days after dispatch. North-East and island territories may take up to 10 days.</li>
        <li>Made-to-order pieces show their lead time on the product page.</li>
      </ul>
      <h2>Tracking</h2>
      <p>
        You will receive a tracking link by email and SMS as soon as your order ships. You can also check your order on our{' '}
        <Link to="/track-order" className="text-charcoal underline underline-offset-4">Track Order</Link> page.
      </p>
      <h2>Large & fragile items</h2>
      <p>Marble, glass and large wall pieces are shipped with additional protective packaging. White-glove delivery is available for premium gift collections in metro cities.</p>
    </>
  );
}

export default function Policy({ kind }: { kind: Kind }) {
  const meta = META[kind];
  usePageMeta(meta.title, meta.description);
  return (
    <div>
      <PageHeader title={meta.title} crumbs={[{ label: 'Home', to: '/' }, { label: meta.title }]} />
      <article className="container-x prose-policy max-w-3xl py-12 text-[15.5px] md:py-16">
        {kind === 'privacy' && <Privacy />}
        {kind === 'returns' && <Returns />}
        {kind === 'shipping' && <Shipping />}
      </article>
    </div>
  );
}

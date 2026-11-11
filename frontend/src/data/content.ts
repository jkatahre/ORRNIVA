import type { Product, Review } from '../types';

export const TESTIMONIALS = [
  {
    quote:
      'The brass urli arrived wrapped like a present, with a handwritten note. It is even more beautiful in person — heavy, honest and clearly made by hand.',
    name: 'Ananya Rao',
    city: 'Bengaluru',
    product: 'Hand-Beaten Brass Urli Bowl',
  },
  {
    quote:
      'I furnished our new flat almost entirely from Orrniva. Everything feels considered; nothing looks mass-produced. Delivery to Pune was quicker than promised.',
    name: 'Kabir Malhotra',
    city: 'Pune',
    product: 'Gallery Wall Frame Set of 7',
  },
  {
    quote:
      'Our go-to for Diwali gifting now. Clients still mention the gift boxes months later. The team handled forty personalised notes without a single error.',
    name: 'Meera Iyer',
    city: 'Chennai',
    product: 'Diwali Glow Gift Box',
  },
  {
    quote:
      'The granite khalbatta is the real thing — exactly like my grandmother’s, but finished beautifully. Worth every rupee.',
    name: 'Ritika Sharma',
    city: 'New Delhi',
    product: 'Granite Khalbatta Mortar & Pestle',
  },
];

export const INSPIRATION = [
  { image: 'marble-side-tables', handle: '@thelinenhouse.blr' },
  { image: 'carved-bookcase', handle: '@homesbyaditi' },
  { image: 'vine-mirror-console', handle: '@slowliving.in' },
  { image: 'two-tier-leaf-stand', handle: '@thepune.flat' },
  { image: 'hurricane-candle-holder', handle: '@sundaysathome' },
  { image: 'valet-stand', handle: '@casa.mumbai' },
  { image: 'arched-mirror-console', handle: '@greenhome.journal' },
  { image: 'kitchen-canister-set', handle: '@kitchenstories.in' },
];

export const FAQS: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: 'Orders & Payment',
    items: [
      {
        q: 'Which payment methods do you accept?',
        a: 'We accept UPI (GPay, PhonePe, Paytm and others), all major credit and debit cards, net banking, and Cash on Delivery on orders up to ₹15,000. Prepaid orders receive an additional 5% off, up to ₹250.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'Orders can be modified or cancelled within 12 hours of being placed, provided they have not been dispatched. Write to care@orrniva.in or call us with your order number.',
      },
      {
        q: 'Do you offer corporate or bulk gifting?',
        a: 'Yes. We curate and personalise gift boxes for orders of 20 units and above, with custom notes and branding. Contact us through the Contact page with your requirements.',
      },
    ],
  },
  {
    group: 'Shipping & Delivery',
    items: [
      {
        q: 'How much does shipping cost?',
        a: 'Shipping is free on all orders above ₹999. A flat ₹99 shipping fee applies to orders below that. Cash on Delivery orders carry an additional ₹49 handling fee.',
      },
      {
        q: 'How long will my order take to arrive?',
        a: 'Most orders are dispatched within 1–2 business days. Delivery takes 2–4 days to metro cities and 4–7 days to the rest of India. Made-to-order pieces will show their lead time on the product page.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'We currently ship within India only. International shipping to select countries is coming in 2027.',
      },
    ],
  },
  {
    group: 'Returns & Care',
    items: [
      {
        q: 'What is your return policy?',
        a: 'Unused items in their original packaging can be returned within 7 days of delivery. Gift boxes, personalised items and products marked final sale cannot be returned. See our Return & Refund Policy for details.',
      },
      {
        q: 'What if my order arrives damaged?',
        a: 'Every piece is packed in recycled honeycomb paper, but accidents happen. Share an unboxing photo or video within 48 hours of delivery and we will send a replacement or a full refund.',
      },
      {
        q: 'Why does my product look slightly different from the photograph?',
        a: 'Most of our pieces are handmade from natural materials. Variations in grain, veining, glaze and hammer marks are signs of craft, not defects — no two pieces are identical.',
      },
    ],
  },
];

const REVIEW_POOL = [
  { author: 'Priya N.', city: 'Hyderabad', title: 'Even better in person', body: 'Beautifully finished and much more substantial than I expected. Packaging was excellent — not a scratch.' },
  { author: 'Arjun K.', city: 'Mumbai', title: 'Lovely craftsmanship', body: 'You can tell this was made by hand. It has become the piece every guest asks about.' },
  { author: 'Sneha D.', city: 'Kolkata', title: 'Perfect gift', body: 'Bought this for my parents’ anniversary. The gift wrap and note were a really thoughtful touch.' },
  { author: 'Vikram S.', city: 'Jaipur', title: 'Good quality, slightly smaller', body: 'Quality is superb. It is a little smaller than I imagined, so do check the dimensions, but I am happy with it.' },
  { author: 'Farah A.', city: 'Lucknow', title: 'Fast delivery', body: 'Arrived in three days and was packed with real care. Colour matches the photos well.' },
  { author: 'Rahul M.', city: 'Ahmedabad', title: 'Worth it', body: 'A little pricier than marketplace options, but the difference in finish is obvious. Would buy again.' },
];

export function getReviews(product: Product): Review[] {
  if (!product.reviewCount) return [];
  const n = Math.min(3, product.reviewCount);
  const seed = parseInt(product.id.slice(-3), 10);
  return Array.from({ length: n }, (_, i) => {
    const r = REVIEW_POOL[(seed + i * 2) % REVIEW_POOL.length];
    const rating = r.title.includes('slightly') ? 4 : Math.round(product.rating ?? 5) >= 5 ? 5 : i === 2 ? 4 : 5;
    return {
      id: `${product.id}-r${i}`,
      productId: product.id,
      author: r.author,
      city: r.city,
      rating,
      title: r.title,
      body: r.body,
      date: new Date(Date.UTC(2026, 9, 28) - (seed * 3 + i * 17) * 86400000).toISOString(),
    };
  });
}

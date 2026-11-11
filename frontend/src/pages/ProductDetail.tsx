import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Heart, RotateCcw, ShieldCheck, Truck, Gift, Check } from 'lucide-react';
import { PRODUCT_BY_SLUG, PRODUCTS } from '../data/products';
import { CATEGORY_MAP } from '../data/categories';
import { getReviews } from '../data/content';
import { COMMERCE } from '../config/site';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { usePageMeta, useRecentlyViewed } from '../hooks';
import { discountPercent, formatDate, formatPrice } from '../utils/format';
import { Breadcrumbs, Price, QuantityStepper, Rating, SectionHeading } from '../components/common';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductRail } from '../components/product/ProductGrid';
import NotFound from './NotFound';

const TABS = ['Description', 'Specifications', 'Shipping', 'Returns', 'Reviews'] as const;
type Tab = (typeof TABS)[number];

export default function ProductDetail() {
  const { slug = '' } = useParams();
  const product = PRODUCT_BY_SLUG.get(slug);
  const navigate = useNavigate();
  const { add, quantityOf } = useCart();
  const wishlist = useWishlist();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>('Description');
  const recentlyViewed = useRecentlyViewed(product?.id);

  usePageMeta(product?.name ?? 'Product not found', product?.description);
  useEffect(() => {
    setQty(1);
    setTab('Description');
  }, [slug]);

  const related = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter((p) => p.id !== product.id)
      .map((p) => ({
        p,
        score: (p.subCategory === product.subCategory ? 4 : 0) + (p.category === product.category ? 2 : 0) + (p.material === product.material ? 2 : 0) + p.tags.filter((t) => product.tags.includes(t)).length,
      }))
      .sort((a, b) => b.score - a.score || Number(b.p.availability) - Number(a.p.availability))
      .slice(0, 8)
      .map((x) => x.p);
  }, [product]);

  if (!product) return <NotFound />;

  const cat = CATEGORY_MAP[product.category];
  const sub = cat.subCategories.find((s) => s.slug === product.subCategory);
  const saved = wishlist.has(product.id);
  const inBag = quantityOf(product.id);
  const maxQty = Math.max(1, Math.min(COMMERCE.maxQtyPerItem, product.stock) - inBag);
  const reviews = getReviews(product);
  const off = discountPercent(product.price, product.originalPrice);
  const lowStock = product.availability && product.stock <= 6;
  const gallery = [...product.images, `${product.images[0]}-detail`];

  const buyNow = () => {
    if (add(product, qty, { silent: true })) navigate('/checkout');
  };

  const specs: [string, string][] = [
    ['Material', product.material],
    ['Finish', product.finish],
    ['Dimensions', product.dimensions],
    ['Weight', product.weight],
    ['Category', `${cat.name} / ${sub?.name ?? ''}`],
    ['Product type', product.productType],
    ['SKU', product.sku],
    ['Country of origin', 'India'],
  ];

  return (
    <div>
      <div className="container-x pt-6 md:pt-8">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: cat.name, to: `/collections/${cat.slug}` },
            ...(sub ? [{ label: sub.name, to: `/collections/${cat.slug}/${sub.slug}` }] : []),
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-x grid gap-10 pt-6 lg:grid-cols-12 lg:gap-14 lg:pt-8">
        <div className="lg:col-span-7">
          <ProductGallery images={gallery} name={product.name} />
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[150px]">
            <p className="eyebrow">
              {sub?.name ?? cat.name} <span className="text-stone">·</span> {product.sku}
            </p>
            <h1 className="mt-3 text-[34px] md:text-[44px]">{product.name}</h1>
            {product.rating && (
              <button onClick={() => { setTab('Reviews'); document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' }); }} className="mt-3 flex items-center gap-2 text-left">
                <Rating value={product.rating} count={product.reviewCount} showValue size={13} />
                <span className="text-[12px] text-taupe underline underline-offset-4">Read reviews</span>
              </button>
            )}

            <div className="mt-6">
              <Price price={product.price} original={product.originalPrice} size="lg" />
              <p className="mt-1 text-[12px] text-taupe">
                Inclusive of all taxes{off > 0 && <> · You save {formatPrice(product.originalPrice! - product.price)}</>}
              </p>
            </div>

            <p className="mt-6 text-[15.5px] text-muted">{product.description}</p>

            <dl className="mt-6 grid grid-cols-[110px_1fr] gap-y-2 border-y border-sand py-5 text-[14px]">
              <dt className="text-taupe">Material</dt>
              <dd className="text-charcoal">{product.material} — {product.finish}</dd>
              <dt className="text-taupe">Dimensions</dt>
              <dd className="text-charcoal">{product.dimensions}</dd>
              <dt className="text-taupe">Availability</dt>
              <dd className={product.availability ? 'text-success' : 'text-sale'}>
                {product.availability ? (lowStock ? `In stock — only ${product.stock} left` : 'In stock, ready to ship') : 'Currently out of stock'}
              </dd>
            </dl>

            {product.availability ? (
              <>
                <div className="mt-6 flex items-center gap-3">
                  <QuantityStepper value={Math.min(qty, maxQty)} onChange={(n) => setQty(Math.max(1, Math.min(n, maxQty)))} max={maxQty} />
                  <button onClick={() => add(product, qty, { openDrawer: false })} className="btn-dark h-12 flex-1" disabled={inBag >= Math.min(COMMERCE.maxQtyPerItem, product.stock)}>
                    Add to bag
                  </button>
                  <button
                    onClick={() => wishlist.toggle(product)}
                    aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                    aria-pressed={saved}
                    className="flex h-12 w-12 flex-none items-center justify-center border border-stone transition-colors hover:border-charcoal"
                  >
                    <Heart size={18} strokeWidth={1.5} className={saved ? 'fill-sale text-sale' : ''} />
                  </button>
                </div>
                <button onClick={buyNow} className="btn-outline mt-3 h-12 w-full">
                  Buy now
                </button>
                {inBag > 0 && (
                  <p className="mt-3 flex items-center gap-2 text-[13px] text-success">
                    <Check size={14} /> {inBag} in your bag ·{' '}
                    <Link to="/cart" className="text-charcoal underline underline-offset-4">
                      View bag
                    </Link>
                  </p>
                )}
              </>
            ) : (
              <div className="mt-6 flex gap-3">
                <button disabled className="btn-dark h-12 flex-1">
                  Sold out
                </button>
                <button onClick={() => wishlist.toggle(product)} aria-pressed={saved} className="btn-outline h-12">
                  <Heart size={16} strokeWidth={1.5} className={saved ? 'fill-sale text-sale' : ''} /> {saved ? 'Saved' : 'Save for later'}
                </button>
              </div>
            )}

            <ul className="mt-8 grid grid-cols-2 gap-4 text-[13px] text-muted">
              <li className="flex gap-2.5"><Truck size={17} strokeWidth={1.4} className="flex-none text-gold" />Free shipping above ₹{COMMERCE.freeShippingThreshold}</li>
              <li className="flex gap-2.5"><RotateCcw size={17} strokeWidth={1.4} className="flex-none text-gold" />7-day easy returns</li>
              <li className="flex gap-2.5"><ShieldCheck size={17} strokeWidth={1.4} className="flex-none text-gold" />Secure payments, COD available</li>
              <li className="flex gap-2.5"><Gift size={17} strokeWidth={1.4} className="flex-none text-gold" />Gift wrapping on request</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Details tabs */}
      <section id="details" className="container-x scroll-mt-40 pt-20">
        <div role="tablist" aria-label="Product information" className="no-scrollbar flex gap-8 overflow-x-auto border-b border-sand">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              id={`tab-${t}`}
              aria-selected={tab === t}
              aria-controls={`panel-${t}`}
              onClick={() => setTab(t)}
              className={`relative flex-none pb-4 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors ${tab === t ? 'text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-charcoal' : 'text-taupe hover:text-charcoal'}`}
            >
              {t}
              {t === 'Reviews' && product.reviewCount ? ` (${product.reviewCount})` : ''}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="max-w-3xl animate-fade-in py-10 text-[15px] text-muted">
          {tab === 'Description' && (
            <div className="space-y-5">
              <p>{product.description}</p>
              <ul className="space-y-2">
                {product.details.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="mt-[10px] h-px w-3 flex-none bg-gold" />
                    {d}
                  </li>
                ))}
              </ul>
              <div>
                <h3 className="mb-1 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-ink">Care</h3>
                <p>{product.care}</p>
              </div>
              <p className="text-[13px] text-taupe">
                Handmade from natural materials — slight variations in grain, veining, glaze and texture make each piece unique.
              </p>
            </div>
          )}
          {tab === 'Specifications' && (
            <table className="w-full text-left text-[14px]">
              <tbody>
                {specs.map(([k, v]) => (
                  <tr key={k} className="border-b border-sand">
                    <th scope="row" className="w-44 py-3 font-normal text-taupe">{k}</th>
                    <td className="py-3 text-charcoal">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === 'Shipping' && (
            <div className="space-y-3">
              <p>Free standard shipping on all orders above ₹{COMMERCE.freeShippingThreshold}. A flat ₹{COMMERCE.standardShipping} applies below that.</p>
              <p>Dispatched within 1–2 business days. Delivery in 2–4 days to metro cities and 4–7 days across the rest of India.</p>
              <p>Every piece is packed in recycled honeycomb paper and double-boxed. Cash on Delivery is available with a ₹{COMMERCE.codFee} handling fee.</p>
              <Link to="/shipping-policy" className="inline-block text-charcoal link-underline">Read the full shipping policy</Link>
            </div>
          )}
          {tab === 'Returns' && (
            <div className="space-y-3">
              <p>Unused items in original packaging can be returned within 7 days of delivery for a full refund to your original payment method or as store credit.</p>
              <p>If your order arrives damaged, share an unboxing photo or video within 48 hours and we will replace it at no cost.</p>
              <p>Gift boxes and personalised items are not eligible for return.</p>
              <Link to="/return-policy" className="inline-block text-charcoal link-underline">Read the full return & refund policy</Link>
            </div>
          )}
          {tab === 'Reviews' && (
            <div>
              {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to share your thoughts after your purchase.</p>
              ) : (
                <>
                  <div className="mb-8 flex items-center gap-5 border-b border-sand pb-6">
                    <span className="font-serif text-[52px] leading-none text-ink">{product.rating?.toFixed(1)}</span>
                    <div>
                      <Rating value={product.rating} size={15} />
                      <p className="mt-1 text-[13px] text-taupe">Based on {product.reviewCount} verified reviews</p>
                    </div>
                  </div>
                  <ul className="space-y-8">
                    {reviews.map((r) => (
                      <li key={r.id} className="border-b border-sand pb-8 last:border-0">
                        <div className="flex items-center justify-between">
                          <Rating value={r.rating} size={12} />
                          <span className="text-[12px] text-taupe">{formatDate(r.date)}</span>
                        </div>
                        <h4 className="mt-3 text-[20px]">{r.title}</h4>
                        <p className="mt-1.5">{r.body}</p>
                        <p className="mt-3 text-[12px] text-taupe">
                          {r.author}, {r.city} · <span className="text-success">Verified buyer</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="container-x pt-12">
        <SectionHeading eyebrow="You may also like" title="Related pieces" />
        <ProductRail products={related} label="Related products" />
      </section>

      {recentlyViewed.length > 0 && (
        <section className="container-x pt-20">
          <SectionHeading eyebrow="Your browsing" title="Recently viewed" />
          <ProductRail products={recentlyViewed.slice(0, 8)} label="Recently viewed products" />
        </section>
      )}
    </div>
  );
}

import { Link } from 'react-router';
import { ArrowUpRight, Quote } from 'lucide-react';
import { CATEGORIES, COLLECTIONS, MATERIALS } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { INSPIRATION, TESTIMONIALS } from '../data/content';
import { SITE } from '../config/site';
import { sortProducts } from '../utils/filters';
import { usePageMeta } from '../hooks';
import { Img, SectionHeading } from '../components/common';
import { ProductGrid, ProductRail } from '../components/product/ProductGrid';
import { NewsletterForm } from '../components/common/NewsletterForm';
import { materialSlug } from '../utils/filters';

const bestSellers = sortProducts(PRODUCTS.filter((p) => p.isBestSeller && p.availability), 'best-selling').slice(0, 8);
const newArrivals = sortProducts(PRODUCTS.filter((p) => p.isNewArrival), 'newest');
const trending = sortProducts(
  PRODUCTS.filter((p) => !p.isBestSeller && p.availability),
  'rating',
).slice(0, 4);
const festive = PRODUCTS.filter((p) => p.tags.includes('festive') && p.availability && p.category !== 'gifting').slice(0, 4);
const featuredCollections = COLLECTIONS.filter((c) => !['best-sellers', 'new-arrivals'].includes(c.slug));

const PLATES = [
  { image: 'marble-side-tables', title: 'The sunlit living room', caption: 'Brass, cane and living green against warm plaster.', to: '/collections/the-brass-edit', span: 'md:col-span-7 md:row-span-2', ratio: 'aspect-[4/5] md:aspect-auto md:h-full' },
  { image: 'two-tier-leaf-stand', title: 'A table for long dinners', caption: 'Stoneware, candlelight and teak serveware.', to: '/collections/the-hosts-table', span: 'md:col-span-5', ratio: 'aspect-[4/3]' },
  { image: 'carved-bookcase', title: 'Shelves, slowly collected', caption: 'Frames, bookends and small vessels.', to: '/collections/home-accessories', span: 'md:col-span-5', ratio: 'aspect-[4/3]' },
];

export default function Home() {
  usePageMeta('', 'Shop the Orrniva catalogue of handcrafted Indian home decor — brass, marble, wood and ceramic accessories, kitchen & bar essentials, and gifts.');

  return (
    <div>
      {/* ——— Catalogue masthead */}
      <section className="border-b border-sand">
        <div className="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-6">
            <p className="eyebrow">{SITE.catalogueEdition}</p>
            <h1 className="mt-4 text-[46px] leading-[1.02] sm:text-[64px] lg:text-[80px]">
              The Orrniva
              <br />
              <em className="font-normal text-gold">Catalogue</em>
            </h1>
            <p className="mt-6 max-w-xl text-[16px] text-muted">
              {PRODUCTS.length} objects for the considered Indian home — hand-beaten brass, Makrana marble, sheesham and stoneware, made in small
              batches with artisan workshops from Moradabad to Khurja.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/collections/all" className="btn-dark">
                Browse all {PRODUCTS.length} pieces
              </Link>
              <Link to="/collections/new-arrivals" className="btn-light">
                New this season
              </Link>
            </div>

          <nav aria-label="Catalogue index" className="mt-12">
            <p className="eyebrow mb-3">Index</p>
            <ol className="divide-y divide-sand border-y border-sand">
              {CATEGORIES.map((c, i) => (
                <li key={c.slug}>
                  <Link to={`/collections/${c.slug}`} className="group flex items-baseline gap-4 py-3">
                    <span className="w-6 font-serif text-[15px] text-gold italic">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 font-serif text-[21px] text-ink transition-colors group-hover:text-gold">{c.name}</span>
                    <span className="text-[12px] text-taupe tabular-nums">{PRODUCTS.filter((p) => p.category === c.slug).length}</span>
                    <ArrowUpRight size={15} className="text-taupe transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/collections/best-sellers" className="group flex items-baseline gap-4 py-3">
                  <span className="w-6 font-serif text-[15px] text-gold italic">04</span>
                  <span className="flex-1 font-serif text-[21px] text-ink transition-colors group-hover:text-gold">Best Sellers</span>
                  <span className="text-[12px] text-taupe tabular-nums">{PRODUCTS.filter((p) => p.isBestSeller).length}</span>
                  <ArrowUpRight size={15} className="text-taupe transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </Link>
              </li>
            </ol>
            <p className="mt-6 text-[12px] leading-relaxed text-taupe">
              Shop by material:{' '}
              {MATERIALS.filter((m) => PRODUCTS.some((p) => p.material === m)).map((m, i, arr) => (
                <span key={m}>
                  <Link to={`/collections/all?material=${materialSlug(m)}`} className="text-charcoal hover:underline hover:underline-offset-4">
                    {m}
                  </Link>
                  {i < arr.length - 1 && ', '}
                </span>
              ))}
            </p>
          </nav>
          </div>

          <Link to="/collections/the-brass-edit" className="group relative block overflow-hidden bg-cream lg:col-span-6">
            <div className="aspect-[4/5] sm:aspect-square">
              <Img
                imageKey="tree-of-life-sideboard"
                alt="A carved sheesham sideboard beneath a tree-of-life wall plate, styled with brass candlesticks"
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/70 via-ink/25 to-transparent p-5 pt-20 sm:p-7 sm:pt-24">
              <span>
                <span className="block font-serif text-[14px] text-gold-light italic">Featured edit</span>
                <span className="block font-serif text-[26px] leading-tight text-ivory sm:text-[32px]">The Brass Edit</span>
              </span>
              <span className="flex flex-none items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ivory">
                Shop the edit <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ——— Shop by category */}
      <section className="container-x pt-16 md:pt-20">
        <SectionHeading index="I." eyebrow="Shop by category" title="Three chapters of the home" />
        <div className="grid gap-x-5 gap-y-10 md:grid-cols-3">
          {CATEGORIES.map((c) => (
            <article key={c.slug} className="group">
              <Link to={`/collections/${c.slug}`} className="block overflow-hidden bg-cream">
                <Img imageKey={c.image} alt={c.name} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/5] w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.03]" />
              </Link>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-[28px]">
                  <Link to={`/collections/${c.slug}`} className="hover:text-gold">
                    {c.name}
                  </Link>
                </h3>
                <span className="text-[12px] text-taupe">{PRODUCTS.filter((p) => p.category === c.slug).length} pieces</span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted">
                {c.subCategories.slice(0, 6).map((s) => (
                  <li key={s.slug}>
                    <Link to={`/collections/${c.slug}/${s.slug}`} className="hover:text-ink hover:underline hover:underline-offset-4">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ——— Best sellers */}
      <section className="container-x pt-20 md:pt-28">
        <SectionHeading
          index="II."
          eyebrow="Best sellers"
          title="Most loved by our customers"
          description="The pieces that find their way into the most Orrniva homes."
          action={{ label: 'View all best sellers', to: '/collections/best-sellers' }}
        />
        <ProductGrid products={bestSellers} />
      </section>

      {/* ——— New arrivals */}
      <section className="container-x pt-20 md:pt-28">
        <SectionHeading
          index="III."
          eyebrow="New arrivals"
          title="Just in from the workshops"
          action={{ label: 'Shop new arrivals', to: '/collections/new-arrivals' }}
        />
        <ProductRail products={newArrivals} label="New arrivals" />
      </section>

      {/* ——— Featured collections */}
      <section className="container-x pt-20 md:pt-28">
        <SectionHeading index="IV." eyebrow="Featured collections" title="Curated edits" description="Cross-category edits, assembled by material, mood and occasion." />
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-5">
          {featuredCollections.map((c) => (
            <Link key={c.slug} to={`/collections/${c.slug}`} className="group">
              <div className="aspect-[3/4] overflow-hidden bg-cream">
                <Img imageKey={c.image} alt="" sizes="(min-width: 1024px) 20vw, 50vw" className="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.04]" />
              </div>
              <h3 className="mt-3 text-[21px] group-hover:text-gold">{c.name}</h3>
              <p className="mt-0.5 line-clamp-2 text-[13px] text-muted">{c.description}</p>
              <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-taupe">{PRODUCTS.filter(c.match).length} pieces</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— Trending */}
      <section className="container-x pt-20 md:pt-28">
        <SectionHeading index="V." eyebrow="Trending now" title="Highly rated this month" action={{ label: 'Sort by rating', to: '/collections/all?sort=rating' }} />
        <ProductGrid products={trending} />
      </section>

      {/* ——— Festive edit (product-led, not a banner) */}
      <section className="container-x pt-20 md:pt-28">
        <div className="grid gap-10 border-t border-sand pt-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="eyebrow flex items-center gap-3">
              <span className="font-serif text-[15px] tracking-normal text-gold normal-case italic">VI.</span> Seasonal
            </p>
            <h2 className="mt-2 text-[34px] md:text-[40px]">The Festive Edit</h2>
            <p className="mt-3 text-muted">
              Candlelight, brass and serveware for Diwali evenings and the wedding season. Every piece ships gift-ready with a handwritten note on request.
            </p>
            <div className="mt-6 flex flex-col items-start gap-3">
              <Link to="/collections/festive-edit" className="btn-dark">
                Shop the festive edit
              </Link>
              <Link to="/collections/gifting" className="text-[12px] font-medium uppercase tracking-[0.16em] link-underline">
                Gift boxes & hampers
              </Link>
            </div>
          </div>
          <div className="lg:col-span-9">
            <ProductGrid products={festive} />
          </div>
        </div>
      </section>

      {/* ——— Editorial plates */}
      <section className="container-x pt-20 md:pt-28">
        <SectionHeading index="VII." eyebrow="In the home" title="Plates from our customers' rooms" />
        <div className="grid gap-5 md:grid-cols-12 md:grid-rows-2">
          {PLATES.map((p, i) => (
            <figure key={p.image} className={`group ${p.span}`}>
              <Link to={p.to} className="flex h-full flex-col">
                <div className={`relative flex-1 overflow-hidden bg-cream ${p.ratio}`}>
                  <Img imageKey={p.image} alt={p.title} sizes="(min-width: 768px) 55vw, 100vw" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]" />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                  <span>
                    <span className="mr-2 font-serif text-[14px] text-gold italic">Plate {['I', 'II', 'III'][i]}</span>
                    <span className="font-serif text-[19px] text-ink">{p.title}</span>
                    <span className="block text-[13px] text-muted">{p.caption}</span>
                  </span>
                  <span className="flex-none text-[11px] font-medium uppercase tracking-[0.16em] text-charcoal group-hover:underline group-hover:underline-offset-4">Shop the look</span>
                </figcaption>
              </Link>
            </figure>
          ))}
        </div>
      </section>

      {/* ——— Brand story */}
      <section className="container-x pt-20 md:pt-28">
        <div className="grid items-center gap-10 border-y border-sand py-14 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="aspect-[4/5] overflow-hidden bg-cream">
              <Img imageKey="peacock-brass-bowl" alt="A hand-beaten brass bowl held in an artisan's palm" sizes="(min-width: 768px) 40vw, 100vw" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-7">
            <p className="eyebrow">Our story</p>
            <h2 className="mt-3 text-[34px] md:text-[48px]">Made slowly, by hand, to be kept for a lifetime.</h2>
            <p className="mt-5 max-w-xl text-[16px] text-muted">
              Orrniva began in a Bengaluru studio with a simple belief: the objects we live with every day deserve the same care as the homes they fill.
              We work directly with fourteen family workshops — brass-smiths in Moradabad, stone carvers in Makrana, potters in Khurja — paying fairly
              and designing pieces that honour their craft.
            </p>
            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-6 border-t border-sand pt-6">
              {[
                ['14', 'artisan workshops'],
                ['9', 'natural materials'],
                ['40k+', 'Indian homes'],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-serif text-[36px] text-ink">{n}</dd>
                  <dd className="text-[12px] text-taupe">{l}</dd>
                </div>
              ))}
            </dl>
            <Link to="/about" className="mt-8 inline-block text-[12px] font-medium uppercase tracking-[0.18em] link-underline">
              Read our story
            </Link>
          </div>
        </div>
      </section>

      {/* ——— Testimonials */}
      <section className="container-x pt-20 md:pt-28">
        <SectionHeading index="VIII." eyebrow="Kind words" title="From Orrniva homes" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col border border-sand bg-white/40 p-6">
              <Quote size={20} className="text-gold" strokeWidth={1.25} />
              <blockquote className="mt-4 flex-1 font-serif text-[18px] leading-snug text-ink">“{t.quote}”</blockquote>
              <figcaption className="mt-6 border-t border-sand pt-4 text-[13px]">
                <span className="text-ink">{t.name}</span>
                <span className="text-taupe"> · {t.city}</span>
                <span className="mt-0.5 block text-[12px] text-taupe">Purchased {t.product}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ——— Inspiration gallery */}
      <section className="container-x pt-20 md:pt-28">
        <SectionHeading
          index="IX."
          eyebrow="#LivingWithOrrniva"
          title="Inspiration from the community"
          description="Tag @orrniva.home for a chance to be featured in our next catalogue."
        />
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {INSPIRATION.map((g) => (
            <li key={g.image}>
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden bg-cream" aria-label={`View ${g.handle} on Instagram`}>
                <Img imageKey={g.image} alt="" sizes="(min-width: 640px) 25vw, 50vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/50 to-transparent p-3 text-[12px] text-ivory opacity-0 transition-opacity group-hover:opacity-100">
                  {g.handle}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ——— Newsletter */}
      <section className="container-x pt-20 md:pt-28">
        <div className="grid gap-8 border border-sand bg-cream/60 px-6 py-10 md:grid-cols-2 md:items-center md:px-12 md:py-12">
          <div>
            <p className="eyebrow">The Orrniva letter</p>
            <h2 className="mt-2 text-[32px] md:text-[40px]">Receive the next catalogue first</h2>
            <p className="mt-2 text-muted">Monthly notes on new pieces, styling and the makers behind them — plus ₹200 off your first order.</p>
          </div>
          <NewsletterForm id="home-newsletter" />
        </div>
      </section>
    </div>
  );
}

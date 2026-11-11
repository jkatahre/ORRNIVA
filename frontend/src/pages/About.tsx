import { Link } from 'react-router';
import { usePageMeta } from '../hooks';
import { SITE } from '../config/site';
import { Img, PageHeader } from '../components/common';

const VALUES = [
  { title: 'Made by hand', body: 'Every piece passes through the hands of a craftsperson — hammered, carved, thrown or turned. We celebrate the small irregularities that prove it.' },
  { title: 'Fair to makers', body: 'We work directly with fourteen family workshops, agree prices before production, and pay within fifteen days. No middlemen, no squeezing.' },
  { title: 'Built to last', body: 'Brass that patinates, marble that outlives us, hardwood that can be re-oiled for decades. We design against the throwaway cycle.' },
  { title: 'Gently packed', body: 'Recycled honeycomb paper, cotton dust bags and plastic-free boxes. Our packaging is designed to be reused or composted.' },
];

const MAKERS = [
  { place: 'Moradabad, Uttar Pradesh', craft: 'Brass casting & hand-beating', image: 'brass-ribbon-sculpture' },
  { place: 'Makrana, Rajasthan', craft: 'Marble & stone carving', image: 'lotus-marble-bookends' },
  { place: 'Khurja, Uttar Pradesh', craft: 'Wheel-thrown stoneware', image: 'deer-bookends' },
  { place: 'Saharanpur, Uttar Pradesh', craft: 'Sheesham & mango woodwork', image: 'carved-hall-bench' },
];

export default function About() {
  usePageMeta('About Us', 'Orrniva is a Bengaluru studio working directly with artisan workshops across India to make handcrafted home decor.');
  return (
    <div>
      <PageHeader
        eyebrow="About Orrniva"
        title="A studio for objects with a story"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]}
        description="We design and curate handcrafted home accessories in partnership with artisan workshops across India."
      />

      <section id="story" className="container-x scroll-mt-40 py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div className="aspect-[4/5] overflow-hidden bg-cream">
            <Img imageKey="marble-side-tables" alt="A calm living room styled with Orrniva pieces" sizes="(min-width: 768px) 45vw, 100vw" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="eyebrow">Our story</p>
            <h2 className="mt-3 text-[36px] md:text-[46px]">It began with a brass urli at a weekly market.</h2>
            <div className="mt-6 space-y-4 text-[16px] text-muted">
              <p>
                In 2019, our founder found a hand-beaten brass urli in a Bengaluru market — heavy, beautifully imperfect, and sold for less than a mass-made
                plastic planter. The craftsperson who made it was struggling to find buyers who understood its worth.
              </p>
              <p>
                Orrniva was started to close that gap: to design pieces with India’s finest workshops, present them with the care of a gallery, and make
                them available to homes across the country at honest prices.
              </p>
              <p>Today we work with fourteen workshops and ship to over 19,000 PIN codes — still packing every order by hand in our Bengaluru studio.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sand bg-cream/50">
        <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <div key={v.title}>
              <span className="font-serif text-[16px] text-gold italic">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 text-[24px]">{v.title}</h3>
              <p className="mt-2 text-[14.5px] text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        <p className="eyebrow">Our makers</p>
        <h2 className="mt-2 max-w-2xl text-[36px] md:text-[44px]">Four craft clusters, generations of skill</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
          {MAKERS.map((m) => (
            <figure key={m.place}>
              <div className="aspect-[4/5] overflow-hidden bg-cream">
                <Img imageKey={m.image} alt={m.craft} className="h-full w-full object-cover" />
              </div>
              <figcaption className="mt-3">
                <p className="font-serif text-[19px] text-ink">{m.craft}</p>
                <p className="text-[13px] text-taupe">{m.place}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="journal" className="container-x scroll-mt-40">
        <div className="grid gap-10 border-t border-sand pt-14 md:grid-cols-2">
          <div>
            <p className="eyebrow">Journal</p>
            <h2 className="mt-2 text-[32px]">Notes from the studio</h2>
            <p className="mt-3 text-muted">
              Our journal launches with the next catalogue: maker profiles, care guides and styling notes. Subscribe to the newsletter in the footer to get
              the first issue.
            </p>
          </div>
          <div id="careers" className="scroll-mt-40">
            <p className="eyebrow">Careers</p>
            <h2 className="mt-2 text-[32px]">Work with us</h2>
            <p className="mt-3 text-muted">
              We are a small team in Bengaluru and always glad to hear from people who love craft — in design, sourcing, operations and customer care.
              Write to{' '}
              <a href="mailto:careers@orrniva.in" className="text-charcoal link-underline">careers@orrniva.in</a> with a note about yourself.
            </p>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap gap-3">
          <Link to="/collections/all" className="btn-dark">Explore the catalogue</Link>
          <Link to="/contact" className="btn-light">Visit the studio</Link>
        </div>
        <p className="mt-4 text-[13px] text-taupe">Studio: {SITE.address}</p>
      </section>
    </div>
  );
}

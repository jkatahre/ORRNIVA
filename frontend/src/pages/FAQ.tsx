import { Link } from 'react-router';
import { FAQS } from '../data/content';
import { usePageMeta } from '../hooks';
import { Accordion, PageHeader } from '../components/common';

export default function FAQ() {
  usePageMeta('Frequently Asked Questions', 'Answers about Orrniva orders, payments, shipping, returns and product care.');
  return (
    <div>
      <PageHeader title="Frequently Asked Questions" crumbs={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} description="Everything you need to know about ordering from Orrniva." />
      <div className="container-x grid gap-12 py-12 md:py-16 lg:grid-cols-12">
        <nav aria-label="FAQ sections" className="hidden lg:col-span-3 lg:block">
          <ul className="sticky top-[150px] space-y-2">
            {FAQS.map((g) => (
              <li key={g.group}>
                <a href={`#${g.group.replace(/\W+/g, '-').toLowerCase()}`} className="text-[14px] text-muted hover:text-ink">{g.group}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-12 lg:col-span-8">
          {FAQS.map((g) => (
            <section key={g.group} id={g.group.replace(/\W+/g, '-').toLowerCase()} className="scroll-mt-40">
              <h2 className="mb-2 text-[28px]">{g.group}</h2>
              <div className="border-t border-sand">
                {g.items.map((i, idx) => (
                  <Accordion key={i.q} title={i.q} defaultOpen={idx === 0}>
                    <p>{i.a}</p>
                  </Accordion>
                ))}
              </div>
            </section>
          ))}
          <div className="border border-sand bg-cream/50 p-6">
            <h2 className="text-[24px]">Still have a question?</h2>
            <p className="mt-1 text-muted">Our care team replies within one business day.</p>
            <Link to="/contact" className="btn-dark mt-4">Contact us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

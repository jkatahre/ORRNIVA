import { Link } from 'react-router';
import { SITE } from '../../config/site';
import { Logo } from '../common';
import { NewsletterForm } from '../common/NewsletterForm';
import { PaymentBadges, SocialLinks } from '../common/Brand';

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Customer Service',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Shipping Policy', to: '/shipping-policy' },
      { label: 'Return & Refund', to: '/return-policy' },
      { label: 'Track Order', to: '/track-order' },
    ],
  },
  {
    title: 'About Orrniva',
    links: [
      { label: 'Our Story', to: '/about#story' },
      { label: 'About Us', to: '/about' },
      { label: 'Journal', to: '/about#journal' },
      { label: 'Careers', to: '/about#careers' },
    ],
  },
  {
    title: 'Shopping',
    links: [
      { label: 'Shop All', to: '/collections/all' },
      { label: 'Best Sellers', to: '/collections/best-sellers' },
      { label: 'New Arrivals', to: '/collections/new-arrivals' },
      { label: 'Gift Collections', to: '/collections/gifting' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-sand bg-cream/60">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-5 max-w-sm text-muted">
            A considered catalogue of handcrafted objects for the Indian home — made with artisan workshops across the country.
          </p>
          <address className="mt-6 space-y-1 text-[13px] text-muted not-italic">
            <p>{SITE.address}</p>
            <p>
              <a href={`mailto:${SITE.email}`} className="link-underline">
                {SITE.email}
              </a>
              <span className="mx-2 text-stone">·</span>
              <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="link-underline">
                {SITE.phone}
              </a>
            </p>
          </address>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[14px] text-muted transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3">
          <h3 className="mb-2 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink">Newsletter</h3>
          <p className="mb-4 text-[14px] text-muted">New arrivals, styling notes and early access to sales. Enjoy ₹200 off your first order.</p>
          <NewsletterForm id="footer-newsletter" />
          <div className="mt-8">
            <SocialLinks />
          </div>
        </div>
      </div>

      <div className="border-t border-sand">
        <div className="container-x flex flex-col items-start justify-between gap-4 py-6 text-[12px] text-taupe md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {SITE.name} Living Pvt. Ltd. All rights reserved.
            <span className="mx-2 text-stone">·</span>
            <Link to="/privacy-policy" className="hover:text-ink">
              Privacy Policy
            </Link>
          </p>
          <PaymentBadges />
        </div>
      </div>
    </footer>
  );
}

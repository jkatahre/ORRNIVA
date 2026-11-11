import { Link } from 'react-router';
import { usePageMeta } from '../hooks';
import { CATEGORIES } from '../data/categories';

export default function NotFound() {
  usePageMeta('Page not found');
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-[96px] leading-none text-gold italic">404</p>
      <h1 className="mt-4 text-[36px]">This page has been moved or no longer exists</h1>
      <p className="mt-3 max-w-md text-muted">Let us help you find your way back to the catalogue.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-dark">Back to home</Link>
        <Link to="/collections/all" className="btn-light">Shop all products</Link>
      </div>
      <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px]">
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link to={`/collections/${c.slug}`} className="link-underline">{c.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

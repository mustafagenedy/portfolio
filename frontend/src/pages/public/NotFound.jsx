import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useDocTitle } from '../../hooks/useDocTitle';

export default function NotFound() {
  useDocTitle('Page not found');

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-bg dark:bg-bg-dark">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-4">
          Error 404
        </p>
        <h1 className="text-5xl md:text-6xl font-bold text-primary dark:text-white mb-4">
          Route not found
        </h1>
        <p className="text-muted mb-8">
          The page you're looking for was moved or never existed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-secondary text-sm font-semibold transition-colors"
        >
          <FiArrowLeft size={16} /> Back home
        </Link>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

/** Shared auth-page wrapper — brand strip + card + exit button. */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-bg-dark p-6 relative">
      {/* Exit to home — top-right floating button */}
      <Link
        to="/"
        aria-label="Back to site"
        className="absolute top-5 right-5 p-2.5 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-accent text-muted hover:text-primary dark:hover:text-white transition-all"
      >
        <FiX size={18} />
      </Link>

      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-block text-2xl font-bold text-primary dark:text-white mb-8"
        >
          MG<span className="text-accent">.</span>
        </Link>

        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold text-primary dark:text-white mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-muted mb-6">{subtitle}</p>}
          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
      </div>
    </div>
  );
}

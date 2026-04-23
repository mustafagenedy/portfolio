import { Link } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../store/auth';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const user = useAuth((s) => s.user);
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary dark:text-white">
          MG<span className="text-accent">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-muted hover:text-primary dark:hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {user ? (
            <Link
              to={isAdmin ? '/admin' : '/dashboard'}
              className="text-sm font-medium px-4 py-2 rounded-xl bg-primary text-white hover:bg-secondary transition-colors"
            >
              {isAdmin ? 'Admin' : 'Dashboard'}
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium px-4 py-2 rounded-xl bg-primary text-white hover:bg-secondary transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

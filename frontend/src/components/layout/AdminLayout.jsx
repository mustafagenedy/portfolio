import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiFolder, FiUsers, FiMail, FiArrowLeft, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../store/auth';

const links = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/projects', icon: FiFolder, label: 'Projects' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/messages', icon: FiMail, label: 'Messages' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  const onLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-bg dark:bg-bg-dark">
      <aside className="w-64 bg-surface dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-muted hover:text-primary dark:hover:text-accent mb-6 text-sm"
        >
          <FiArrowLeft size={16} /> Back to site
        </NavLink>
        <h2 className="text-lg font-semibold text-primary dark:text-white mb-4">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-1 flex-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent'
                    : 'text-muted hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-muted mb-1">Signed in as</p>
          <p className="text-sm font-semibold text-primary dark:text-white truncate">
            {user?.name}
          </p>
          <p className="text-xs text-muted truncate mb-3">{user?.email}</p>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <FiLogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 p-8 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}

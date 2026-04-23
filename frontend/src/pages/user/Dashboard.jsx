import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiBookmark, FiUser, FiMail } from 'react-icons/fi';
import api from '../../lib/api';
import { useAuth } from '../../store/auth';
import StatCard from '../../components/ui/StatCard';
import { useDocTitle } from '../../hooks/useDocTitle';

export default function UserDashboard() {
  useDocTitle('My Dashboard');
  const user = useAuth((s) => s.user);

  const { data: saved = [] } = useQuery({
    queryKey: ['saved-projects'],
    queryFn: () => api.get('/users/saved').then((r) => r.data),
  });

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-1">
        Welcome, {user?.name?.split(' ')[0] || 'there'}.
      </h1>
      <p className="text-sm text-muted mb-8">Your saved projects and profile in one place.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Saved projects" value={saved.length} icon={FiBookmark} />
        <StatCard label="Account" value={user?.role || 'user'} icon={FiUser} accent="accent" />
        <StatCard
          label="Email"
          value={user?.email?.split('@')[0] || '—'}
          icon={FiMail}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Link
          to="/dashboard/saved"
          className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-accent transition-colors group"
        >
          <FiBookmark size={22} className="text-accent mb-3" />
          <h3 className="font-bold text-primary dark:text-white mb-1">Saved projects</h3>
          <p className="text-sm text-muted">
            Projects you've bookmarked for reference.
          </p>
        </Link>

        <Link
          to="/dashboard/profile"
          className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-accent transition-colors group"
        >
          <FiUser size={22} className="text-accent mb-3" />
          <h3 className="font-bold text-primary dark:text-white mb-1">Profile</h3>
          <p className="text-sm text-muted">Update your name, avatar, and password.</p>
        </Link>
      </div>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { FiEye, FiUsers, FiMail, FiTrendingUp } from 'react-icons/fi';
import api from '../../lib/api';
import StatCard from '../../components/ui/StatCard';
import { useDocTitle } from '../../hooks/useDocTitle';

const fetchAnalytics = async () => {
  const { data } = await api.get('/analytics');
  return data;
};

export default function AdminDashboard() {
  useDocTitle('Admin');
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
  });

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-1">
        Overview
      </h1>
      <p className="text-sm text-muted mb-8">
        Site health, traffic, and top content at a glance.
      </p>

      {isLoading && <p className="text-muted">Loading...</p>}
      {error && (
        <p className="text-sm text-red-500">
          Couldn't load analytics — make sure the backend is running.
        </p>
      )}

      {data && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total visits" value={data.totalVisits} icon={FiEye} />
            <StatCard
              label="Last 30 days"
              value={data.recentVisits}
              accent="accent"
              icon={FiTrendingUp}
            />
            <StatCard label="Users" value={data.userCount} icon={FiUsers} />
            <StatCard
              label="Unread messages"
              value={data.unreadMessages}
              accent={data.unreadMessages > 0 ? 'amber' : 'primary'}
              icon={FiMail}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top projects */}
            <section className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">
                Top projects by clicks
              </h2>
              {data.topProjects?.length ? (
                <ul className="space-y-3">
                  {data.topProjects.map((p, i) => (
                    <li
                      key={p._id}
                      className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-muted text-xs font-mono w-4">{i + 1}</span>
                        <span className="font-semibold text-primary dark:text-white truncate">
                          {p.title}
                        </span>
                      </div>
                      <span className="text-sm font-mono text-accent">{p.clicks}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">No clicks tracked yet.</p>
              )}
            </section>

            {/* 7-day trend */}
            <section className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">
                Last 7 days
              </h2>
              {data.visitsByDay?.length ? (
                <VisitChart data={data.visitsByDay} />
              ) : (
                <p className="text-sm text-muted">No traffic recorded in the last 7 days.</p>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function VisitChart({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d) => (
        <div key={d._id} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t bg-accent/60 hover:bg-accent transition-colors"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: '4px' }}
            title={`${d._id}: ${d.count} visits`}
          />
          <span className="text-[10px] text-muted">{d._id.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiMail, FiCheck, FiClock } from 'react-icons/fi';
import api from '../../lib/api';
import { useDocTitle } from '../../hooks/useDocTitle';

const relativeTime = (iso) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function UserMessages() {
  useDocTitle('My Messages');

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['my-messages'],
    queryFn: () => api.get('/messages/mine').then((r) => r.data),
  });

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-1">
        My Messages
      </h1>
      <p className="text-sm text-muted mb-8">
        Messages you've sent via the contact form, and whether they've been read.
      </p>

      {isLoading ? (
        <p className="text-muted">Loading...</p>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700">
          <FiMail size={32} className="text-muted mx-auto mb-3" />
          <p className="text-muted mb-4">You haven't sent any messages yet.</p>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-secondary text-sm font-semibold transition-colors"
          >
            Send your first message
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <article
              key={m._id}
              className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700"
            >
              <header className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-primary dark:text-white">
                    {m.subject || '(no subject)'}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">{relativeTime(m.createdAt)}</p>
                </div>
                <div className="shrink-0">
                  {m.isRead ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400">
                      <FiCheck size={12} /> Read
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                      <FiClock size={12} /> Pending
                    </span>
                  )}
                </div>
              </header>
              <p className="text-sm text-text dark:text-text-dark whitespace-pre-wrap leading-relaxed mt-3">
                {m.body}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiMail, FiCheck, FiTrash2 } from 'react-icons/fi';
import api from '../../lib/api';

const relativeTime = (iso) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function AdminMessages() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => api.get('/messages').then((r) => r.data),
  });

  const markRead = useMutation({
    mutationFn: (id) => api.put(`/messages/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-messages'] }),
  });

  const remove = useMutation({
    mutationFn: (id) => api.delete(`/messages/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-messages'] }),
  });

  const onDelete = (id) => {
    if (window.confirm('Delete this message?')) remove.mutate(id);
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-1">
        Messages
      </h1>
      <p className="text-sm text-muted mb-8">Inbox for the contact form.</p>

      {isLoading ? (
        <p className="text-muted">Loading...</p>
      ) : !data?.messages?.length ? (
        <div className="text-center py-20 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700">
          <FiMail size={32} className="text-muted mx-auto mb-3" />
          <p className="text-muted">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.messages.map((m) => (
            <article
              key={m._id}
              className={`p-5 rounded-2xl bg-white dark:bg-surface-dark border transition-colors ${
                m.isRead
                  ? 'border-gray-200 dark:border-gray-700'
                  : 'border-accent/50 dark:border-accent/50'
              }`}
            >
              <header className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-primary dark:text-white flex items-center gap-2">
                    {!m.isRead && (
                      <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                    )}
                    {m.subject || '(no subject)'}
                  </h3>
                  <p className="text-sm text-muted">
                    <span className="font-medium">{m.name}</span>
                    <span className="mx-1">·</span>
                    <a href={`mailto:${m.email}`} className="hover:text-accent">
                      {m.email}
                    </a>
                    <span className="mx-1">·</span>
                    <span>{relativeTime(m.createdAt)}</span>
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!m.isRead && (
                    <button
                      onClick={() => markRead.mutate(m._id)}
                      aria-label="Mark as read"
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-muted hover:text-primary dark:hover:text-white"
                    >
                      <FiCheck size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(m._id)}
                    aria-label="Delete"
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-muted hover:text-red-500"
                  >
                    <FiTrash2 size={15} />
                  </button>
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

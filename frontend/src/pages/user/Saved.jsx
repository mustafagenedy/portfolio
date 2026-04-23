import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiBookmark, FiExternalLink, FiGithub, FiTrash2 } from 'react-icons/fi';
import api from '../../lib/api';

export default function UserSaved() {
  const qc = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['saved-projects'],
    queryFn: () => api.get('/users/saved').then((r) => r.data),
  });

  const unsave = useMutation({
    mutationFn: (projectId) => api.post(`/users/saved/${projectId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-projects'] }),
  });

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-1">
        Saved projects
      </h1>
      <p className="text-sm text-muted mb-8">Everything you've bookmarked.</p>

      {isLoading ? (
        <p className="text-muted">Loading...</p>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700">
          <FiBookmark size={32} className="text-muted mx-auto mb-3" />
          <p className="text-muted">No saved projects yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p) => (
            <article
              key={p._id}
              className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                  {p.category}
                </span>
                <button
                  onClick={() => unsave.mutate(p._id)}
                  aria-label="Remove from saved"
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-muted hover:text-red-500"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
              <h3 className="font-bold text-primary dark:text-white mb-1.5">{p.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-4">{p.summary}</p>
              <div className="flex gap-2">
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-primary dark:hover:text-white"
                  >
                    <FiGithub size={16} />
                  </a>
                )}
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-primary dark:hover:text-white"
                  >
                    <FiExternalLink size={16} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

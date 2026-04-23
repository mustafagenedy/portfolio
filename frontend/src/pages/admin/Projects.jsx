import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiEyeOff, FiEye, FiStar } from 'react-icons/fi';
import api from '../../lib/api';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const CATEGORIES = ['full-stack', 'backend', 'machine-learning', 'it-systems'];
const EMPTY = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  problem: '',
  solution: '',
  architecture: '',
  challenges: '',
  category: 'full-stack',
  techStack: '',
  liveUrl: '',
  githubUrl: '',
  featured: false,
  visible: true,
};

export default function AdminProjects() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // null | { _id?: string, ... }

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => api.get('/projects').then((r) => r.data),
  });

  const saveMutation = useMutation({
    mutationFn: (payload) => {
      const body = {
        ...payload,
        techStack: payload.techStack
          ? payload.techStack.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        order: Number(payload.order) || 0,
      };
      // Strip internal React state before sending
      delete body._id;
      delete body.__v;
      delete body.createdAt;
      delete body.updatedAt;
      delete body.clicks;
      delete body.images;
      delete body.thumbnail;

      return payload._id
        ? api.put(`/projects/${payload._id}`, body).then((r) => r.data)
        : api.post('/projects', body).then((r) => r.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-projects'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-projects'] }),
  });

  const openNew = () => setEditing({ ...EMPTY });
  const openEdit = (p) =>
    setEditing({ ...p, techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : '' });

  const onDelete = (p) => {
    if (window.confirm(`Delete "${p.title}"? This can't be undone.`)) {
      deleteMutation.mutate(p._id);
    }
  };

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-1">
            Projects
          </h1>
          <p className="text-sm text-muted">Create, edit, and toggle visibility of case studies.</p>
        </div>
        <Button onClick={openNew}>
          <FiPlus size={16} /> New project
        </Button>
      </header>

      {isLoading ? (
        <p className="text-muted">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-muted">No projects yet. Create your first one.</p>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-bg-dark/60 text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Category</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Clicks</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-dark">
              {projects.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-gray-100 dark:border-gray-700"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-primary dark:text-white">
                      {p.title}
                    </div>
                    <div className="text-xs text-muted font-mono">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell font-mono text-accent">
                    {p.clicks || 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {p.visible ? (
                        <span title="Visible" className="text-green-500">
                          <FiEye size={14} />
                        </span>
                      ) : (
                        <span title="Hidden" className="text-muted">
                          <FiEyeOff size={14} />
                        </span>
                      )}
                      {p.featured && (
                        <span title="Featured" className="text-amber-500">
                          <FiStar size={14} />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(p)}
                      aria-label="Edit"
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-muted hover:text-primary dark:hover:text-white"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      aria-label="Delete"
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-muted hover:text-red-500"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?._id ? 'Edit project' : 'New project'}
        size="lg"
      >
        {editing && (
          <ProjectForm
            value={editing}
            onSubmit={saveMutation.mutate}
            onCancel={() => setEditing(null)}
            loading={saveMutation.isPending}
            error={saveMutation.error?.response?.data?.error}
            fieldErrors={saveMutation.error?.response?.data?.details || {}}
          />
        )}
      </Modal>
    </div>
  );
}

function ProjectForm({ value, onSubmit, onCancel, loading, error, fieldErrors = {} }) {
  const [form, setForm] = useState(value);
  const update = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const err = (key) => fieldErrors[key]?.[0];

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Title" value={form.title} onChange={update('title')} required error={err('title')} />
        <Input
          label="Slug"
          value={form.slug}
          onChange={update('slug')}
          pattern="[a-z0-9\-]+"
          required
          error={err('slug')}
        />
      </div>

      <Input label="Summary" value={form.summary} onChange={update('summary')} required error={err('summary')} />

      <Textarea
        label="Description"
        value={form.description}
        onChange={update('description')}
        required
        error={err('description')}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Textarea label="Problem" value={form.problem} onChange={update('problem')} rows={3} />
        <Textarea label="Solution" value={form.solution} onChange={update('solution')} rows={3} />
      </div>

      <Textarea
        label="Architecture"
        value={form.architecture}
        onChange={update('architecture')}
        rows={3}
      />
      <Textarea
        label="Challenges & trade-offs"
        value={form.challenges}
        onChange={update('challenges')}
        rows={3}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-1.5">
            Category
          </label>
          <select
            value={form.category}
            onChange={update('category')}
            className="w-full px-4 py-3 rounded-xl bg-bg dark:bg-bg-dark border border-gray-200 dark:border-gray-700 text-sm text-text dark:text-text-dark focus:outline-none focus:border-accent"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Tech stack (comma-separated)"
          value={form.techStack}
          onChange={update('techStack')}
          error={err('techStack')}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Live URL" value={form.liveUrl} onChange={update('liveUrl')} error={err('liveUrl')} />
        <Input label="GitHub URL" value={form.githubUrl} onChange={update('githubUrl')} error={err('githubUrl')} />
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={form.featured} onChange={update('featured')} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={form.visible} onChange={update('visible')} />
          Visible on site
        </label>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">{error}</p>
          {Object.keys(fieldErrors).length > 0 && (
            <ul className="mt-2 text-xs text-red-600 dark:text-red-400 list-disc list-inside space-y-0.5">
              {Object.entries(fieldErrors).map(([field, msgs]) => (
                <li key={field}>
                  <strong>{field}:</strong> {Array.isArray(msgs) ? msgs.join(', ') : msgs}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}

function Textarea({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-1.5">
        {label}
      </label>
      <textarea
        rows={props.rows || 4}
        {...props}
        className={`w-full px-4 py-3 rounded-xl bg-bg dark:bg-bg-dark border text-sm text-text dark:text-text-dark focus:outline-none focus:border-accent transition-colors resize-y ${
          error ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

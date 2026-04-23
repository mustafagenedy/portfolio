import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiShield, FiUser, FiCheck, FiSlash } from 'react-icons/fi';
import api from '../../lib/api';

export default function AdminUsers() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => api.get(`/users?page=${page}`).then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...rest }) => api.put(`/users/${id}`, rest),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const setRole = (id, role) => updateMutation.mutate({ id, role });
  const setActive = (id, isActive) => updateMutation.mutate({ id, isActive });

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-1">
        Users
      </h1>
      <p className="text-sm text-muted mb-8">Promote admins and deactivate accounts.</p>

      {isLoading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-bg-dark/60 text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface-dark">
                {data?.users?.map((u) => (
                  <tr key={u._id} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="px-4 py-3 font-semibold text-primary dark:text-white">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-accent/10 text-accent'
                            : 'bg-gray-100 dark:bg-gray-800 text-muted'
                        }`}
                      >
                        {u.role === 'admin' ? <FiShield size={11} /> : <FiUser size={11} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.isActive ? (
                        <span className="text-green-600 dark:text-green-400 text-xs font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-500 text-xs font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setRole(u._id, u.role === 'admin' ? 'user' : 'admin')}
                        className="text-xs font-semibold text-primary dark:text-accent hover:underline mr-3"
                      >
                        {u.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        onClick={() => setActive(u._id, !u.isActive)}
                        aria-label={u.isActive ? 'Deactivate' : 'Activate'}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-muted"
                      >
                        {u.isActive ? <FiSlash size={14} /> : <FiCheck size={14} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data?.pages > 1 && (
            <div className="flex items-center justify-between mt-5 text-sm">
              <span className="text-muted">
                Page {data.page} of {data.pages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={page === data.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

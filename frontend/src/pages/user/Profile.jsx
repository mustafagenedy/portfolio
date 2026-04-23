import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FiCheck, FiSave } from 'react-icons/fi';
import api from '../../lib/api';
import { useAuth } from '../../store/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function UserProfile() {
  const user = useAuth((s) => s.user);
  const refreshUser = useAuth((s) => s.refreshUser);

  const [form, setForm] = useState({ name: '', avatar: '', password: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: user.name, avatar: user.avatar || '' }));
  }, [user]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const mutation = useMutation({
    mutationFn: (payload) => api.put('/users/profile', payload),
    onSuccess: async () => {
      await refreshUser();
      setForm((f) => ({ ...f, password: '' }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { name: form.name, avatar: form.avatar };
    if (form.password) payload.password = form.password;
    mutation.mutate(payload);
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-1">
        Profile
      </h1>
      <p className="text-sm text-muted mb-8">Update your account details.</p>

      <form
        onSubmit={onSubmit}
        className="max-w-xl p-6 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 space-y-4"
      >
        <Input label="Email" value={user?.email || ''} disabled />
        <Input label="Name" value={form.name} onChange={update('name')} required />
        <Input label="Avatar URL" value={form.avatar} onChange={update('avatar')} />
        <Input
          label="New password (leave blank to keep current)"
          type="password"
          value={form.password}
          onChange={update('password')}
          autoComplete="new-password"
        />

        {mutation.isError && (
          <p className="text-sm text-red-500">
            {mutation.error?.response?.data?.error || 'Failed to save.'}
          </p>
        )}

        <Button type="submit" disabled={mutation.isPending}>
          {saved ? (
            <>
              <FiCheck size={16} /> Saved
            </>
          ) : mutation.isPending ? (
            'Saving...'
          ) : (
            <>
              <FiSave size={16} /> Save changes
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

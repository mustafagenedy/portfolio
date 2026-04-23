import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import AuthShell from '../../components/auth/AuthShell';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../store/auth';
import { useDocTitle } from '../../hooks/useDocTitle';

export default function Login() {
  useDocTitle('Sign in');
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuth((s) => s.login);

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/';

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin' : from === '/login' ? '/dashboard' : from, {
        replace: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your account and saved projects."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="text-primary dark:text-accent font-semibold">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={update('email')}
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={update('password')}
          autoComplete="current-password"
          required
        />

        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full justify-center">
          <FiLogIn size={16} /> {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthShell>
  );
}

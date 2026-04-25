import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi';
import AuthShell from '../../components/auth/AuthShell';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../store/auth';
import { useDocTitle } from '../../hooks/useDocTitle';

const validate = ({ name, email, password }) => {
  if (!name || name.length < 2) return 'Name must be at least 2 characters';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain a digit';
  return null;
};

export default function Register() {
  useDocTitle('Create account');
  const navigate = useNavigate();
  const register = useAuth((s) => s.register);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const clientError = validate(form);
    if (clientError) return setError(clientError);

    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Save projects and get in touch."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-primary dark:text-accent font-semibold">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Full name"
          value={form.name}
          onChange={update('name')}
          autoComplete="name"
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={update('email')}
          autoComplete="email"
          required
        />
        <div>
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={update('password')}
            autoComplete="new-password"
            required
          />
          <p className="text-xs text-muted mt-1.5">
            8+ characters, with at least one uppercase, one lowercase, and one digit.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full justify-center">
          <FiUserPlus size={16} /> {loading ? 'Creating...' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  );
}

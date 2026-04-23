import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/auth';

export default function ProtectedRoute({ requiredRole }) {
  const user = useAuth((s) => s.user);
  const token = useAuth((s) => s.accessToken);

  if (!token) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />;

  return <Outlet />;
}

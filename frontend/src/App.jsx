import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PageLoader from './components/ui/PageLoader';
import api from './lib/api';

// Eager: public shell + home (first paint matters most)
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/public/Home';

// Lazy: everything else → code-split chunks
const ProjectDetail = lazy(() => import('./pages/public/ProjectDetail'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProjects = lazy(() => import('./pages/admin/Projects'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));

const UserLayout = lazy(() => import('./components/layout/UserLayout'));
const UserDashboard = lazy(() => import('./pages/user/Dashboard'));
const UserSaved = lazy(() => import('./pages/user/Saved'));
const UserMessages = lazy(() => import('./pages/user/Messages'));
const UserProfile = lazy(() => import('./pages/user/Profile'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});

/** Fire a lightweight visit track on every route change. Silently fails. */
function AnalyticsTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    api.post('/analytics/track', { page: pathname }).catch(() => {});
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AnalyticsTracker />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="project/:slug" element={<ProjectDetail />} />
              </Route>

              {/* Auth */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* User Dashboard */}
              <Route element={<ProtectedRoute />}>
                <Route element={<UserLayout />}>
                  <Route path="dashboard" element={<UserDashboard />} />
                  <Route path="dashboard/saved" element={<UserSaved />} />
                  <Route path="dashboard/messages" element={<UserMessages />} />
                  <Route path="dashboard/profile" element={<UserProfile />} />
                </Route>
              </Route>

              {/* Admin Dashboard */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route element={<AdminLayout />}>
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="admin/projects" element={<AdminProjects />} />
                  <Route path="admin/users" element={<AdminUsers />} />
                  <Route path="admin/messages" element={<AdminMessages />} />
                </Route>
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

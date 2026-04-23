/** Integration test — spins up Express + an in-memory MongoDB, then exercises
 *  the full auth + project flow end-to-end. Run: `npm test` from backend/.
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { buildApp } from './testApp.js';
import User from './models/User.js';
import Project from './models/Project.js';

process.env.JWT_SECRET = 'test-jwt-secret-1234567890abcdefghij';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-1234567890abcdefghij';

const results = [];
const assert = (name, cond, detail = '') => {
  results.push({ name, ok: cond, detail });
  const icon = cond ? 'PASS' : 'FAIL';
  console.log(`[${icon}] ${name}${detail ? ` — ${detail}` : ''}`);
};

const run = async () => {
  console.log('Starting in-memory MongoDB...');
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  console.log('Connected.\n');

  const app = buildApp();
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const http = (path, opts = {}) =>
    fetch(`${base}${path}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });

  try {
    // 1. Health
    const health = await http('/api/health').then((r) => r.json());
    assert('GET /api/health returns ok', health.status === 'ok');

    // 2. Register
    const regRes = await http('/api/auth/register', {
      method: 'POST',
      body: { name: 'Test User', email: 'test@example.com', password: 'Passw0rd!' },
    });
    const reg = await regRes.json();
    assert('POST /api/auth/register creates user', regRes.status === 201 && !!reg.accessToken);

    // 3. Login
    const loginRes = await http('/api/auth/login', {
      method: 'POST',
      body: { email: 'test@example.com', password: 'Passw0rd!' },
    });
    const login = await loginRes.json();
    assert('POST /api/auth/login returns token', loginRes.status === 200 && !!login.accessToken);

    // 4. Bad login
    const badLogin = await http('/api/auth/login', {
      method: 'POST',
      body: { email: 'test@example.com', password: 'wrong' },
    });
    assert('POST /api/auth/login rejects wrong password', badLogin.status === 401);

    // 5. /me
    const meRes = await http('/api/auth/me', {
      headers: { Authorization: `Bearer ${login.accessToken}` },
    });
    const me = await meRes.json();
    assert('GET /api/auth/me returns current user', meRes.status === 200 && me.user.email === 'test@example.com');

    // 6. Projects (empty)
    const projRes = await http('/api/projects');
    const projects = await projRes.json();
    assert('GET /api/projects returns array', Array.isArray(projects) && projects.length === 0);

    // 7. Unauthorized create
    const noAuthCreate = await http('/api/projects', {
      method: 'POST',
      body: { title: 'x', slug: 'x', summary: 'x', description: 'x', category: 'full-stack', techStack: ['x'] },
    });
    assert('POST /api/projects blocks unauthenticated', noAuthCreate.status === 401);

    // 8. User can't create projects
    const userCreate = await http('/api/projects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${login.accessToken}` },
      body: { title: 'x', slug: 'x', summary: 'x'.repeat(15), description: 'x'.repeat(15), category: 'full-stack', techStack: ['x'] },
    });
    assert('POST /api/projects blocks non-admin (403)', userCreate.status === 403);

    // 9. Promote user → admin, create a project
    await User.findOneAndUpdate({ email: 'test@example.com' }, { role: 'admin' });
    const adminCreateRes = await http('/api/projects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${login.accessToken}` },
      body: {
        title: 'Test Project',
        slug: 'test-project',
        summary: 'A test project summary',
        description: 'A longer test project description',
        category: 'full-stack',
        techStack: ['React', 'Node.js'],
      },
    });
    const created = await adminCreateRes.json();
    assert('POST /api/projects as admin creates project', adminCreateRes.status === 201 && created.slug === 'test-project');

    // 10. Fetch by slug
    const slugRes = await http('/api/projects/test-project');
    const slugProject = await slugRes.json();
    assert('GET /api/projects/:slug returns project', slugRes.status === 200 && slugProject.title === 'Test Project');

    // 11. Message send (public)
    const msgRes = await http('/api/messages', {
      method: 'POST',
      body: { name: 'Visitor', email: 'visitor@x.com', subject: 'Hi', body: 'Hello there!' },
    });
    assert('POST /api/messages (public) creates message', msgRes.status === 201);

    // 12. Refresh token
    const refreshRes = await http('/api/auth/refresh', {
      method: 'POST',
      body: { refreshToken: login.refreshToken },
    });
    const refreshed = await refreshRes.json();
    assert('POST /api/auth/refresh rotates tokens', refreshRes.status === 200 && !!refreshed.accessToken);

    // 13. Save project (user feature)
    const saveRes = await http(`/api/users/saved/${created._id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${login.accessToken}` },
    });
    const saveResult = await saveRes.json();
    assert('POST /api/users/saved/:id toggles save', saveRes.status === 200 && saveResult.saved === true);

    // 14. Analytics
    const analyticsRes = await http('/api/analytics', {
      headers: { Authorization: `Bearer ${login.accessToken}` },
    });
    const analytics = await analyticsRes.json();
    assert('GET /api/analytics returns summary', analyticsRes.status === 200 && typeof analytics.userCount === 'number');

    // 15. 404
    const notFoundRes = await http('/api/bogus');
    assert('Unknown route returns 404', notFoundRes.status === 404);
  } finally {
    await new Promise((r) => server.close(r));
    await mongoose.disconnect();
    await mongod.stop();
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
};

run().catch((err) => {
  console.error('Test runner crashed:', err);
  process.exit(1);
});

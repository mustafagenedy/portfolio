/** Dev probe — builds the Express app without DB and hits key endpoints. */
import { buildApp } from './testApp.js';

const app = buildApp();
const server = app.listen(0, async () => {
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  const tests = [
    { name: 'GET /api/health', url: `${base}/api/health`, method: 'GET' },
    { name: 'GET /api/projects (no DB → error)', url: `${base}/api/projects`, method: 'GET' },
    { name: 'POST /api/auth/login (bad body)', url: `${base}/api/auth/login`, method: 'POST', body: {} },
    { name: 'GET /api/nonexistent (404)', url: `${base}/api/nonexistent`, method: 'GET' },
    { name: 'GET /api/users (no auth → 401)', url: `${base}/api/users`, method: 'GET' },
  ];

  for (const t of tests) {
    try {
      const res = await fetch(t.url, {
        method: t.method,
        headers: { 'Content-Type': 'application/json' },
        body: t.body ? JSON.stringify(t.body) : undefined,
      });
      const text = await res.text();
      const short = text.length > 120 ? text.slice(0, 120) + '...' : text;
      console.log(`${res.status.toString().padEnd(3)} | ${t.name.padEnd(45)} | ${short}`);
    } catch (err) {
      console.log(`ERR | ${t.name} | ${err.message}`);
    }
  }

  server.close();
});

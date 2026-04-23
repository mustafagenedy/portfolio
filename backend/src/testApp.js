/** Standalone test harness — builds the Express app WITHOUT connecting to MongoDB.
 *  Use for smoke-testing route registration and middleware wiring.
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/message.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { errorHandler, notFound } from './middleware/error.js';

export const buildApp = () => {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: '*', credentials: false }));
  app.use(express.json({ limit: '10mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/analytics', analyticsRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
};

// Allow: `node src/testApp.js` → starts an app without DB for smoke testing
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const app = buildApp();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Test app running on port ${port} (no DB)`));
}

import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Project from './models/Project.js';

const seed = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Mostafa Genidy';

  if (!adminEmail || !adminPassword) {
    console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear
  await User.deleteMany({});
  await Project.deleteMany({});

  // Admin user — credentials read from env, never committed
  await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });
  console.log(`Admin user created (${adminEmail})`);

  // Sample projects
  await Project.insertMany([
    {
      title: 'E-Commerce Platform',
      slug: 'e-commerce-platform',
      summary: 'Full-stack e-commerce solution with real-time inventory and payment processing.',
      description: 'A scalable e-commerce platform built with Node.js and React featuring real-time inventory management, Stripe payment integration, and role-based admin dashboard.',
      problem: 'Small businesses need affordable, customizable e-commerce solutions that scale without vendor lock-in.',
      solution: 'Built a modular platform with microservice-ready architecture, enabling independent scaling of inventory, orders, and payment services.',
      architecture: 'REST API with Express, React SPA frontend, MongoDB for product catalog, Redis for session caching.',
      challenges: 'Handling concurrent inventory updates required optimistic locking. Payment webhook reliability demanded idempotency keys and retry logic.',
      category: 'full-stack',
      techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Redis', 'Tailwind CSS'],
      featured: true,
      order: 1,
    },
    {
      title: 'ML Prediction API',
      slug: 'ml-prediction-api',
      summary: 'Machine learning model serving via FastAPI with scikit-learn pipeline.',
      description: 'RESTful prediction API that serves a trained scikit-learn model for real-time classification, with automated retraining pipeline.',
      problem: 'Data science teams needed a production-grade model serving layer without heavyweight MLOps infrastructure.',
      solution: 'Lightweight FastAPI service with model versioning, A/B testing support, and automated retraining triggered by data drift detection.',
      architecture: 'FastAPI service, scikit-learn pipeline serialized with joblib, PostgreSQL for prediction logs, Celery for async retraining.',
      challenges: 'Achieving sub-100ms P95 latency required model optimization and response caching for identical feature vectors.',
      category: 'machine-learning',
      techStack: ['Python', 'FastAPI', 'scikit-learn', 'PostgreSQL', 'Docker', 'Celery'],
      featured: true,
      order: 2,
    },
    {
      title: 'Task Management System',
      slug: 'task-management-system',
      summary: 'Real-time collaborative task manager with role-based access control.',
      description: 'A project management tool inspired by Trello and Jira, featuring drag-and-drop boards, real-time updates via WebSocket, and granular permissions.',
      problem: 'Teams needed a self-hosted task management solution with custom workflows and data privacy compliance.',
      solution: 'Built a WebSocket-powered board system with customizable columns, real-time presence indicators, and exportable project reports.',
      architecture: 'Node.js + Express backend, React with DnD Kit frontend, MongoDB for flexible task schemas, Socket.io for real-time sync.',
      challenges: 'Conflict resolution for simultaneous drag operations required operational transform patterns adapted for task positioning.',
      category: 'full-stack',
      techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'JWT', 'Tailwind CSS'],
      featured: false,
      order: 3,
    },
  ]);
  console.log('3 sample projects created');

  await mongoose.disconnect();
  console.log('Seed complete');
};

seed().catch(console.error);

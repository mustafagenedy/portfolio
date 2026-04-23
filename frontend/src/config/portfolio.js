/** Single source of truth for portfolio data (fallback when API is unavailable). */

export const profile = {
  name: 'Mostafa Genidy',
  title: 'Full-Stack Software Engineer',
  tagline: 'I design systems that scale — from database schemas to shipped product.',
  location: 'Giza, Egypt',
  email: 'mostafagenydy@gmail.com',
  phone: '+201552330228',
  whatsapp: '201552330228',
  linkedin: 'https://www.linkedin.com/in/mostafa-genidy-9214b82a7',
  github: 'https://github.com/mustafagenedy',
  cv: '/cv.pdf',
};

export const mindset = [
  {
    title: 'Clean Architecture',
    body: 'Clear separation of routes, services, and models. Each layer owns one concern, and boundaries stay thin.',
  },
  {
    title: 'Scalability First',
    body: 'Design for the next order of magnitude — index what gets queried, cache what repeats, isolate what can fail.',
  },
  {
    title: 'Performance as a Feature',
    body: 'P95 latency and bundle size are metrics I track. Every animation and every query has to justify its cost.',
  },
];

export const stack = {
  Frontend: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'TanStack Query', 'React Router'],
  Backend: ['Node.js', 'Express', 'ASP.NET Core MVC', 'REST APIs', 'JWT Auth', 'RBAC'],
  'Machine Learning': ['Python', 'scikit-learn', 'FastAPI', 'Pandas', 'NumPy'],
  Databases: ['MongoDB', 'Mongoose', 'SQL Server', 'PostgreSQL'],
  'IT Systems': ['Windows Server', 'Networking', 'Smart Systems', 'DevOps Fundamentals'],
};

export const experience = [
  {
    role: 'Full-Stack Developer',
    company: 'Freelance & Contract Work',
    period: '2024 — Present',
    location: 'Giza, Egypt',
    impact: [
      'Designed and shipped REST APIs with JWT auth, RBAC, and modular service layers in Node.js.',
      'Built React frontends consuming those APIs with TanStack Query, cutting stale-data bugs to zero.',
      'Migrated client databases from ad-hoc SQL to versioned Mongoose schemas and indexed queries.',
    ],
  },
  {
    role: 'Backend Engineer',
    company: 'Enterprise Web Applications',
    period: '2023 — 2024',
    location: 'Giza, Egypt',
    impact: [
      'Delivered ASP.NET Core MVC applications against SQL Server with stored-procedure-backed reports.',
      'Reduced average query time on a 2M-row dataset by 4× through targeted indexing and query rewrites.',
      'Introduced code review standards that eliminated an entire class of SQL-injection risks.',
    ],
  },
  {
    role: 'ML / Data Projects',
    company: 'Academic & Personal',
    period: '2022 — 2023',
    location: 'Giza, Egypt',
    impact: [
      'Served scikit-learn classification models via FastAPI with sub-100ms P95 latency.',
      'Built automated retraining pipelines triggered by data drift detection.',
      'Deployed feature stores for categorical encoding reuse across model versions.',
    ],
  },
];

export const fallbackProjects = [
  {
    _id: '1',
    title: 'E-Commerce Platform',
    slug: 'e-commerce-platform',
    summary: 'Full-stack e-commerce solution with real-time inventory and payment processing.',
    description:
      'A scalable e-commerce platform built with Node.js and React featuring real-time inventory management, Stripe payment integration, and role-based admin dashboard.',
    problem:
      'Small businesses need affordable, customizable e-commerce solutions that scale without vendor lock-in.',
    solution:
      'Built a modular platform with microservice-ready architecture, enabling independent scaling of inventory, orders, and payment services.',
    architecture:
      'REST API with Express, React SPA frontend, MongoDB for product catalog, Redis for session caching.',
    challenges:
      'Concurrent inventory updates required optimistic locking. Payment webhook reliability demanded idempotency keys and retry logic.',
    category: 'full-stack',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Redis', 'Tailwind CSS'],
    featured: true,
    githubUrl: 'https://github.com/mustafagenedy',
    liveUrl: '',
  },
  {
    _id: '2',
    title: 'ML Prediction API',
    slug: 'ml-prediction-api',
    summary: 'Machine learning model serving via FastAPI with scikit-learn pipeline.',
    description:
      'RESTful prediction API that serves a trained scikit-learn model for real-time classification with automated retraining.',
    problem:
      'Data science teams needed a production-grade model serving layer without heavyweight MLOps infrastructure.',
    solution:
      'Lightweight FastAPI service with model versioning, A/B testing support, and automated retraining triggered by drift detection.',
    architecture:
      'FastAPI service, scikit-learn pipeline serialized with joblib, PostgreSQL for prediction logs, Celery for async retraining.',
    challenges:
      'Achieving sub-100ms P95 latency required model optimization and response caching for identical feature vectors.',
    category: 'machine-learning',
    techStack: ['Python', 'FastAPI', 'scikit-learn', 'PostgreSQL', 'Docker', 'Celery'],
    featured: true,
    githubUrl: 'https://github.com/mustafagenedy',
    liveUrl: '',
  },
  {
    _id: '3',
    title: 'Task Management System',
    slug: 'task-management-system',
    summary: 'Real-time collaborative task manager with role-based access control.',
    description:
      'A project management tool inspired by Trello and Jira, featuring drag-and-drop boards, real-time updates via WebSocket, and granular permissions.',
    problem:
      'Teams needed a self-hosted task management solution with custom workflows and data privacy compliance.',
    solution:
      'WebSocket-powered board system with customizable columns, presence indicators, and exportable reports.',
    architecture:
      'Node.js + Express backend, React with DnD Kit, MongoDB, Socket.io for real-time sync.',
    challenges:
      'Conflict resolution for simultaneous drag operations required operational transform patterns adapted for task positioning.',
    category: 'full-stack',
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'JWT', 'Tailwind CSS'],
    featured: false,
    githubUrl: 'https://github.com/mustafagenedy',
    liveUrl: '',
  },
  {
    _id: '4',
    title: 'Internal Reporting Dashboard',
    slug: 'internal-reporting-dashboard',
    summary: 'ASP.NET Core MVC dashboard over SQL Server with stored-procedure reports.',
    description:
      'Enterprise reporting dashboard that reduced average report generation time by 4× through targeted indexing.',
    problem:
      'Legacy reports were built from ad-hoc queries hitting a 2M-row OLTP database, blocking business hours.',
    solution:
      'Moved heavy aggregates into indexed views + stored procedures, then layered a cached dashboard on top.',
    architecture:
      'ASP.NET Core MVC server-rendered UI, SQL Server with indexed views, stored procedures for aggregations.',
    challenges:
      'Balancing index maintenance cost against read performance — resolved by scheduling reindex during off-hours.',
    category: 'backend',
    techStack: ['ASP.NET Core', 'C#', 'SQL Server', 'Razor', 'Bootstrap'],
    featured: false,
    githubUrl: 'https://github.com/mustafagenedy',
    liveUrl: '',
  },
];

export const systemMetrics = [
  { label: 'Uptime', value: '99.98%', trend: 'stable' },
  { label: 'P95 Latency', value: '84ms', trend: 'down' },
  { label: 'Req/min', value: '1.2k', trend: 'up' },
  { label: 'Error Rate', value: '0.04%', trend: 'down' },
];

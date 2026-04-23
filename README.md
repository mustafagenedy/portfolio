# Mostafa Genidy — Portfolio

Full-stack portfolio web application built with React, Node.js, Express, and MongoDB.

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS v4, Framer Motion, React Router, TanStack Query, Zustand  
**Backend:** Node.js, Express, Mongoose, JWT, bcrypt, Zod, Cloudinary  
**Database:** MongoDB Atlas

## Project Structure

```
Portfolio/
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── auth/      # ProtectedRoute
│   │   │   ├── common/    # WhatsAppButton, shared components
│   │   │   ├── layout/    # Navbar, Footer, AdminLayout, UserLayout
│   │   │   ├── sections/  # Hero, About, Projects, Experience, Skills, Contact
│   │   │   └── ui/        # Buttons, modals, inputs
│   │   ├── context/       # ThemeContext
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Axios instance
│   │   ├── pages/         # Route-level pages
│   │   │   ├── admin/     # Admin dashboard pages
│   │   │   ├── auth/      # Login, Register
│   │   │   ├── public/    # Home, ProjectDetail
│   │   │   └── user/      # User dashboard pages
│   │   ├── services/      # API service functions
│   │   └── utils/         # Helpers
│   └── vite.config.js
├── backend/           # Express REST API
│   └── src/
│       ├── config/        # DB, Cloudinary
│       ├── controllers/   # Route handlers
│       ├── middleware/     # Auth, validation, upload, error
│       ├── models/        # Mongoose schemas
│       ├── routes/        # Express routers
│       ├── services/      # Business logic (future)
│       ├── utils/         # JWT helpers
│       ├── validators/    # Zod schemas
│       └── server.js      # Entry point
└── package.json       # Root scripts (concurrently)
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)
- Cloudinary account (for image uploads)

### Installation

```bash
# Install all dependencies
npm run install:all

# Or install root + both sides
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Environment Variables

Copy the example files and fill in your values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Development

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run individually
npm run dev:frontend   # http://localhost:5173
npm run dev:backend    # http://localhost:5000
```

### Seed Database

```bash
cd backend
npm run seed
# Creates admin user: mostafagenydy@gmail.com / Admin@1234
# Creates 3 sample projects
```

## API Endpoints

| Method | Endpoint                   | Auth    | Description              |
|--------|----------------------------|---------|--------------------------|
| POST   | /api/auth/register         | -       | Register new user        |
| POST   | /api/auth/login            | -       | Login                    |
| POST   | /api/auth/refresh          | -       | Refresh access token     |
| GET    | /api/auth/me               | User    | Get current user         |
| GET    | /api/projects              | -       | List visible projects    |
| GET    | /api/projects/:slug        | -       | Get project by slug      |
| POST   | /api/projects              | Admin   | Create project           |
| PUT    | /api/projects/:id          | Admin   | Update project           |
| DELETE | /api/projects/:id          | Admin   | Delete project           |
| POST   | /api/projects/:id/images   | Admin   | Upload project images    |
| GET    | /api/users                 | Admin   | List all users           |
| PUT    | /api/users/:id             | Admin   | Update user role/status  |
| DELETE | /api/users/:id             | Admin   | Delete user              |
| PUT    | /api/users/profile         | User    | Update own profile       |
| GET    | /api/users/saved           | User    | Get saved projects       |
| POST   | /api/users/saved/:id       | User    | Toggle save project      |
| POST   | /api/messages              | -       | Send contact message     |
| GET    | /api/messages              | Admin   | List messages            |
| PUT    | /api/messages/:id/read     | Admin   | Mark as read             |
| DELETE | /api/messages/:id          | Admin   | Delete message           |
| POST   | /api/analytics/track       | -       | Track page visit         |
| GET    | /api/analytics             | Admin   | Get analytics summary    |

## Deployment

- **Frontend:** Vercel (Vite preset)
- **Backend:** Render (Web Service)
- **Database:** MongoDB Atlas

## License

MIT

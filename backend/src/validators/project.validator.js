import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  summary: z.string().min(10).max(300),
  description: z.string().min(10),
  problem: z.string().optional().default(''),
  solution: z.string().optional().default(''),
  architecture: z.string().optional().default(''),
  challenges: z.string().optional().default(''),
  category: z.enum(['full-stack', 'backend', 'machine-learning', 'it-systems']),
  techStack: z.array(z.string()).min(1),
  liveUrl: z.string().url().optional().or(z.literal('')).default(''),
  githubUrl: z.string().url().optional().or(z.literal('')).default(''),
  featured: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();

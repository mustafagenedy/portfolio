import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  summary: z.string().min(5, 'Summary must be at least 5 characters').max(300),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  problem: z.string().optional().default(''),
  solution: z.string().optional().default(''),
  architecture: z.string().optional().default(''),
  challenges: z.string().optional().default(''),
  category: z.enum(['full-stack', 'backend', 'machine-learning', 'it-systems']),
  techStack: z.array(z.string()).min(1, 'Add at least one technology'),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')).default(''),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')).default(''),
  featured: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();

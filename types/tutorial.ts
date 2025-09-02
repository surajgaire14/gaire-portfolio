import { z } from 'zod';

export const createTutorialSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  featured: z.boolean().optional(),
  authorId: z.string().min(1, 'Author ID is required'),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

export const updateTutorialSchema = createTutorialSchema.partial();

export const querySchema = z.object({
  category: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  featured: z.boolean().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export type CreateTutorialInput = z.infer<typeof createTutorialSchema>;
export type UpdateTutorialInput = z.infer<typeof updateTutorialSchema>;
export type QueryInput = z.infer<typeof querySchema>; 
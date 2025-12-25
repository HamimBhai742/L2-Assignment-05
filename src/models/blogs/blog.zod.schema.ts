import z from 'zod';

export const createBlogZodSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  author: z.string(),
  category: z.string(),
  image: z.string(),
  tags: z.array(z.string()),
});

export const updateBlogZodSchema = z.object({
  title: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
});



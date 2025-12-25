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

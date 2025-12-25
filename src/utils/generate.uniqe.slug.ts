import { Blog } from '../models/blogs/blog.model';

export const generateUniqueSlug = async (title: string) => {
  const baseSlug: string = title.toLowerCase().trim().split(' ').join('-');
  let counter = 0;
  let slug = baseSlug;
  while (await Blog.findOne({ slug })) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
  return slug;
};

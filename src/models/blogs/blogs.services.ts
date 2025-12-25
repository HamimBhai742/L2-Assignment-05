import { generateUniqueSlug } from '../../utils/generate.uniqe.slug';
import { QueryBuilder } from '../../utils/query.builder';
import { calculateReadTime } from '../../utils/readTime';
import { blogSearchField } from './blog.contain';
import { BlogPost } from './blog.interface';
import { Blog } from './blog.model';

const createBlog = async (payload: BlogPost) => {
  const slug = await generateUniqueSlug(payload.title);
  const readTime = calculateReadTime(payload.content);
  payload.slug = slug;
  payload.readTime = readTime;

  const blog = await Blog.create(payload);
  return blog;
};

const getAllBlogs = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Blog.find(), query);
  const blogs = await queryBuilder
    .filter()
    .search(blogSearchField)
    .pagination()
    .sort()
    .select()
    .build();
  return blogs;
};

const getSingleBlog = async (slug: string) => {
  const blog = await Blog.findOne({ slug });
  return blog;
};

export const blogServices = { createBlog, getAllBlogs, getSingleBlog };

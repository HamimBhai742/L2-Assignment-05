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
  console.log(payload);
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

const updateBlog = async (id: string, payload: BlogPost) => {
  console.log(payload)
  const readTime = calculateReadTime(payload.content);
  const slug = await generateUniqueSlug(payload.title);
  payload.slug = slug;
  payload.readTime = readTime;
  console.log(payload)
  const blog = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return blog;
};

const deleteBlog = async (id: string) => {
  const blog = await Blog.findByIdAndDelete(id);
  return blog;
};

export const blogServices = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};

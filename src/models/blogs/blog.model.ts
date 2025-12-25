import { model, Schema } from 'mongoose';
import { BlogPost } from './blog.interface';

const blogSchema = new Schema<BlogPost>(
  {
    title: { type: String, required: true },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: [true, 'Slug must be unique'],
    },
    excerpt: { type: String, required: [true, 'Excerpt is required'] },
    content: { type: String, required: [true, 'Content is required'] },
    author: { type: String, required: [true, 'Author is required'] },
    readTime: { type: String, required: [true, 'Read time is required'] },
    category: { type: String, required: [true, 'Category is required'] },
    image: { type: String, required: [true, 'Image is required'] },
    tags: { type: [String], required: [true, 'Tags are required'] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Blog = model('Blog', blogSchema);

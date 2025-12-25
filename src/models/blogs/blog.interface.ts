export interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  readTime?: string;
  category: string;
  image: string;
  tags: string[];
}

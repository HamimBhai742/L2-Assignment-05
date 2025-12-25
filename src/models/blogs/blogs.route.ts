import { Router } from 'express';
import { blogController } from './blogs.controller';
import { validationRequest } from '../../middlewares/zod.validation';
import { createBlogZodSchema, updateBlogZodSchema } from './blog.zod.schema';
import { checkAuth } from '../../middlewares/jwt.verify';
import { Role } from '../user/user.interface';
import { multerUpload } from '../../middlewares/muter.confog';

const router = Router();

router.post(
  '/create',
  checkAuth(Role.ADMIN),
  multerUpload.single('file'),
  validationRequest(createBlogZodSchema),
  blogController.createBlog
);
router.get('/all', blogController.getAllBlogs);
router.get('/:slug', blogController.getSingleBlog);
router.put(
  '/update/:id',
  // checkAuth(Role.ADMIN),
  multerUpload.single('file'),
  validationRequest(updateBlogZodSchema),
  blogController.updateBlog
);
router.delete('/delete/:id', checkAuth(Role.ADMIN), blogController.deleteBlog);

export const blogRoutes = router;

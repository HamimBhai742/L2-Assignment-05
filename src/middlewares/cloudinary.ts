import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { AppError } from '../error/coustom.error.handel';

cloudinary.config({
  cloud_name: env.CLOUDINARY_API_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const deleteCloudinaryImage = async (url: string) => {
  try {
    const match = url.match(/([^/]+\.(?:png|jpe?g|gif|webp))$/i);
    if (match && match[1]) {
      const publicId = match[1].replace(/\.(png|jpe?g|gif|webp)$/i, '');
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.log(error);
    throw new AppError('Cloudinary images delete failed', 500);
  }
};

export const cloudinaryUpload = cloudinary;

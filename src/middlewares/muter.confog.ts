import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/\./g, '-')
        // eslint-disable-next-line no-useless-escape
        .replace(/[^a-z0-9\-\.]/g, '');
      const extention = file.originalname.split('.').pop();
      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        '-' +
        Date.now() +
        '-' +
        fileName +
        '.' +
        extention;
      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage: storage });
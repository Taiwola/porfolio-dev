import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { extractPublicId, uploadToCloudinary } from '../utils/cloudinary';
import { AuthRequest } from '../middleware/auth.middleware';



const multerStorage = multer.memoryStorage(); // You need to import multer here or pass it



const multerUpload = multer({
  storage: multerStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  },
});

// Main middleware used in routes
export const uploadProfileFiles = [
  multerUpload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]),

  // Upload logic runs here (after multer parses files)
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const files = req.files as {
      avatar?: Express.Multer.File[];
      resume?: Express.Multer.File[];
    } | undefined;

    if (!files) return next();

    try {
      // Upload avatar if provided
      if (files.avatar?.[0]) {
        const result = await uploadToCloudinary(files.avatar[0], 'avatars');
        (req.body as any).avatar_url = result.secure_url;
        (req.body as any).oldAvatarPublicId = extractPublicId(req.user?.avatar_url || ''); // We'll set this in controller if needed
      }

      // Upload resume if provided
      if (files.resume?.[0]) {
        const result = await uploadToCloudinary(files.resume[0], 'resumes');
        (req.body as any).resume_url = result.secure_url;
        (req.body as any).oldResumePublicId = extractPublicId(req.user?.resume_url || '');
      }

      next();
    } catch (error: any) {
      next(error);
    }
  },
];
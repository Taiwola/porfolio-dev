declare namespace Express {
  interface Multer {
    File: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
  }

  interface Request {
    user?: {
      id: string;
      email: string;
      fullName: string;
      role: 'admin' | 'user';
      avatar_url?: string;
      resume_url?: string;
    };
    file?: Multer.File;
    files?: Multer.File[];
  }
}
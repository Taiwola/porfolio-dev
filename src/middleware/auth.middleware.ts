import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../config/token';
import { JwtPayload } from '../types';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: 'admin' | 'user';
    avatar_url?: string;
    resume_url?: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ message: 'Unauthorized' }); return; }
  try {
    const decoded = verifyAccessToken(token) as JwtPayload;
    req.user = { 
      id: decoded.id, 
      email: decoded.email, 
      fullName: decoded.fullName, 
      role: decoded.role,
    };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
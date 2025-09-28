import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { AuthRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = UserModel.findById(decoded.userId);
    
    if (!user) {
      console.error('User not found for userId:', decoded.userId);
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requireRole = (role: 'farmer' | 'customer') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: `${role} role required` });
    }

    next();
  };
};

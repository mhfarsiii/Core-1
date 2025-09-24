import { Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService';
import { AuthenticatedRequest, ApiResponse } from '../types/interfaces';
import { AuthenticationError } from '../types/errors';

export const authMiddleware = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Access denied. No valid token provided.');
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      throw new AuthenticationError('Access denied. No token provided.');
    }

    const adminService = new AdminService();
    const admin = await adminService.verifyToken(token);
    
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    let errorMessage = 'Invalid token';
    
    if (error instanceof AuthenticationError) {
      errorMessage = error.message;
    }
    
    const response: ApiResponse = {
      message: 'Authentication failed',
      error: errorMessage
    };
    
    res.status(401).json(response);
  }
};

// Optional middleware for routes that may or may not require authentication
export const optionalAuthMiddleware = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      
      if (token) {
        const adminService = new AdminService();
        const admin = await adminService.verifyToken(token);
        req.admin = admin;
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't fail if token is invalid
    // Just continue without setting req.admin
    next();
  }
}; 
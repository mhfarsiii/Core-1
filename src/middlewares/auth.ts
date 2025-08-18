import { Request, Response, NextFunction } from 'express'
import { AdminService } from '../services/adminService'

const adminService = new AdminService()

export interface AuthRequest extends Request {
  admin?: any
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' })
    }

    const admin = await adminService.verifyToken(token)
    req.admin = admin
    
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' })
  }
} 
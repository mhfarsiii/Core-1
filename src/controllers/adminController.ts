import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';
import { AuthenticatedRequest, ApiResponse, AdminProfile } from '../types/interfaces';
import {
  ValidationError,
  AuthenticationError,
  DatabaseError,
  NotFoundError
} from '../types/errors';

export class AdminController {
  private adminService: AdminService;

  constructor(adminService?: AdminService) {
    this.adminService = adminService || new AdminService();
  }
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      
      const result = await this.adminService.login({ username, password });
      
      const response: ApiResponse = {
        message: 'Login successful',
        data: result
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async createAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, email } = req.body;
      
      const admin = await this.adminService.createAdmin({ username, password, email });
      
      const response: ApiResponse = {
        message: 'Admin created successfully',
        data: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          createdAt: admin.createdAt
        }
      };
      
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Admin profile is already available from auth middleware
      const admin = req.admin;
      
      if (!admin) {
        throw new AuthenticationError('No authenticated admin found');
      }
      
      const response: ApiResponse<AdminProfile> = {
        message: 'Profile retrieved successfully',
        data: admin
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // ========================
  // User Management Methods
  // ========================

  async getUserStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.admin) {
        throw new AuthenticationError('Admin authentication required');
      }

      const stats = await this.adminService.getUserStats();
      
      const response: ApiResponse = {
        message: 'User statistics retrieved successfully',
        data: stats
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getAllUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.admin) {
        throw new AuthenticationError('Admin authentication required');
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (page < 1 || limit < 1 || limit > 100) {
        throw new ValidationError('Invalid pagination parameters');
      }

      const result = await this.adminService.getAllUsers(page, limit);
      
      const response: ApiResponse = {
        message: 'Users retrieved successfully',
        data: result.users,
        meta: result.meta
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getUserById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.admin) {
        throw new AuthenticationError('Admin authentication required');
      }

      const { id } = req.params;
      
      if (!id) {
        throw new ValidationError('User ID is required');
      }

      const user = await this.adminService.getUserById(id);
      
      if (!user) {
        throw new NotFoundError('User not found');
      }
      
      const response: ApiResponse = {
        message: 'User retrieved successfully',
        data: user
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deactivateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.admin) {
        throw new AuthenticationError('Admin authentication required');
      }

      const { id } = req.params;
      
      if (!id) {
        throw new ValidationError('User ID is required');
      }

      await this.adminService.deactivateUser(id);
      
      const response: ApiResponse = {
        message: 'User deactivated successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async activateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.admin) {
        throw new AuthenticationError('Admin authentication required');
      }

      const { id } = req.params;
      
      if (!id) {
        throw new ValidationError('User ID is required');
      }

      await this.adminService.activateUser(id);
      
      const response: ApiResponse = {
        message: 'User activated successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    console.error('Controller error:', error);
    
    if (error instanceof ValidationError) {
      const response: ApiResponse = {
        message: 'Validation failed',
        error: error.message
      };
      res.status(400).json(response);
      return;
    }
    
    if (error instanceof AuthenticationError) {
      const response: ApiResponse = {
        message: 'Authentication failed',
        error: error.message
      };
      res.status(401).json(response);
      return;
    }
    
    if (error instanceof NotFoundError) {
      const response: ApiResponse = {
        message: 'Resource not found',
        error: error.message
      };
      res.status(404).json(response);
      return;
    }
    
    if (error instanceof DatabaseError) {
      const response: ApiResponse = {
        message: 'Database operation failed',
        error: 'An internal error occurred'
      };
      res.status(500).json(response);
      return;
    }
    
    // Unknown error
    const response: ApiResponse = {
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    };
    res.status(500).json(response);
  }
} 
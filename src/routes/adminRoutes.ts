import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { AdminService } from '../services/adminService';
import { authMiddleware } from '../middlewares/auth';
import { ApiResponse } from '../types/interfaces';

const router = Router();
const adminService = new AdminService();
const adminController = new AdminController(adminService);

// Public routes
router.get('/', (req, res) => {
  const response: ApiResponse = {
    message: 'Admin API is running',
    data: {
      endpoints: {
        'POST /login': 'Login to admin panel',
        'POST /create-admin': 'Create admin account (development only)',
        'GET /profile': 'Get admin profile (requires authentication)',
        'GET /users/stats': 'Get user statistics (requires authentication)',
        'GET /users': 'Get all users with pagination (requires authentication)',
        'GET /users/:id': 'Get user by ID (requires authentication)',
        'PUT /users/:id/deactivate': 'Deactivate user (requires authentication)',
        'PUT /users/:id/activate': 'Activate user (requires authentication)'
      },
      version: '1.0.0',
      status: 'active'
    }
  };
  res.status(200).json(response);
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    await adminController.login(req, res);
  } catch (error) {
    console.error('Route handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        message: 'Route handler error',
        error: (error as Error).message
      });
    }
  }
});

// Development endpoint to create admin user (should be disabled in production)
router.post('/create-admin', async (req, res) => {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    const response: ApiResponse = {
      message: 'Access denied',
      error: 'Admin creation is disabled in production'
    };
    return res.status(403).json(response);
  }
  
  try {
    await adminController.createAdmin(req, res);
  } catch (error) {
    console.error('Route handler error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    });
  }
});

// Protected routes
router.get('/profile', authMiddleware, async (req: any, res) => {
  try {
    await adminController.getProfile(req, res);
  } catch (error) {
    console.error('Route handler error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    });
  }
});

// ========================
// User Management Routes
// ========================

/**
 * @route GET /api/admin/users/stats
 * @desc Get user statistics for dashboard
 * @access Private (Admin only)
 */
router.get('/users/stats', authMiddleware, async (req: any, res) => {
  try {
    await adminController.getUserStats(req, res);
  } catch (error) {
    console.error('Route handler error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    });
  }
});

/**
 * @route GET /api/admin/users
 * @desc Get all users with pagination
 * @access Private (Admin only)
 * @query page - Page number (default: 1)
 * @query limit - Items per page (default: 20, max: 100)
 */
router.get('/users', authMiddleware, async (req: any, res) => {
  try {
    await adminController.getAllUsers(req, res);
  } catch (error) {
    console.error('Route handler error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    });
  }
});

/**
 * @route GET /api/admin/users/:id
 * @desc Get user by ID
 * @access Private (Admin only)
 * @param id - User ID
 */
router.get('/users/:id', authMiddleware, async (req: any, res) => {
  try {
    await adminController.getUserById(req, res);
  } catch (error) {
    console.error('Route handler error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    });
  }
});

/**
 * @route PUT /api/admin/users/:id/deactivate
 * @desc Deactivate user account
 * @access Private (Admin only)
 * @param id - User ID
 */
router.put('/users/:id/deactivate', authMiddleware, async (req: any, res) => {
  try {
    await adminController.deactivateUser(req, res);
  } catch (error) {
    console.error('Route handler error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    });
  }
});

/**
 * @route PUT /api/admin/users/:id/activate
 * @desc Activate user account
 * @access Private (Admin only)
 * @param id - User ID
 */
router.put('/users/:id/activate', authMiddleware, async (req: any, res) => {
  try {
    await adminController.activateUser(req, res);
  } catch (error) {
    console.error('Route handler error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    });
  }
});

export default router; 
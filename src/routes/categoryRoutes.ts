import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { CategoryService } from '../services/categoryService';
import { authMiddleware } from '../middlewares/auth';
import { uploadSingle } from '../middlewares/upload';
import { ApiResponse } from '../types/interfaces';

const router = Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

// API info endpoint (public)
router.get('/info', (req, res) => {
  const response: ApiResponse = {
    message: 'Category API endpoints',
    data: {
      endpoints: {
        'POST /': 'Create category (requires auth + image upload)',
        'GET /': 'Get all categories (requires auth)',
        'GET /:id': 'Get category by ID (requires auth)',
        'PUT /:id': 'Update category (requires auth + optional image upload)',
        'DELETE /:id': 'Delete category (requires auth)'
      },
      version: '1.0.0',
      authentication: 'Bearer token required for all endpoints except /info'
    }
  };
  res.status(200).json(response);
});

// All routes below require authentication
router.use(authMiddleware);

// Create new category (POST)
router.post('/', uploadSingle('image'), (req, res) => categoryController.createCategory(req, res));

// Get all categories (GET)
router.get('/', (req, res) => categoryController.getAllCategories(req, res));

// Get category by ID (GET)
router.get('/:id', (req, res) => categoryController.getCategoryById(req, res));

// Update category (PUT)
router.put('/:id', uploadSingle('image'), (req, res) => categoryController.updateCategory(req, res));

// Delete category (DELETE)
router.delete('/:id', (req, res) => categoryController.deleteCategory(req, res));

export default router;

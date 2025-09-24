import { Router } from 'express';
import { WorkController } from '../controllers/workController';
import { WorkService } from '../services/workService';
import { authMiddleware } from '../middlewares/auth';
import { uploadFields } from '../middlewares/upload';
import { ApiResponse } from '../types/interfaces';

const router = Router();
const workService = new WorkService();
const workController = new WorkController(workService);

// API info endpoint (public)
router.get('/info', (req, res) => {
  const response: ApiResponse = {
    message: 'Work API endpoints',
    data: {
      endpoints: {
        'POST /': 'Create work (requires auth + file uploads)',
        'GET /': 'Get all works (requires auth)',
        'GET /:id': 'Get work by ID (requires auth)',
        'GET /category/:categoryId': 'Get works by category (requires auth)',
        'PUT /:id': 'Update work (requires auth + optional file uploads)',
        'DELETE /:id': 'Delete work (requires auth)'
      },
      fileUpload: {
        mainImage: 'Required for creation, optional for update (max 1 file)',
        additionalImages: 'Optional (max 10 files)',
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maxFileSize: '10MB per file'
      },
      version: '1.0.0',
      authentication: 'Bearer token required for all endpoints except /info'
    }
  };
  res.status(200).json(response);
});

// All routes below require authentication
router.use(authMiddleware as any);

// Create new work (POST)
router.post('/', uploadFields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]), (req: any, res) => workController.createWork(req, res));

// Get all works (GET)
router.get('/', (req, res) => workController.getAllWorks(req, res));

// Get work by ID (GET)
router.get('/:id', (req, res) => workController.getWorkById(req, res));

// Get works by category (GET)
router.get('/category/:categoryId', (req, res) => workController.getWorksByCategory(req, res));

// Update work (PUT)
router.put('/:id', uploadFields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]), (req: any, res) => workController.updateWork(req, res));

// Delete work (DELETE)
router.delete('/:id', (req, res) => workController.deleteWork(req, res));

export default router;

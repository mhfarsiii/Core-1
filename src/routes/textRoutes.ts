import { Router } from 'express';
import { TextController } from '../controllers/textController';
import { TextService } from '../services/textService';
import { authMiddleware } from '../middlewares/auth';
import { ApiResponse } from '../types/interfaces';

const router = Router();
const textService = new TextService();
const textController = new TextController(textService);

// API info endpoint (public)
router.get('/info', (req, res) => {
  const response: ApiResponse = {
    message: 'Text API endpoints',
    data: {
      endpoints: {
        'GET /published': 'Get published texts (public)',
        'GET /:id': 'Get text by ID (public)',
        'POST /': 'Create text (requires auth)',
        'GET /': 'Get all texts (requires auth)',
        'PUT /:id': 'Update text (requires auth)',
        'DELETE /:id': 'Delete text (requires auth)',
        'PATCH /:id/publish': 'Publish text (requires auth)',
        'PATCH /:id/unpublish': 'Unpublish text (requires auth)'
      },
      version: '1.0.0',
      authentication: 'Bearer token required for admin endpoints'
    }
  };
  res.status(200).json(response);
});

// Public routes (for frontend display)
router.get('/published', (req, res) => {
  // Get published texts using query parameter
  req.query.published = 'true';
  textController.getAllTexts(req, res);
});

router.get('/:id', (req, res) => textController.getTextById(req, res));

// Protected routes (admin only)
router.use(authMiddleware as any);

router.post('/', (req, res) => textController.createText(req, res));
router.get('/', (req, res) => textController.getAllTexts(req, res));
router.put('/:id', (req, res) => textController.updateText(req, res));
router.delete('/:id', (req, res) => textController.deleteText(req, res));
router.patch('/:id/publish', (req, res) => textController.publishText(req, res));
router.patch('/:id/unpublish', (req, res) => textController.unpublishText(req, res));

export default router; 
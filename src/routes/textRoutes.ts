import { Router } from 'express'
import { TextController } from '../controllers/textController'
import { authMiddleware } from '../middlewares/auth'

const router = Router()
const textController = new TextController()

// Public routes (for frontend display)
router.get('/published', textController.getPublishedTexts)
router.get('/category/:category', textController.getTextsByCategory)
router.get('/:id', textController.getTextById)

// Protected routes (admin only)
router.post('/', authMiddleware, textController.createText)
router.get('/', authMiddleware, textController.getAllTexts)
router.put('/:id', authMiddleware, textController.updateText)
router.delete('/:id', authMiddleware, textController.deleteText)
router.patch('/:id/toggle-publish', authMiddleware, textController.togglePublish)

export default router 
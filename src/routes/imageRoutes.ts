import { Router } from 'express'
import { ImageController } from '../controllers/imageController'
import { upload } from '../middlewares/upload'
import { authMiddleware } from '../middlewares/auth'

const router = Router()
const imageController = new ImageController()

// Public routes (for frontend display)
router.get('/', imageController.getAllImages)
router.get('/category/:category', imageController.getImagesByCategory)
router.get('/:id', imageController.getImageById)

// Protected routes (admin only)
router.post('/', authMiddleware, upload.single('image'), imageController.uploadImage)
router.put('/:id', authMiddleware, imageController.updateImage)
router.delete('/:id', authMiddleware, imageController.deleteImage)

export default router 
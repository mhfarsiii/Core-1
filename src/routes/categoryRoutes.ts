import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();
const categoryController = new CategoryController();

// همه مسیرها نیاز به احراز هویت دارند
router.use(authMiddleware);

// ایجاد دسته‌بندی جدید (POST)
router.post('/', upload.single('image'), categoryController.createCategory);

// دریافت همه دسته‌بندی‌ها (GET)
router.get('/', categoryController.getAllCategories);

// دریافت دسته‌بندی با شناسه (GET)
router.get('/:id', categoryController.getCategoryById);

// به‌روزرسانی دسته‌بندی (PUT)
router.put('/:id', upload.single('image'), categoryController.updateCategory);

// حذف دسته‌بندی (DELETE)
router.delete('/:id', categoryController.deleteCategory);

export default router;

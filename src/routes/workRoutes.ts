import { Router } from 'express';
import { WorkController } from '../controllers/workController';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();
const workController = new WorkController();

// همه مسیرها نیاز به احراز هویت دارند
router.use(authMiddleware);

// ایجاد کار جدید (POST)
router.post('/', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]), workController.createWork);

// دریافت همه کارها (GET)
router.get('/', workController.getAllWorks);

// دریافت کار با شناسه (GET)
router.get('/:id', workController.getWorkById);

// دریافت کارها بر اساس دسته‌بندی (GET)
router.get('/category/:categoryId', workController.getWorksByCategory);

// به‌روزرسانی کار (PUT)
router.put('/:id', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]), workController.updateWork);

// حذف کار (DELETE)
router.delete('/:id', workController.deleteWork);

export default router;

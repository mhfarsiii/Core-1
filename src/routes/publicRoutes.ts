import { Router } from 'express';
import { CategoryService } from '../services/categoryService';
import { WorkService } from '../services/workService';

const router = Router();
const categoryService = new CategoryService();
const workService = new WorkService();

// دریافت همه دسته‌بندی‌ها برای نمایش در وب‌سایت (GET)
router.get('/categories', async (req, res) => {
  try {
    const result = await categoryService.getAllCategories();
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('خطا در دریافت دسته‌بندی‌ها:', error);
    res.status(500).json({
      success: false,
      error: 'خطای داخلی سرور'
    });
  }
});

// دریافت کارها بر اساس دسته‌بندی برای نمایش در وب‌سایت (GET)
router.get('/categories/:categoryId/works', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const parsedCategoryId = parseInt(categoryId);
    
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({
        success: false,
        error: 'شناسه دسته‌بندی نامعتبر است'
      });
    }

    const result = await workService.getWorksByCategory(parsedCategoryId);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('خطا در دریافت کارها:', error);
    res.status(500).json({
      success: false,
      error: 'خطای داخلی سرور'
    });
  }
});

// دریافت جزئیات کار برای نمایش در وب‌سایت (GET)
router.get('/works/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workId = parseInt(id);
    
    if (isNaN(workId)) {
      return res.status(400).json({
        success: false,
        error: 'شناسه کار نامعتبر است'
      });
    }

    const result = await workService.getWorkById(workId);
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    // دریافت کارهای مشابه
    const similarWorksResult = await workService.getSimilarWorks(workId, 4);
    const similarWorks = similarWorksResult.success ? similarWorksResult.data : [];

    res.json({
      ...result,
      similarWorks
    });
  } catch (error) {
    console.error('خطا در دریافت کار:', error);
    res.status(500).json({
      success: false,
      error: 'خطای داخلی سرور'
    });
  }
});

// دریافت همه کارها برای نمایش در وب‌سایت (GET)
router.get('/works', async (req, res) => {
  try {
    const result = await workService.getAllWorks();
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('خطا در دریافت کارها:', error);
    res.status(500).json({
      success: false,
      error: 'خطای داخلی سرور'
    });
  }
});

export default router;

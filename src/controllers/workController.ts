import { Request, Response } from 'express';
import { WorkService } from '../services/workService';

const workService = new WorkService();

// Extend Request interface to include files
interface RequestWithFiles extends Request {
  files?: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[];
}

export class WorkController {
  // ایجاد کار جدید (POST)
  async createWork(req: RequestWithFiles, res: Response) {
    try {
      const { title, description, categoryId, videoLink } = req.body;
      
      if (!title || !categoryId) {
        return res.status(400).json({
          success: false,
          error: 'عنوان کار و شناسه دسته‌بندی الزامی است'
        });
      }

      const parsedCategoryId = parseInt(categoryId);
      if (isNaN(parsedCategoryId)) {
        return res.status(400).json({
          success: false,
          error: 'شناسه دسته‌بندی نامعتبر است'
        });
      }

      // دریافت فایل‌های آپلود شده
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const mainImage = files?.['mainImage']?.[0];
      const additionalImages = files?.['additionalImages'] || [];

      if (!mainImage) {
        return res.status(400).json({
          success: false,
          error: 'تصویر اصلی کار الزامی است'
        });
      }

      const mainImageUrl = `/uploads/${mainImage.filename}`;
      const additionalImageUrls = additionalImages?.map(img => `/uploads/${img.filename}`) || [];

      const result = await workService.createWork({
        title,
        description,
        mainImageUrl,
        additionalImages: additionalImageUrls,
        videoLink,
        categoryId: parsedCategoryId
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error('خطا در ایجاد کار:', error);
      res.status(500).json({
        success: false,
        error: 'خطای داخلی سرور'
      });
    }
  }

  // دریافت همه کارها (GET - برای پنل ادمین)
  async getAllWorks(req: Request, res: Response) {
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
  }

  // دریافت کار با شناسه (GET - برای پنل ادمین)
  async getWorkById(req: Request, res: Response) {
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

      res.json(result);
    } catch (error) {
      console.error('خطا در دریافت کار:', error);
      res.status(500).json({
        success: false,
        error: 'خطای داخلی سرور'
      });
    }
  }

  // دریافت کارها بر اساس دسته‌بندی (GET - برای پنل ادمین)
  async getWorksByCategory(req: Request, res: Response) {
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
  }

  // به‌روزرسانی کار (PUT)
  async updateWork(req: RequestWithFiles, res: Response) {
    try {
      const { id } = req.params;
      const workId = parseInt(id);
      
      if (isNaN(workId)) {
        return res.status(400).json({
          success: false,
          error: 'شناسه کار نامعتبر است'
        });
      }

      const { title, description, categoryId, videoLink } = req.body;
      
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (videoLink !== undefined) updateData.videoLink = videoLink;
      
      if (categoryId !== undefined) {
        const parsedCategoryId = parseInt(categoryId);
        if (isNaN(parsedCategoryId)) {
          return res.status(400).json({
            success: false,
            error: 'شناسه دسته‌بندی نامعتبر است'
          });
        }
        updateData.categoryId = parsedCategoryId;
      }

      // دریافت فایل‌های آپلود شده
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const mainImage = files?.['mainImage']?.[0];
      const additionalImages = files?.['additionalImages'] || [];

      if (mainImage) {
        updateData.mainImageUrl = `/uploads/${mainImage.filename}`;
      }

      if (additionalImages && additionalImages.length > 0) {
        updateData.additionalImages = additionalImages.map(img => `/uploads/${img.filename}`);
      }

      const result = await workService.updateWork(workId, updateData);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('خطا در به‌روزرسانی کار:', error);
      res.status(500).json({
        success: false,
        error: 'خطای داخلی سرور'
      });
    }
  }

  // حذف کار (DELETE)
  async deleteWork(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const workId = parseInt(id);
      
      if (isNaN(workId)) {
        return res.status(400).json({
          success: false,
          error: 'شناسه کار نامعتبر است'
        });
      }

      const result = await workService.deleteWork(workId);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('خطا در حذف کار:', error);
      res.status(500).json({
        success: false,
        error: 'خطای داخلی سرور'
      });
    }
  }
}

import prisma from './prisma';

export interface CreateWorkData {
  title: string;
  description?: string;
  mainImageUrl: string;
  additionalImages?: string[];
  videoLink?: string;
  categoryId: number;
}

export interface UpdateWorkData {
  title?: string;
  description?: string;
  mainImageUrl?: string;
  additionalImages?: string[];
  videoLink?: string;
  categoryId?: number;
}

export class WorkService {
  // ایجاد کار جدید
  async createWork(data: CreateWorkData) {
    try {
      // بررسی وجود دسته‌بندی
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId }
      });

      if (!category) {
        return { success: false, error: 'دسته‌بندی یافت نشد' };
      }

      const work = await prisma.work.create({
        data: {
          title: data.title,
          description: data.description,
          mainImageUrl: data.mainImageUrl,
          additionalImages: data.additionalImages || [],
          videoLink: data.videoLink,
          categoryId: data.categoryId,
        },
        include: {
          category: true
        }
      });
      
      return { success: true, data: work };
    } catch (error) {
      return { success: false, error: 'خطا در ایجاد کار' };
    }
  }

  // دریافت همه کارها
  async getAllWorks() {
    try {
      const works = await prisma.work.findMany({
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return { success: true, data: works };
    } catch (error) {
      return { success: false, error: 'خطا در دریافت کارها' };
    }
  }

  // دریافت کار با شناسه
  async getWorkById(id: number) {
    try {
      const work = await prisma.work.findUnique({
        where: { id },
        include: {
          category: true
        }
      });
      
      if (!work) {
        return { success: false, error: 'کار یافت نشد' };
      }
      
      return { success: true, data: work };
    } catch (error) {
      return { success: false, error: 'خطا در دریافت کار' };
    }
  }

  // دریافت کارها بر اساس دسته‌بندی
  async getWorksByCategory(categoryId: number) {
    try {
      const works = await prisma.work.findMany({
        where: { categoryId },
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return { success: true, data: works };
    } catch (error) {
      return { success: false, error: 'خطا در دریافت کارها' };
    }
  }

  // دریافت کارهای مشابه (همان دسته‌بندی)
  async getSimilarWorks(workId: number, limit: number = 4) {
    try {
      const currentWork = await prisma.work.findUnique({
        where: { id: workId },
        select: { categoryId: true }
      });

      if (!currentWork) {
        return { success: false, error: 'کار یافت نشد' };
      }

      const similarWorks = await prisma.work.findMany({
        where: {
          categoryId: currentWork.categoryId,
          id: { not: workId }
        },
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
      
      return { success: true, data: similarWorks };
    } catch (error) {
      return { success: false, error: 'خطا در دریافت کارهای مشابه' };
    }
  }

  // به‌روزرسانی کار
  async updateWork(id: number, data: UpdateWorkData) {
    try {
      if (data.categoryId) {
        // بررسی وجود دسته‌بندی جدید
        const category = await prisma.category.findUnique({
          where: { id: data.categoryId }
        });

        if (!category) {
          return { success: false, error: 'دسته‌بندی یافت نشد' };
        }
      }

      // Only update fields that are provided
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.mainImageUrl !== undefined) updateData.mainImageUrl = data.mainImageUrl;
      if (data.additionalImages !== undefined) updateData.additionalImages = data.additionalImages;
      if (data.videoLink !== undefined) updateData.videoLink = data.videoLink;
      if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

      const work = await prisma.work.update({
        where: { id },
        data: updateData,
        include: {
          category: true
        }
      });
      
      return { success: true, data: work };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return { success: false, error: 'کار یافت نشد' };
      }
      return { success: false, error: 'خطا در به‌روزرسانی کار' };
    }
  }

  // حذف کار
  async deleteWork(id: number) {
    try {
      await prisma.work.delete({
        where: { id },
      });
      return { success: true, message: 'کار با موفقیت حذف شد' };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return { success: false, error: 'کار یافت نشد' };
      }
      return { success: false, error: 'خطا در حذف کار' };
    }
  }
}

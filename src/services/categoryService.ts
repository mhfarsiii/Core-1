import prisma from './prisma';

export interface CreateCategoryData {
  title: string;
  imageUrl?: string;
  description?: string;
}

export interface UpdateCategoryData {
  title?: string;
  imageUrl?: string;
  description?: string;
}

export class CategoryService {
  // ایجاد دسته‌بندی جدید
  async createCategory(data: CreateCategoryData) {
    try {
      const category = await prisma.category.create({
        data: {
          title: data.title,
          imageUrl: data.imageUrl,
          description: data.description,
        },
      });
      return { success: true, data: category };
    } catch (error: any) {
      if (error.code === 'P2002') {
        return { success: false, error: 'دسته‌بندی با این عنوان قبلاً وجود دارد' };
      }
      return { success: false, error: 'خطا در ایجاد دسته‌بندی' };
    }
  }

  // دریافت همه دسته‌بندی‌ها
  async getAllCategories() {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { works: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return { success: true, data: categories };
    } catch (error) {
      return { success: false, error: 'خطا در دریافت دسته‌بندی‌ها' };
    }
  }

  // دریافت دسته‌بندی با شناسه
  async getCategoryById(id: number) {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          works: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      
      if (!category) {
        return { success: false, error: 'دسته‌بندی یافت نشد' };
      }
      
      return { success: true, data: category };
    } catch (error) {
      return { success: false, error: 'خطا در دریافت دسته‌بندی' };
    }
  }

  // به‌روزرسانی دسته‌بندی
  async updateCategory(id: number, data: UpdateCategoryData) {
    try {
      // First, get the current category to check if title is actually changing
      const currentCategory = await prisma.category.findUnique({
        where: { id }
      });

      if (!currentCategory) {
        return { success: false, error: 'دسته‌بندی یافت نشد' };
      }

      // Only update fields that are provided
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
      if (data.description !== undefined) updateData.description = data.description;

      // If title is being changed, check if the new title already exists (excluding current record)
      if (data.title !== undefined && data.title !== currentCategory.title) {
        const existingCategory = await prisma.category.findFirst({
          where: {
            title: data.title,
            id: { not: id }
          }
        });

        if (existingCategory) {
          return { success: false, error: 'دسته‌بندی با این عنوان قبلاً وجود دارد' };
        }
      }

      const category = await prisma.category.update({
        where: { id },
        data: updateData,
      });
      return { success: true, data: category };
    } catch (error: any) {
      console.error('Error in updateCategory:', error);
      if (error.code === 'P2025') {
        return { success: false, error: 'دسته‌بندی یافت نشد' };
      }
      return { success: false, error: 'خطا در به‌روزرسانی دسته‌بندی: ' + error.message };
    }
  }

  // حذف دسته‌بندی
  async deleteCategory(id: number) {
    try {
      await prisma.category.delete({
        where: { id },
      });
      return { success: true, message: 'دسته‌بندی با موفقیت حذف شد' };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return { success: false, error: 'دسته‌بندی یافت نشد' };
      }
      return { success: false, error: 'خطا در حذف دسته‌بندی' };
    }
  }
}

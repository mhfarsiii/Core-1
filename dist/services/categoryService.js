"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const prisma_1 = __importDefault(require("./prisma"));
class CategoryService {
    // ایجاد دسته‌بندی جدید
    async createCategory(data) {
        try {
            const category = await prisma_1.default.category.create({
                data: {
                    title: data.title,
                    imageUrl: data.imageUrl,
                    description: data.description,
                },
            });
            return { success: true, data: category };
        }
        catch (error) {
            if (error.code === 'P2002') {
                return { success: false, error: 'دسته‌بندی با این عنوان قبلاً وجود دارد' };
            }
            return { success: false, error: 'خطا در ایجاد دسته‌بندی' };
        }
    }
    // دریافت همه دسته‌بندی‌ها
    async getAllCategories() {
        try {
            const categories = await prisma_1.default.category.findMany({
                include: {
                    _count: {
                        select: { works: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return { success: true, data: categories };
        }
        catch (error) {
            return { success: false, error: 'خطا در دریافت دسته‌بندی‌ها' };
        }
    }
    // دریافت دسته‌بندی با شناسه
    async getCategoryById(id) {
        try {
            const category = await prisma_1.default.category.findUnique({
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
        }
        catch (error) {
            return { success: false, error: 'خطا در دریافت دسته‌بندی' };
        }
    }
    // به‌روزرسانی دسته‌بندی
    async updateCategory(id, data) {
        try {
            // First, get the current category to check if title is actually changing
            const currentCategory = await prisma_1.default.category.findUnique({
                where: { id }
            });
            if (!currentCategory) {
                return { success: false, error: 'دسته‌بندی یافت نشد' };
            }
            // Only update fields that are provided
            const updateData = {};
            if (data.title !== undefined)
                updateData.title = data.title;
            if (data.imageUrl !== undefined)
                updateData.imageUrl = data.imageUrl;
            if (data.description !== undefined)
                updateData.description = data.description;
            // If title is being changed, check if the new title already exists (excluding current record)
            if (data.title !== undefined && data.title !== currentCategory.title) {
                const existingCategory = await prisma_1.default.category.findFirst({
                    where: {
                        title: data.title,
                        id: { not: id }
                    }
                });
                if (existingCategory) {
                    return { success: false, error: 'دسته‌بندی با این عنوان قبلاً وجود دارد' };
                }
            }
            const category = await prisma_1.default.category.update({
                where: { id },
                data: updateData,
            });
            return { success: true, data: category };
        }
        catch (error) {
            console.error('Error in updateCategory:', error);
            if (error.code === 'P2025') {
                return { success: false, error: 'دسته‌بندی یافت نشد' };
            }
            return { success: false, error: 'خطا در به‌روزرسانی دسته‌بندی: ' + error.message };
        }
    }
    // حذف دسته‌بندی
    async deleteCategory(id) {
        try {
            await prisma_1.default.category.delete({
                where: { id },
            });
            return { success: true, message: 'دسته‌بندی با موفقیت حذف شد' };
        }
        catch (error) {
            if (error.code === 'P2025') {
                return { success: false, error: 'دسته‌بندی یافت نشد' };
            }
            return { success: false, error: 'خطا در حذف دسته‌بندی' };
        }
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=categoryService.js.map
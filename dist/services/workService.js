"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkService = void 0;
const prisma_1 = __importDefault(require("./prisma"));
class WorkService {
    // ایجاد کار جدید
    async createWork(data) {
        try {
            // بررسی وجود دسته‌بندی
            const category = await prisma_1.default.category.findUnique({
                where: { id: data.categoryId }
            });
            if (!category) {
                return { success: false, error: 'دسته‌بندی یافت نشد' };
            }
            const work = await prisma_1.default.work.create({
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
        }
        catch (error) {
            return { success: false, error: 'خطا در ایجاد کار' };
        }
    }
    // دریافت همه کارها
    async getAllWorks() {
        try {
            const works = await prisma_1.default.work.findMany({
                include: {
                    category: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return { success: true, data: works };
        }
        catch (error) {
            return { success: false, error: 'خطا در دریافت کارها' };
        }
    }
    // دریافت کار با شناسه
    async getWorkById(id) {
        try {
            const work = await prisma_1.default.work.findUnique({
                where: { id },
                include: {
                    category: true
                }
            });
            if (!work) {
                return { success: false, error: 'کار یافت نشد' };
            }
            return { success: true, data: work };
        }
        catch (error) {
            return { success: false, error: 'خطا در دریافت کار' };
        }
    }
    // دریافت کارها بر اساس دسته‌بندی
    async getWorksByCategory(categoryId) {
        try {
            const works = await prisma_1.default.work.findMany({
                where: { categoryId },
                include: {
                    category: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return { success: true, data: works };
        }
        catch (error) {
            return { success: false, error: 'خطا در دریافت کارها' };
        }
    }
    // دریافت کارهای مشابه (همان دسته‌بندی)
    async getSimilarWorks(workId, limit = 4) {
        try {
            const currentWork = await prisma_1.default.work.findUnique({
                where: { id: workId },
                select: { categoryId: true }
            });
            if (!currentWork) {
                return { success: false, error: 'کار یافت نشد' };
            }
            const similarWorks = await prisma_1.default.work.findMany({
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
        }
        catch (error) {
            return { success: false, error: 'خطا در دریافت کارهای مشابه' };
        }
    }
    // به‌روزرسانی کار
    async updateWork(id, data) {
        try {
            if (data.categoryId) {
                // بررسی وجود دسته‌بندی جدید
                const category = await prisma_1.default.category.findUnique({
                    where: { id: data.categoryId }
                });
                if (!category) {
                    return { success: false, error: 'دسته‌بندی یافت نشد' };
                }
            }
            // Only update fields that are provided
            const updateData = {};
            if (data.title !== undefined)
                updateData.title = data.title;
            if (data.description !== undefined)
                updateData.description = data.description;
            if (data.mainImageUrl !== undefined)
                updateData.mainImageUrl = data.mainImageUrl;
            if (data.additionalImages !== undefined)
                updateData.additionalImages = data.additionalImages;
            if (data.videoLink !== undefined)
                updateData.videoLink = data.videoLink;
            if (data.categoryId !== undefined)
                updateData.categoryId = data.categoryId;
            const work = await prisma_1.default.work.update({
                where: { id },
                data: updateData,
                include: {
                    category: true
                }
            });
            return { success: true, data: work };
        }
        catch (error) {
            if (error.code === 'P2025') {
                return { success: false, error: 'کار یافت نشد' };
            }
            return { success: false, error: 'خطا در به‌روزرسانی کار' };
        }
    }
    // حذف کار
    async deleteWork(id) {
        try {
            await prisma_1.default.work.delete({
                where: { id },
            });
            return { success: true, message: 'کار با موفقیت حذف شد' };
        }
        catch (error) {
            if (error.code === 'P2025') {
                return { success: false, error: 'کار یافت نشد' };
            }
            return { success: false, error: 'خطا در حذف کار' };
        }
    }
}
exports.WorkService = WorkService;
//# sourceMappingURL=workService.js.map
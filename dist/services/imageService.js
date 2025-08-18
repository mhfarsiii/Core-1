"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const prisma_1 = __importDefault(require("./prisma"));
class ImageService {
    async createImage(data) {
        try {
            const image = await prisma_1.default.image.create({
                data
            });
            return { success: true, data: image };
        }
        catch (error) {
            return { success: false, error: 'خطا در ایجاد تصویر' };
        }
    }
    async getAllImages() {
        try {
            const images = await prisma_1.default.image.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return { success: true, data: images };
        }
        catch (error) {
            return { success: false, error: 'خطا در دریافت تصاویر' };
        }
    }
    async getImagesByCategory(category) {
        try {
            const images = await prisma_1.default.image.findMany({
                where: { category },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return { success: true, data: images };
        }
        catch (error) {
            return { success: false, error: 'خطا در دریافت تصاویر' };
        }
    }
    async updateImage(id, data) {
        try {
            const image = await prisma_1.default.image.update({
                where: { id },
                data
            });
            return { success: true, data: image };
        }
        catch (error) {
            return { success: false, error: 'خطا در به‌روزرسانی تصویر' };
        }
    }
    async deleteImage(id) {
        try {
            await prisma_1.default.image.delete({
                where: { id }
            });
            return { success: true, message: 'تصویر با موفقیت حذف شد' };
        }
        catch (error) {
            return { success: false, error: 'خطا در حذف تصویر' };
        }
    }
    async getImageById(id) {
        try {
            const image = await prisma_1.default.image.findUnique({
                where: { id }
            });
            if (!image) {
                return { success: false, error: 'تصویر یافت نشد' };
            }
            return { success: true, data: image };
        }
        catch (error) {
            return { success: false, error: 'خطا در دریافت تصویر' };
        }
    }
}
exports.ImageService = ImageService;
//# sourceMappingURL=imageService.js.map
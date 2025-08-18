"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextService = void 0;
const prisma_1 = __importDefault(require("./prisma"));
class TextService {
    async createText(data) {
        try {
            const text = await prisma_1.default.text.create({
                data
            });
            return { success: true, data: text };
        }
        catch (error) {
            return { success: false, error: 'خطا در ایجاد متن' };
        }
    }
    async getAllTexts() {
        try {
            const texts = await prisma_1.default.text.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return { success: true, data: texts };
        }
        catch (error) {
            return { success: false, error: 'خطا در دریافت متون' };
        }
    }
    async getPublishedTexts() {
        try {
            const texts = await prisma_1.default.text.findMany({
                where: { published: true },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return { success: true, data: texts };
        }
        catch (error) {
            return { success: false, error: 'خطا در دریافت متون منتشر شده' };
        }
    }
    async getTextsByCategory(category) {
        try {
            const texts = await prisma_1.default.text.findMany({
                where: { category, published: true },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return { success: true, data: texts };
        }
        catch (error) {
            return { success: false, error: 'خطا در دریافت متون' };
        }
    }
    async updateText(id, data) {
        try {
            const text = await prisma_1.default.text.update({
                where: { id },
                data
            });
            return { success: true, data: text };
        }
        catch (error) {
            return { success: false, error: 'خطا در به‌روزرسانی متن' };
        }
    }
    async deleteText(id) {
        try {
            await prisma_1.default.text.delete({
                where: { id }
            });
            return { success: true, message: 'متن با موفقیت حذف شد' };
        }
        catch (error) {
            return { success: false, error: 'خطا در حذف متن' };
        }
    }
    async getTextById(id) {
        try {
            const text = await prisma_1.default.text.findUnique({
                where: { id }
            });
            if (!text) {
                return { success: false, error: 'متن یافت نشد' };
            }
            return { success: true, data: text };
        }
        catch (error) {
            return { success: false, error: 'خطا در دریافت متن' };
        }
    }
    async togglePublish(id) {
        try {
            const text = await prisma_1.default.text.findUnique({ where: { id } });
            if (!text) {
                return { success: false, error: 'متن یافت نشد' };
            }
            const updatedText = await prisma_1.default.text.update({
                where: { id },
                data: { published: !text.published }
            });
            return { success: true, data: updatedText };
        }
        catch (error) {
            return { success: false, error: 'خطا در تغییر وضعیت انتشار' };
        }
    }
}
exports.TextService = TextService;
//# sourceMappingURL=textService.js.map
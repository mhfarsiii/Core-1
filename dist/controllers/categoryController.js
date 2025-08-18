"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const categoryService_1 = require("../services/categoryService");
const categoryService = new categoryService_1.CategoryService();
class CategoryController {
    // ایجاد دسته‌بندی جدید (POST)
    async createCategory(req, res) {
        try {
            console.log('Request body:', req.body);
            console.log('Request file:', req.file);
            console.log('Request headers:', req.headers);
            const { title, description } = req.body;
            const imageUrl = req.file?.filename ? `/uploads/${req.file.filename}` : undefined;
            if (!title) {
                return res.status(400).json({
                    success: false,
                    error: 'عنوان دسته‌بندی الزامی است'
                });
            }
            const result = await categoryService.createCategory({
                title,
                imageUrl,
                description
            });
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.status(201).json(result);
        }
        catch (error) {
            console.error('خطا در ایجاد دسته‌بندی:', error);
            res.status(500).json({
                success: false,
                error: 'خطای داخلی سرور'
            });
        }
    }
    // دریافت همه دسته‌بندی‌ها (GET - برای پنل ادمین)
    async getAllCategories(req, res) {
        try {
            const result = await categoryService.getAllCategories();
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('خطا در دریافت دسته‌بندی‌ها:', error);
            res.status(500).json({
                success: false,
                error: 'خطای داخلی سرور'
            });
        }
    }
    // دریافت دسته‌بندی با شناسه (GET - برای پنل ادمین)
    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const categoryId = parseInt(id);
            if (isNaN(categoryId)) {
                return res.status(400).json({
                    success: false,
                    error: 'شناسه دسته‌بندی نامعتبر است'
                });
            }
            const result = await categoryService.getCategoryById(categoryId);
            if (!result.success) {
                return res.status(404).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('خطا در دریافت دسته‌بندی:', error);
            res.status(500).json({
                success: false,
                error: 'خطای داخلی سرور'
            });
        }
    }
    // به‌روزرسانی دسته‌بندی (PUT)
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const categoryId = parseInt(id);
            if (isNaN(categoryId)) {
                return res.status(400).json({
                    success: false,
                    error: 'شناسه دسته‌بندی نامعتبر است'
                });
            }
            const { title, description } = req.body;
            const imageUrl = req.file?.filename ? `/uploads/${req.file.filename}` : undefined;
            const updateData = {};
            if (title !== undefined)
                updateData.title = title;
            if (description !== undefined)
                updateData.description = description;
            if (imageUrl !== undefined)
                updateData.imageUrl = imageUrl;
            const result = await categoryService.updateCategory(categoryId, updateData);
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('خطا در به‌روزرسانی دسته‌بندی:', error);
            res.status(500).json({
                success: false,
                error: 'خطای داخلی سرور'
            });
        }
    }
    // حذف دسته‌بندی (DELETE)
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const categoryId = parseInt(id);
            if (isNaN(categoryId)) {
                return res.status(400).json({
                    success: false,
                    error: 'شناسه دسته‌بندی نامعتبر است'
                });
            }
            const result = await categoryService.deleteCategory(categoryId);
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('خطا در حذف دسته‌بندی:', error);
            res.status(500).json({
                success: false,
                error: 'خطای داخلی سرور'
            });
        }
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=categoryController.js.map
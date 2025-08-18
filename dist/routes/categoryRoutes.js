"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const auth_1 = require("../middlewares/auth");
const upload_1 = require("../middlewares/upload");
const router = (0, express_1.Router)();
const categoryController = new categoryController_1.CategoryController();
// همه مسیرها نیاز به احراز هویت دارند
router.use(auth_1.authMiddleware);
// ایجاد دسته‌بندی جدید (POST)
router.post('/', upload_1.upload.single('image'), categoryController.createCategory);
// دریافت همه دسته‌بندی‌ها (GET)
router.get('/', categoryController.getAllCategories);
// دریافت دسته‌بندی با شناسه (GET)
router.get('/:id', categoryController.getCategoryById);
// به‌روزرسانی دسته‌بندی (PUT)
router.put('/:id', upload_1.upload.single('image'), categoryController.updateCategory);
// حذف دسته‌بندی (DELETE)
router.delete('/:id', categoryController.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map
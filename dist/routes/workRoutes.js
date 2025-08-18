"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workController_1 = require("../controllers/workController");
const auth_1 = require("../middlewares/auth");
const upload_1 = require("../middlewares/upload");
const router = (0, express_1.Router)();
const workController = new workController_1.WorkController();
// همه مسیرها نیاز به احراز هویت دارند
router.use(auth_1.authMiddleware);
// ایجاد کار جدید (POST)
router.post('/', upload_1.upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 }
]), workController.createWork);
// دریافت همه کارها (GET)
router.get('/', workController.getAllWorks);
// دریافت کار با شناسه (GET)
router.get('/:id', workController.getWorkById);
// دریافت کارها بر اساس دسته‌بندی (GET)
router.get('/category/:categoryId', workController.getWorksByCategory);
// به‌روزرسانی کار (PUT)
router.put('/:id', upload_1.upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 }
]), workController.updateWork);
// حذف کار (DELETE)
router.delete('/:id', workController.deleteWork);
exports.default = router;
//# sourceMappingURL=workRoutes.js.map
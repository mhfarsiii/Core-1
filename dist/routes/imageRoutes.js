"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageController_1 = require("../controllers/imageController");
const upload_1 = require("../middlewares/upload");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const imageController = new imageController_1.ImageController();
// Public routes (for frontend display)
router.get('/', imageController.getAllImages);
router.get('/category/:category', imageController.getImagesByCategory);
router.get('/:id', imageController.getImageById);
// Protected routes (admin only)
router.post('/', auth_1.authMiddleware, upload_1.upload.single('image'), imageController.uploadImage);
router.put('/:id', auth_1.authMiddleware, imageController.updateImage);
router.delete('/:id', auth_1.authMiddleware, imageController.deleteImage);
exports.default = router;
//# sourceMappingURL=imageRoutes.js.map
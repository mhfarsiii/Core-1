"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const textController_1 = require("../controllers/textController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const textController = new textController_1.TextController();
// Public routes (for frontend display)
router.get('/published', textController.getPublishedTexts);
router.get('/category/:category', textController.getTextsByCategory);
router.get('/:id', textController.getTextById);
// Protected routes (admin only)
router.post('/', auth_1.authMiddleware, textController.createText);
router.get('/', auth_1.authMiddleware, textController.getAllTexts);
router.put('/:id', auth_1.authMiddleware, textController.updateText);
router.delete('/:id', auth_1.authMiddleware, textController.deleteText);
router.patch('/:id/toggle-publish', auth_1.authMiddleware, textController.togglePublish);
exports.default = router;
//# sourceMappingURL=textRoutes.js.map
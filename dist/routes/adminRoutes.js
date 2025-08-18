"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const adminController = new adminController_1.AdminController();
// Public routes
router.get('/', (req, res) => {
    res.json({
        message: 'Admin API is running',
        endpoints: {
            'POST /login': 'Login to admin panel',
            'POST /register': 'Create admin account (first time only)',
            'GET /profile': 'Get admin profile (requires authentication)'
        }
    });
});
// Login endpoint
router.post('/login', adminController.login);
// Temporary endpoint to create admin user (remove in production)
router.post('/create-admin', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                error: 'نام کاربری، رمز عبور و ایمیل الزامی است'
            });
        }
        const adminService = new (await Promise.resolve().then(() => __importStar(require('../services/adminService')))).AdminService();
        const admin = await adminService.createAdmin({ username, password, email });
        res.status(201).json({
            success: true,
            message: 'کاربر ادمین با موفقیت ایجاد شد',
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email
            }
        });
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                error: 'کاربر با این نام کاربری یا ایمیل قبلاً وجود دارد'
            });
        }
        res.status(500).json({
            success: false,
            error: 'خطا در ایجاد کاربر ادمین: ' + error.message
        });
    }
});
// Protected routes
router.get('/profile', auth_1.authMiddleware, adminController.getProfile);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map
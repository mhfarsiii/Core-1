"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const adminService_1 = require("../services/adminService");
const adminService = new adminService_1.AdminService();
class AdminController {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }
            const result = await adminService.login({ username, password });
            res.json({
                message: 'Login successful',
                ...result
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
    async createAdmin(req, res) {
        try {
            const { username, password, email } = req.body;
            if (!username || !password || !email) {
                return res.status(400).json({ error: 'Username, password and email are required' });
            }
            const admin = await adminService.createAdmin({ username, password, email });
            res.status(201).json({
                message: 'Admin created successfully',
                admin: {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email
                }
            });
        }
        catch (error) {
            console.error('Error creating admin:', error);
            res.status(500).json({ error: 'Failed to create admin' });
        }
    }
    async getProfile(req, res) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ error: 'No token provided' });
            }
            const admin = await adminService.verifyToken(token);
            res.json({
                message: 'Profile retrieved successfully',
                admin
            });
        }
        catch (error) {
            console.error('Error getting profile:', error);
            res.status(401).json({ error: 'Invalid token' });
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=adminController.js.map
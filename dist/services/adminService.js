"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const prisma_1 = __importDefault(require("./prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminService {
    JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    async createAdmin(data) {
        const rounds = Number(process.env.BCRYPT_ROUNDS || 10);
        const hashedPassword = await bcrypt_1.default.hash(data.password, rounds);
        return await prisma_1.default.admin.create({
            data: {
                username: data.username,
                passwordHash: hashedPassword,
                email: data.email
            }
        });
    }
    async login(data) {
        const admin = await prisma_1.default.admin.findUnique({
            where: { username: data.username }
        });
        if (!admin) {
            throw new Error('Invalid credentials');
        }
        const isValidPassword = await bcrypt_1.default.compare(data.password, admin.passwordHash);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({
            id: admin.id,
            username: admin.username,
            email: admin.email
        }, this.JWT_SECRET, { expiresIn: '24h' });
        return {
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email
            }
        };
    }
    async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
            const admin = await prisma_1.default.admin.findUnique({
                where: { id: decoded.id }
            });
            if (!admin) {
                throw new Error('Admin not found');
            }
            return {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                createdAt: admin.createdAt
            };
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
    async getAdminById(id) {
        return await prisma_1.default.admin.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
        });
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=adminService.js.map
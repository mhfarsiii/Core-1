"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../services/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function seed() {
    try {
        console.log('🌱 Starting database seeding...');
        // Create admin user if it doesn't exist
        const adminExists = await prisma_1.default.admin.findFirst();
        if (!adminExists) {
            const rounds = Number(process.env.BCRYPT_ROUNDS || 10);
            const hashedPassword = await bcrypt_1.default.hash('admin123', rounds);
            const admin = await prisma_1.default.admin.create({
                data: {
                    username: 'admin',
                    email: 'admin@yourportfolio.com',
                    passwordHash: hashedPassword
                }
            });
            console.log('✅ Admin user created:', admin.username);
            console.log('🎯 Username: admin');
            console.log('🔑 Password: admin123');
            console.log('⚠️  Change this password after first login!');
        }
        else {
            console.log('✅ Admin user already exists');
        }
        console.log('✨ Seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
    }
    finally {
        await prisma_1.default.$disconnect();
    }
}
seed();
//# sourceMappingURL=seed.js.map
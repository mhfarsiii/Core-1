export interface AdminLoginData {
    username: string;
    password: string;
}
export interface CreateAdminData {
    username: string;
    password: string;
    email: string;
}
export declare class AdminService {
    private readonly JWT_SECRET;
    createAdmin(data: CreateAdminData): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        passwordHash: string;
        email: string;
    }>;
    login(data: AdminLoginData): Promise<{
        token: string;
        admin: {
            id: string;
            username: string;
            email: string;
        };
    }>;
    verifyToken(token: string): Promise<{
        id: string;
        username: string;
        email: string;
        createdAt: Date;
    }>;
    getAdminById(id: string): Promise<{
        id: string;
        createdAt: Date;
        username: string;
        email: string;
    } | null>;
}
//# sourceMappingURL=adminService.d.ts.map
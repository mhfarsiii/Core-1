export interface CreateWorkData {
    title: string;
    description?: string;
    mainImageUrl: string;
    additionalImages?: string[];
    videoLink?: string;
    categoryId: number;
}
export interface UpdateWorkData {
    title?: string;
    description?: string;
    mainImageUrl?: string;
    additionalImages?: string[];
    videoLink?: string;
    categoryId?: number;
}
export declare class WorkService {
    createWork(data: CreateWorkData): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            category: {
                id: number;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                imageUrl: string | null;
            };
        } & {
            id: number;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            mainImageUrl: string;
            additionalImages: import("@prisma/client/runtime/library").JsonValue | null;
            videoLink: string | null;
            categoryId: number;
        };
        error?: undefined;
    }>;
    getAllWorks(): Promise<{
        success: boolean;
        data: ({
            category: {
                id: number;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                imageUrl: string | null;
            };
        } & {
            id: number;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            mainImageUrl: string;
            additionalImages: import("@prisma/client/runtime/library").JsonValue | null;
            videoLink: string | null;
            categoryId: number;
        })[];
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    getWorkById(id: number): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            category: {
                id: number;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                imageUrl: string | null;
            };
        } & {
            id: number;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            mainImageUrl: string;
            additionalImages: import("@prisma/client/runtime/library").JsonValue | null;
            videoLink: string | null;
            categoryId: number;
        };
        error?: undefined;
    }>;
    getWorksByCategory(categoryId: number): Promise<{
        success: boolean;
        data: ({
            category: {
                id: number;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                imageUrl: string | null;
            };
        } & {
            id: number;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            mainImageUrl: string;
            additionalImages: import("@prisma/client/runtime/library").JsonValue | null;
            videoLink: string | null;
            categoryId: number;
        })[];
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    getSimilarWorks(workId: number, limit?: number): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: ({
            category: {
                id: number;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                imageUrl: string | null;
            };
        } & {
            id: number;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            mainImageUrl: string;
            additionalImages: import("@prisma/client/runtime/library").JsonValue | null;
            videoLink: string | null;
            categoryId: number;
        })[];
        error?: undefined;
    }>;
    updateWork(id: number, data: UpdateWorkData): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            category: {
                id: number;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                imageUrl: string | null;
            };
        } & {
            id: number;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            mainImageUrl: string;
            additionalImages: import("@prisma/client/runtime/library").JsonValue | null;
            videoLink: string | null;
            categoryId: number;
        };
        error?: undefined;
    }>;
    deleteWork(id: number): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        message?: undefined;
    }>;
}
//# sourceMappingURL=workService.d.ts.map
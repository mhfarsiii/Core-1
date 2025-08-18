export interface CreateCategoryData {
    title: string;
    imageUrl?: string;
    description?: string;
}
export interface UpdateCategoryData {
    title?: string;
    imageUrl?: string;
    description?: string;
}
export declare class CategoryService {
    createCategory(data: CreateCategoryData): Promise<{
        success: boolean;
        data: {
            id: number;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    getAllCategories(): Promise<{
        success: boolean;
        data: ({
            _count: {
                works: number;
            };
        } & {
            id: number;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        })[];
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    getCategoryById(id: number): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            works: {
                id: number;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                mainImageUrl: string;
                additionalImages: import("@prisma/client/runtime/library").JsonValue | null;
                videoLink: string | null;
                categoryId: number;
            }[];
        } & {
            id: number;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        };
        error?: undefined;
    }>;
    updateCategory(id: number, data: UpdateCategoryData): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: number;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        };
        error?: undefined;
    }>;
    deleteCategory(id: number): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        message?: undefined;
    }>;
}
//# sourceMappingURL=categoryService.d.ts.map
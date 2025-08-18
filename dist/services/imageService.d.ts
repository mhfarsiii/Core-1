export interface CreateImageData {
    url: string;
    title: string;
    description?: string;
    category?: string;
}
export interface UpdateImageData {
    title?: string;
    description?: string;
    category?: string;
}
export declare class ImageService {
    createImage(data: CreateImageData): Promise<{
        success: boolean;
        data: {
            id: string;
            url: string;
            title: string;
            description: string | null;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    getAllImages(): Promise<{
        success: boolean;
        data: {
            id: string;
            url: string;
            title: string;
            description: string | null;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    getImagesByCategory(category: string): Promise<{
        success: boolean;
        data: {
            id: string;
            url: string;
            title: string;
            description: string | null;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    updateImage(id: string, data: UpdateImageData): Promise<{
        success: boolean;
        data: {
            id: string;
            url: string;
            title: string;
            description: string | null;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    deleteImage(id: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        message?: undefined;
    }>;
    getImageById(id: string): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: string;
            url: string;
            title: string;
            description: string | null;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        error?: undefined;
    }>;
}
//# sourceMappingURL=imageService.d.ts.map
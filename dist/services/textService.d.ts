export interface CreateTextData {
    title: string;
    content: string;
    excerpt?: string;
    category?: string;
    published?: boolean;
}
export interface UpdateTextData {
    title?: string;
    content?: string;
    excerpt?: string;
    category?: string;
    published?: boolean;
}
export declare class TextService {
    createText(data: CreateTextData): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            excerpt: string | null;
            published: boolean;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    getAllTexts(): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            excerpt: string | null;
            published: boolean;
        }[];
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    getPublishedTexts(): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            excerpt: string | null;
            published: boolean;
        }[];
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    getTextsByCategory(category: string): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            excerpt: string | null;
            published: boolean;
        }[];
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    updateText(id: string, data: UpdateTextData): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            excerpt: string | null;
            published: boolean;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    deleteText(id: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        message?: undefined;
    }>;
    getTextById(id: string): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: string;
            title: string;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            excerpt: string | null;
            published: boolean;
        };
        error?: undefined;
    }>;
    togglePublish(id: string): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: string;
            title: string;
            category: string | null;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            excerpt: string | null;
            published: boolean;
        };
        error?: undefined;
    }>;
}
//# sourceMappingURL=textService.d.ts.map
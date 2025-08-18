import { Request, Response } from 'express';
export declare class CategoryController {
    createCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAllCategories(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCategoryById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=categoryController.d.ts.map
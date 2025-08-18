import { Request, Response } from 'express';
export declare class ImageController {
    uploadImage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAllImages(req: Request, res: Response): Promise<void>;
    getImagesByCategory(req: Request, res: Response): Promise<void>;
    updateImage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteImage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getImageById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=imageController.d.ts.map
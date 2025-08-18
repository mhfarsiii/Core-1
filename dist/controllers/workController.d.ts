import { Request, Response } from 'express';
interface RequestWithFiles extends Request {
    files?: {
        [fieldname: string]: Express.Multer.File[];
    } | Express.Multer.File[];
}
export declare class WorkController {
    createWork(req: RequestWithFiles, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAllWorks(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getWorkById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getWorksByCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateWork(req: RequestWithFiles, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteWork(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export {};
//# sourceMappingURL=workController.d.ts.map
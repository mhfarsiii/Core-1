import { Request, Response } from 'express';
export declare class AdminController {
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=adminController.d.ts.map
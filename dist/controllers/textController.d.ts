import { Request, Response } from 'express';
export declare class TextController {
    createText(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAllTexts(req: Request, res: Response): Promise<void>;
    getPublishedTexts(req: Request, res: Response): Promise<void>;
    getTextsByCategory(req: Request, res: Response): Promise<void>;
    updateText(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteText(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getTextById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    togglePublish(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=textController.d.ts.map
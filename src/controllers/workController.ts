import { Request, Response } from 'express';
import { WorkService } from '../services/workService';
import { RequestWithFiles, ApiResponse } from '../types/interfaces';
import {
  ValidationError,
  NotFoundError,
  DatabaseError
} from '../types/errors';

export class WorkController {
  private workService: WorkService;

  constructor(workService?: WorkService) {
    this.workService = workService || new WorkService();
  }
  async createWork(req: RequestWithFiles, res: Response): Promise<void> {
    try {
      const { title, description, categoryId, videoLink } = req.body;
      const parsedCategoryId = parseInt(categoryId);

      // Get uploaded files
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const mainImage = files?.['mainImage']?.[0];
      const additionalImages = files?.['additionalImages'] || [];

      if (!mainImage) {
        throw new ValidationError('Main image is required');
      }

      const mainImageUrl = `/uploads/${mainImage.filename}`;
      const additionalImageUrls = additionalImages?.map(img => `/uploads/${img.filename}`) || [];

      const work = await this.workService.createWork({
        title,
        description,
        mainImageUrl,
        additionalImages: additionalImageUrls,
        videoLink,
        categoryId: parsedCategoryId
      });

      const response: ApiResponse = {
        message: 'Work created successfully',
        data: work
      };

      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getAllWorks(req: Request, res: Response): Promise<void> {
    try {
      const works = await this.workService.getAllWorks();
      
      const response: ApiResponse = {
        message: 'Works retrieved successfully',
        data: works
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getWorkById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const workId = parseInt(id);
      
      const work = await this.workService.getWorkById(workId);
      
      if (!work) {
        throw new NotFoundError('Work not found');
      }

      const response: ApiResponse = {
        message: 'Work retrieved successfully',
        data: work
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getWorksByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const parsedCategoryId = parseInt(categoryId);
      
      const works = await this.workService.getWorksByCategory(parsedCategoryId);
      
      const response: ApiResponse = {
        message: 'Works retrieved successfully',
        data: works
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateWork(req: RequestWithFiles, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const workId = parseInt(id);
      const { title, description, categoryId, videoLink } = req.body;
      
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (videoLink !== undefined) updateData.videoLink = videoLink;
      
      if (categoryId !== undefined) {
        const parsedCategoryId = parseInt(categoryId);
        updateData.categoryId = parsedCategoryId;
      }

      // Get uploaded files
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const mainImage = files?.['mainImage']?.[0];
      const additionalImages = files?.['additionalImages'] || [];

      if (mainImage) {
        updateData.mainImageUrl = `/uploads/${mainImage.filename}`;
      }

      if (additionalImages && additionalImages.length > 0) {
        updateData.additionalImages = additionalImages.map(img => `/uploads/${img.filename}`);
      }

      const work = await this.workService.updateWork(workId, updateData);
      
      const response: ApiResponse = {
        message: 'Work updated successfully',
        data: work
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteWork(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const workId = parseInt(id);
      
      await this.workService.deleteWork(workId);
      
      const response: ApiResponse = {
        message: 'Work deleted successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    console.error('Controller error:', error);
    
    if (error instanceof ValidationError) {
      const response: ApiResponse = {
        message: 'Validation failed',
        error: error.message
      };
      res.status(400).json(response);
      return;
    }
    
    if (error instanceof NotFoundError) {
      const response: ApiResponse = {
        message: 'Resource not found',
        error: error.message
      };
      res.status(404).json(response);
      return;
    }
    
    if (error instanceof DatabaseError) {
      const response: ApiResponse = {
        message: 'Database operation failed',
        error: 'An internal error occurred'
      };
      res.status(500).json(response);
      return;
    }
    
    // Unknown error
    const response: ApiResponse = {
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    };
    res.status(500).json(response);
  }
}

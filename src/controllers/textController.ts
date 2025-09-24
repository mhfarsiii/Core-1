import { Request, Response } from 'express';
import { TextService } from '../services/textService';
import { ApiResponse } from '../types/interfaces';
import {
  ValidationError,
  NotFoundError,
  DatabaseError
} from '../types/errors';

export class TextController {
  private textService: TextService;

  constructor(textService?: TextService) {
    this.textService = textService || new TextService();
  }
  async createText(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, excerpt, category, published } = req.body;
      
      const text = await this.textService.createText({
        title,
        content,
        excerpt,
        category,
        published: published || false
      });

      const response: ApiResponse = {
        message: 'Text created successfully',
        data: text
      };

      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getAllTexts(req: Request, res: Response): Promise<void> {
    try {
      const published = req.query.published === 'true' ? true : req.query.published === 'false' ? false : undefined;
      const texts = await this.textService.getAllTexts(published);
      
      const response: ApiResponse = {
        message: 'Texts retrieved successfully',
        data: texts
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getTextById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const text = await this.textService.getTextById(id);
      
      if (!text) {
        throw new NotFoundError('Text not found');
      }

      const response: ApiResponse = {
        message: 'Text retrieved successfully',
        data: text
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateText(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, content, excerpt, category, published } = req.body;
      
      const text = await this.textService.updateText(id, {
        title,
        content,
        excerpt,
        category,
        published
      });

      const response: ApiResponse = {
        message: 'Text updated successfully',
        data: text
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteText(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.textService.deleteText(id);
      
      const response: ApiResponse = {
        message: 'Text deleted successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async publishText(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const text = await this.textService.publishText(id);
      
      const response: ApiResponse = {
        message: 'Text published successfully',
        data: text
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async unpublishText(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const text = await this.textService.unpublishText(id);
      
      const response: ApiResponse = {
        message: 'Text unpublished successfully',
        data: text
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
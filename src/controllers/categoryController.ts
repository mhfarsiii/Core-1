import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { RequestWithFile, ApiResponse } from '../types/interfaces';
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  DatabaseError
} from '../types/errors';

export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService?: CategoryService) {
    this.categoryService = categoryService || new CategoryService();
  }
  async createCategory(req: RequestWithFile, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;
      const imageUrl = req.file?.filename ? `/uploads/${req.file.filename}` : undefined;

      const category = await this.categoryService.createCategory({
        title,
        imageUrl,
        description
      });

      const response: ApiResponse = {
        message: 'Category created successfully',
        data: category
      };

      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories();
      
      const response: ApiResponse = {
        message: 'Categories retrieved successfully',
        data: categories
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id);
      
      const category = await this.categoryService.getCategoryById(categoryId);
      
      if (!category) {
        throw new NotFoundError('Category not found');
      }

      const response: ApiResponse = {
        message: 'Category retrieved successfully',
        data: category
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateCategory(req: RequestWithFile, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id);
      const { title, description } = req.body;
      const imageUrl = req.file?.filename ? `/uploads/${req.file.filename}` : undefined;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

      const category = await this.categoryService.updateCategory(categoryId, updateData);
      
      const response: ApiResponse = {
        message: 'Category updated successfully',
        data: category
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id);
      
      await this.categoryService.deleteCategory(categoryId);
      
      const response: ApiResponse = {
        message: 'Category deleted successfully'
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
    
    if (error instanceof ConflictError) {
      const response: ApiResponse = {
        message: 'Conflict',
        error: error.message
      };
      res.status(409).json(response);
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

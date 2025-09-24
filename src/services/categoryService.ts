import prisma from './prisma';
import type { Category } from '@prisma/client';
import {
  CreateCategoryData,
  UpdateCategoryData,
  CategoryWithWorksCount,
  CategoryWithWorks,
  ICategoryService
} from '../types/interfaces';
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  DatabaseError
} from '../types/errors';
import { generateSlug, generateUniqueSlug } from '../utils/slug';

export class CategoryService implements ICategoryService {
  async createCategory(data: CreateCategoryData): Promise<Category> {
    try {
      // Input validation
      if (!data.title || data.title.trim().length === 0) {
        throw new ValidationError('Category title is required');
      }

      if (data.title.length > 255) {
        throw new ValidationError('Category title must be less than 255 characters');
      }

      // Check if category with same title already exists
      const existingCategory = await prisma.category.findUnique({
        where: { title: data.title.trim() }
      });

      if (existingCategory) {
        throw new ConflictError('Category with this title already exists');
      }

      const slug = generateSlug(data.title.trim());
      
      // Check if slug already exists
      const existingCategories = await prisma.category.findMany({
        select: { slug: true }
      });
      const existingSlugs = existingCategories.map((c: { slug: string }) => c.slug);
      const uniqueSlug = generateUniqueSlug(slug, existingSlugs);

      return await prisma.category.create({
        data: {
          title: data.title.trim(),
          slug: uniqueSlug,
          imageUrl: data.imageUrl,
          description: data.description?.trim(),
        },
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ConflictError) {
        throw error;
      }
      throw new DatabaseError('Failed to create category');
    }
  }

  async getAllCategories(): Promise<CategoryWithWorksCount[]> {
    try {
      return await prisma.category.findMany({
        include: {
          _count: {
            select: { works: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      throw new DatabaseError('Failed to fetch categories');
    }
  }

  async getCategoryById(id: number): Promise<CategoryWithWorks | null> {
    try {
      if (!id || id <= 0) {
        throw new ValidationError('Valid category ID is required');
      }

      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          works: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      
      return category;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Failed to fetch category');
    }
  }

  async updateCategory(id: number, data: UpdateCategoryData): Promise<Category> {
    try {
      if (!id || id <= 0) {
        throw new ValidationError('Valid category ID is required');
      }

      // Get current category
      const currentCategory = await prisma.category.findUnique({
        where: { id }
      });

      if (!currentCategory) {
        throw new NotFoundError('Category not found');
      }

      // Build update data
      const updateData: any = {};
      
      if (data.title !== undefined) {
        if (data.title.trim().length === 0) {
          throw new ValidationError('Category title cannot be empty');
        }
        if (data.title.length > 255) {
          throw new ValidationError('Category title must be less than 255 characters');
        }
        updateData.title = data.title.trim();
        
        // Generate new slug if title is changing
        if (data.title.trim() !== currentCategory.title) {
          const slug = generateSlug(data.title.trim());
          const existingCategories = await prisma.category.findMany({
            where: { id: { not: id } },
            select: { slug: true }
          });
          const existingSlugs = existingCategories.map((c: { slug: string }) => c.slug);
          updateData.slug = generateUniqueSlug(slug, existingSlugs);
        }
      }
      
      if (data.imageUrl !== undefined) {
        updateData.imageUrl = data.imageUrl;
      }
      
      if (data.description !== undefined) {
        updateData.description = data.description?.trim();
      }

      // Check for title conflicts if title is being changed
      if (updateData.title && updateData.title !== currentCategory.title) {
        const existingCategory = await prisma.category.findFirst({
          where: {
            title: updateData.title,
            id: { not: id }
          }
        });

        if (existingCategory) {
          throw new ConflictError('Category with this title already exists');
        }
      }

      return await prisma.category.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }
      throw new DatabaseError('Failed to update category');
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      if (!id || id <= 0) {
        throw new ValidationError('Valid category ID is required');
      }

      // Check if category exists
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: { works: true }
          }
        }
      });

      if (!category) {
        throw new NotFoundError('Category not found');
      }

      // Check if category has associated works
      if (category._count.works > 0) {
        throw new ConflictError('Cannot delete category with associated works');
      }

      await prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }
      throw new DatabaseError('Failed to delete category');
    }
  }
}

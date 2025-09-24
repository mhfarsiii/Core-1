import prisma from './prisma';
import type { Work } from '@prisma/client';
import {
  CreateWorkData,
  UpdateWorkData,
  WorkWithCategory,
  IWorkService
} from '../types/interfaces';
import {
  ValidationError,
  NotFoundError,
  DatabaseError
} from '../types/errors';
import { generateSlug, generateUniqueSlug } from '../utils/slug';

export class WorkService implements IWorkService {
  async createWork(data: CreateWorkData): Promise<WorkWithCategory> {
    try {
      // Input validation
      if (!data.title || data.title.trim().length === 0) {
        throw new ValidationError('Work title is required');
      }

      if (!data.mainImageUrl) {
        throw new ValidationError('Main image is required');
      }

      if (!data.categoryId || data.categoryId <= 0) {
        throw new ValidationError('Valid category ID is required');
      }

      if (data.title.length > 255) {
        throw new ValidationError('Work title must be less than 255 characters');
      }

      // Check if category exists
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId }
      });

      if (!category) {
        throw new NotFoundError('Category not found');
      }

      const slug = generateSlug(data.title.trim());
      
      // Check if slug already exists
      const existingWorks = await prisma.work.findMany({
        select: { slug: true }
      });
      const existingSlugs = existingWorks.map((w: { slug: string }) => w.slug);
      const uniqueSlug = generateUniqueSlug(slug, existingSlugs);

      return await prisma.work.create({
        data: {
          title: data.title.trim(),
          slug: uniqueSlug,
          description: data.description?.trim(),
          mainImageUrl: data.mainImageUrl,
          additionalImages: data.additionalImages ? JSON.stringify(data.additionalImages) : null,
          videoLink: data.videoLink,
          categoryId: data.categoryId,
        },
        include: {
          category: true
        }
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to create work');
    }
  }

  async getAllWorks(): Promise<WorkWithCategory[]> {
    try {
      return await prisma.work.findMany({
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      throw new DatabaseError('Failed to fetch works');
    }
  }

  async getWorkById(id: number): Promise<WorkWithCategory | null> {
    try {
      if (!id || id <= 0) {
        throw new ValidationError('Valid work ID is required');
      }

      return await prisma.work.findUnique({
        where: { id },
        include: {
          category: true
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Failed to fetch work');
    }
  }

  async getWorksByCategory(categoryId: number): Promise<WorkWithCategory[]> {
    try {
      if (!categoryId || categoryId <= 0) {
        throw new ValidationError('Valid category ID is required');
      }

      return await prisma.work.findMany({
        where: { categoryId },
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Failed to fetch works by category');
    }
  }

  async getSimilarWorks(workId: number, limit: number = 4): Promise<WorkWithCategory[]> {
    try {
      if (!workId || workId <= 0) {
        throw new ValidationError('Valid work ID is required');
      }

      if (limit <= 0 || limit > 50) {
        throw new ValidationError('Limit must be between 1 and 50');
      }

      const currentWork = await prisma.work.findUnique({
        where: { id: workId },
        select: { categoryId: true }
      });

      if (!currentWork) {
        throw new NotFoundError('Work not found');
      }

      return await prisma.work.findMany({
        where: {
          categoryId: currentWork.categoryId,
          id: { not: workId }
        },
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to fetch similar works');
    }
  }

  async updateWork(id: number, data: UpdateWorkData): Promise<WorkWithCategory> {
    try {
      if (!id || id <= 0) {
        throw new ValidationError('Valid work ID is required');
      }

      // Check if work exists
      const existingWork = await prisma.work.findUnique({
        where: { id }
      });

      if (!existingWork) {
        throw new NotFoundError('Work not found');
      }

      // Build update data
      const updateData: any = {};
      
      if (data.title !== undefined) {
        if (data.title.trim().length === 0) {
          throw new ValidationError('Work title cannot be empty');
        }
        if (data.title.length > 255) {
          throw new ValidationError('Work title must be less than 255 characters');
        }
        updateData.title = data.title.trim();
        
        // Generate new slug if title is changing
        if (data.title.trim() !== existingWork.title) {
          const slug = generateSlug(data.title.trim());
          const existingWorks = await prisma.work.findMany({
            where: { id: { not: id } },
            select: { slug: true }
          });
          const existingSlugs = existingWorks.map((w: { slug: string }) => w.slug);
          updateData.slug = generateUniqueSlug(slug, existingSlugs);
        }
      }
      
      if (data.description !== undefined) {
        updateData.description = data.description?.trim();
      }
      
      if (data.mainImageUrl !== undefined) {
        updateData.mainImageUrl = data.mainImageUrl;
      }
      
      if (data.additionalImages !== undefined) {
        updateData.additionalImages = data.additionalImages ? JSON.stringify(data.additionalImages) : null;
      }
      
      if (data.videoLink !== undefined) {
        updateData.videoLink = data.videoLink;
      }

      // Validate category if being changed
      if (data.categoryId !== undefined) {
        if (data.categoryId <= 0) {
          throw new ValidationError('Valid category ID is required');
        }
        
        const category = await prisma.category.findUnique({
          where: { id: data.categoryId }
        });

        if (!category) {
          throw new NotFoundError('Category not found');
        }
        
        updateData.categoryId = data.categoryId;
      }

      return await prisma.work.update({
        where: { id },
        data: updateData,
        include: {
          category: true
        }
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to update work');
    }
  }

  async deleteWork(id: number): Promise<void> {
    try {
      if (!id || id <= 0) {
        throw new ValidationError('Valid work ID is required');
      }

      // Check if work exists
      const work = await prisma.work.findUnique({
        where: { id }
      });

      if (!work) {
        throw new NotFoundError('Work not found');
      }

      await prisma.work.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to delete work');
    }
  }
}

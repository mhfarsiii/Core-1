import prisma from './prisma';
import type { Text } from '@prisma/client';
import {
  CreateTextData,
  UpdateTextData,
  ITextService
} from '../types/interfaces';
import {
  ValidationError,
  NotFoundError,
  DatabaseError
} from '../types/errors';
import { generateSlug, generateUniqueSlug } from '../utils/slug';

export class TextService implements ITextService {
  async createText(data: CreateTextData): Promise<Text> {
    try {
      // Input validation
      if (!data.title || data.title.trim().length === 0) {
        throw new ValidationError('Text title is required');
      }

      if (!data.content || data.content.trim().length === 0) {
        throw new ValidationError('Text content is required');
      }

      const slug = generateSlug(data.title.trim());
      
      // Check if slug already exists
      const existingTexts = await prisma.text.findMany({
        select: { slug: true }
      });
      const existingSlugs = existingTexts.map((t: { slug: string }) => t.slug);
      const uniqueSlug = generateUniqueSlug(slug, existingSlugs);

      return await prisma.text.create({
        data: {
          title: data.title.trim(),
          slug: uniqueSlug,
          content: data.content.trim(),
          excerpt: data.excerpt?.trim(),
          category: data.category,
          published: data.published || false,
          publishedAt: data.published ? new Date() : null
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Failed to create text');
    }
  }

  async getAllTexts(published?: boolean): Promise<Text[]> {
    try {
      const where = published !== undefined ? { published } : {};
      
      return await prisma.text.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      throw new DatabaseError('Failed to fetch texts');
    }
  }

  async getTextById(id: string): Promise<Text | null> {
    try {
      if (!id) {
        throw new ValidationError('Text ID is required');
      }

      return await prisma.text.findUnique({
        where: { id }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Failed to fetch text');
    }
  }

  async updateText(id: string, data: UpdateTextData): Promise<Text> {
    try {
      if (!id) {
        throw new ValidationError('Text ID is required');
      }

      // Check if text exists
      const existingText = await prisma.text.findUnique({
        where: { id }
      });

      if (!existingText) {
        throw new NotFoundError('Text not found');
      }

      const updateData: any = {};
      
      if (data.title !== undefined) {
        if (data.title.trim().length === 0) {
          throw new ValidationError('Text title cannot be empty');
        }
        updateData.title = data.title.trim();
        
        // Generate new slug if title is changing
        if (data.title.trim() !== existingText.title) {
          const slug = generateSlug(data.title.trim());
        const existingTexts = await prisma.text.findMany({
          where: { id: { not: id } },
          select: { slug: true }
        });
        const existingSlugs = existingTexts.map((t: { slug: string }) => t.slug);
          updateData.slug = generateUniqueSlug(slug, existingSlugs);
        }
      }
      
      if (data.content !== undefined) {
        if (data.content.trim().length === 0) {
          throw new ValidationError('Text content cannot be empty');
        }
        updateData.content = data.content.trim();
      }
      
      if (data.excerpt !== undefined) {
        updateData.excerpt = data.excerpt?.trim();
      }
      
      if (data.category !== undefined) {
        updateData.category = data.category;
      }
      
      if (data.published !== undefined) {
        updateData.published = data.published;
        // Set publishedAt when publishing
        if (data.published && !existingText.published) {
          updateData.publishedAt = new Date();
        }
      }

      return await prisma.text.update({
        where: { id },
        data: updateData
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to update text');
    }
  }

  async deleteText(id: string): Promise<void> {
    try {
      if (!id) {
        throw new ValidationError('Text ID is required');
      }

      // Check if text exists
      const text = await prisma.text.findUnique({
        where: { id }
      });

      if (!text) {
        throw new NotFoundError('Text not found');
      }

      await prisma.text.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to delete text');
    }
  }

  async publishText(id: string): Promise<Text> {
    try {
      if (!id) {
        throw new ValidationError('Text ID is required');
      }

      const text = await prisma.text.findUnique({ where: { id } });
      if (!text) {
        throw new NotFoundError('Text not found');
      }
      
      return await prisma.text.update({
        where: { id },
        data: { 
          published: true,
          publishedAt: new Date()
        }
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to publish text');
    }
  }

  async unpublishText(id: string): Promise<Text> {
    try {
      if (!id) {
        throw new ValidationError('Text ID is required');
      }

      const text = await prisma.text.findUnique({ where: { id } });
      if (!text) {
        throw new NotFoundError('Text not found');
      }
      
      return await prisma.text.update({
        where: { id },
        data: { published: false }
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to unpublish text');
    }
  }

} 
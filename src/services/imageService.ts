import prisma from './prisma'
import { Image } from '@prisma/client'

export interface CreateImageData {
  url: string
  title: string
  description?: string
  category?: string
}

export interface UpdateImageData {
  title?: string
  description?: string
  category?: string
}

export class ImageService {
  async createImage(data: CreateImageData) {
    try {
      const image = await prisma.image.create({
        data
      });
      
      return { success: true, data: image };
    } catch (error) {
      return { success: false, error: 'خطا در ایجاد تصویر' };
    }
  }

  async getAllImages() {
    try {
      const images = await prisma.image.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return { success: true, data: images };
    } catch (error) {
      return { success: false, error: 'خطا در دریافت تصاویر' };
    }
  }

  async getImagesByCategory(category: string) {
    try {
      const images = await prisma.image.findMany({
        where: { category },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return { success: true, data: images };
    } catch (error) {
      return { success: false, error: 'خطا در دریافت تصاویر' };
    }
  }

  async updateImage(id: string, data: UpdateImageData) {
    try {
      const image = await prisma.image.update({
        where: { id },
        data
      });
      
      return { success: true, data: image };
    } catch (error) {
      return { success: false, error: 'خطا در به‌روزرسانی تصویر' };
    }
  }

  async deleteImage(id: string) {
    try {
      await prisma.image.delete({
        where: { id }
      });
      return { success: true, message: 'تصویر با موفقیت حذف شد' };
    } catch (error) {
      return { success: false, error: 'خطا در حذف تصویر' };
    }
  }

  async getImageById(id: string) {
    try {
      const image = await prisma.image.findUnique({
        where: { id }
      });
      
      if (!image) {
        return { success: false, error: 'تصویر یافت نشد' };
      }
      
      return { success: true, data: image };
    } catch (error) {
      return { success: false, error: 'خطا در دریافت تصویر' };
    }
  }
} 
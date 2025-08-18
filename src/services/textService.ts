import prisma from './prisma'
import { Text } from '@prisma/client'

export interface CreateTextData {
  title: string
  content: string
  excerpt?: string
  category?: string
  published?: boolean
}

export interface UpdateTextData {
  title?: string
  content?: string
  excerpt?: string
  category?: string
  published?: boolean
}

export class TextService {
  async createText(data: CreateTextData) {
    try {
      const text = await prisma.text.create({
        data
      });
      
      return { success: true, data: text };
    } catch (error) {
      return { success: false, error: 'خطا در ایجاد متن' };
    }
  }

  async getAllTexts() {
    try {
      const texts = await prisma.text.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return { success: true, data: texts };
    } catch (error) {
      return { success: false, error: 'خطا در دریافت متون' };
    }
  }

  async getPublishedTexts() {
    try {
      const texts = await prisma.text.findMany({
        where: { published: true },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return { success: true, data: texts };
    } catch (error) {
      return { success: false, error: 'خطا در دریافت متون منتشر شده' };
    }
  }

  async getTextsByCategory(category: string) {
    try {
      const texts = await prisma.text.findMany({
        where: { category, published: true },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return { success: true, data: texts };
    } catch (error) {
      return { success: false, error: 'خطا در دریافت متون' };
    }
  }

  async updateText(id: string, data: UpdateTextData) {
    try {
      const text = await prisma.text.update({
        where: { id },
        data
      });
      
      return { success: true, data: text };
    } catch (error) {
      return { success: false, error: 'خطا در به‌روزرسانی متن' };
    }
  }

  async deleteText(id: string) {
    try {
      await prisma.text.delete({
        where: { id }
      });
      return { success: true, message: 'متن با موفقیت حذف شد' };
    } catch (error) {
      return { success: false, error: 'خطا در حذف متن' };
    }
  }

  async getTextById(id: string) {
    try {
      const text = await prisma.text.findUnique({
        where: { id }
      });
      
      if (!text) {
        return { success: false, error: 'متن یافت نشد' };
      }
      
      return { success: true, data: text };
    } catch (error) {
      return { success: false, error: 'خطا در دریافت متن' };
    }
  }

  async togglePublish(id: string) {
    try {
      const text = await prisma.text.findUnique({ where: { id } });
      if (!text) {
        return { success: false, error: 'متن یافت نشد' };
      }
      
      const updatedText = await prisma.text.update({
        where: { id },
        data: { published: !text.published }
      });
      
      return { success: true, data: updatedText };
    } catch (error) {
      return { success: false, error: 'خطا در تغییر وضعیت انتشار' };
    }
  }
} 
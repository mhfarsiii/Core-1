// TypeScript Interfaces following Microsoft Principal Engineer best practices

import { Request } from 'express';
import type { Admin, Category, Work, Image, Text } from '@prisma/client';

// ========================
// Common Response Interfaces
// ========================
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ========================
// Admin Interfaces
// ========================
export interface AdminLoginData {
  username: string;
  password: string;
}

export interface CreateAdminData {
  username: string;
  password: string;
  email: string;
}

export interface LoginResult {
  token: string;
  admin: AdminProfile;
}

export interface AdminProfile {
  id: string;
  username: string;
  email: string;
  createdAt?: Date;
}

export interface JwtPayload {
  id: string;
  username: string;
  email: string;
}

// ========================
// Category Interfaces
// ========================
export interface CreateCategoryData {
  title: string;
  imageUrl?: string;
  description?: string;
}

export interface UpdateCategoryData {
  title?: string;
  imageUrl?: string;
  description?: string;
}

export interface CategoryWithWorksCount extends Category {
  _count: {
    works: number;
  };
}

export interface CategoryWithWorks extends Category {
  works: Work[];
}

// ========================
// Work Interfaces
// ========================
export interface CreateWorkData {
  title: string;
  description?: string;
  mainImageUrl: string;
  additionalImages?: string[];
  videoLink?: string;
  categoryId: number;
}

export interface UpdateWorkData {
  title?: string;
  description?: string;
  mainImageUrl?: string;
  additionalImages?: string[];
  videoLink?: string;
  categoryId?: number;
}

export interface WorkWithCategory extends Work {
  category: Category;
}

// ========================
// Image Interfaces
// ========================
export interface CreateImageData {
  url: string;
  title: string;
  description?: string;
  category?: string;
}

export interface UpdateImageData {
  url?: string;
  title?: string;
  description?: string;
  category?: string;
}

// ========================
// Text Interfaces
// ========================
export interface CreateTextData {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  published?: boolean;
}

export interface UpdateTextData {
  title?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  published?: boolean;
}

// ========================
// File Upload Interfaces
// ========================
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

export interface MultipleUploadedFiles {
  [fieldname: string]: UploadedFile[];
}

// ========================
// Request Extensions
// ========================
export interface AuthenticatedRequest extends Request {
  admin?: AdminProfile;
}

export interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

export interface RequestWithFiles extends Request {
  files?: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[];
}

// ========================
// Service Interfaces
// ========================
export interface IAdminService {
  login(data: AdminLoginData): Promise<LoginResult>;
  createAdmin(data: CreateAdminData): Promise<Admin>;
  verifyToken(token: string): Promise<AdminProfile>;
  getAdminById(id: string): Promise<AdminProfile | null>;
}

export interface ICategoryService {
  createCategory(data: CreateCategoryData): Promise<Category>;
  getAllCategories(): Promise<CategoryWithWorksCount[]>;
  getCategoryById(id: number): Promise<CategoryWithWorks | null>;
  updateCategory(id: number, data: UpdateCategoryData): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
}

export interface IWorkService {
  createWork(data: CreateWorkData): Promise<WorkWithCategory>;
  getAllWorks(): Promise<WorkWithCategory[]>;
  getWorkById(id: number): Promise<WorkWithCategory | null>;
  getWorksByCategory(categoryId: number): Promise<WorkWithCategory[]>;
  getSimilarWorks(workId: number, limit?: number): Promise<WorkWithCategory[]>;
  updateWork(id: number, data: UpdateWorkData): Promise<WorkWithCategory>;
  deleteWork(id: number): Promise<void>;
}

export interface IImageService {
  uploadImage(file: UploadedFile, title: string, description?: string, category?: string): Promise<Image>;
  getAllImages(): Promise<Image[]>;
  getImageById(id: string): Promise<Image | null>;
  updateImage(id: string, data: UpdateImageData): Promise<Image>;
  deleteImage(id: string): Promise<void>;
}

export interface ITextService {
  createText(data: CreateTextData): Promise<Text>;
  getAllTexts(published?: boolean): Promise<Text[]>;
  getTextById(id: string): Promise<Text | null>;
  updateText(id: string, data: UpdateTextData): Promise<Text>;
  deleteText(id: string): Promise<void>;
  publishText(id: string): Promise<Text>;
  unpublishText(id: string): Promise<Text>;
}

import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { config } from '../config/environment';
import { FileUploadError } from '../types/errors';

// Storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, config.upload.uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Generate unique filename with timestamp and random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (
  req: Request, 
  file: Express.Multer.File, 
  cb: multer.FileFilterCallback
) => {
  // Check if file type is allowed
  if (config.upload.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Error handling for multer
const handleMulterError = (error: any): Error => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return new FileUploadError(`File too large. Maximum size allowed: ${config.upload.maxFileSize} bytes`);
      case 'LIMIT_FILE_COUNT':
        return new FileUploadError('Too many files uploaded');
      case 'LIMIT_UNEXPECTED_FILE':
        return new FileUploadError('Unexpected field name in file upload');
      default:
        return new FileUploadError(`Upload error: ${error.message}`);
    }
  }
  return error;
};

// Main upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 10, // Maximum 10 files per request
    fields: 10 // Maximum 10 non-file fields
  }
});

// Single file upload middleware
export const uploadSingle = (fieldName: string) => {
  return (req: Request, res: any, next: any) => {
    upload.single(fieldName)(req, res, (error: any) => {
      if (error) {
        return next(handleMulterError(error));
      }
      next();
    });
  };
};

// Multiple files upload middleware
export const uploadMultiple = (fieldName: string, maxCount: number = 5) => {
  return (req: Request, res: any, next: any) => {
    upload.array(fieldName, maxCount)(req, res, (error: any) => {
      if (error) {
        return next(handleMulterError(error));
      }
      next();
    });
  };
};

// Multiple fields upload middleware
export const uploadFields = (fields: { name: string; maxCount: number }[]) => {
  return (req: Request, res: any, next: any) => {
    upload.fields(fields)(req, res, (error: any) => {
      if (error) {
        return next(handleMulterError(error));
      }
      next();
    });
  };
}; 
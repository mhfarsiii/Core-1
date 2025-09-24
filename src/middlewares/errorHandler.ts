import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/interfaces';
import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  FileUploadError
} from '../types/errors';

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Global error handler:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle specific error types
  if (error instanceof ValidationError) {
    const response: ApiResponse = {
      message: 'Validation failed',
      error: error.message
    };
    res.status(400).json(response);
    return;
  }

  if (error instanceof AuthenticationError) {
    const response: ApiResponse = {
      message: 'Authentication failed',
      error: error.message
    };
    res.status(401).json(response);
    return;
  }

  if (error instanceof AuthorizationError) {
    const response: ApiResponse = {
      message: 'Access denied',
      error: error.message
    };
    res.status(403).json(response);
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

  if (error instanceof FileUploadError) {
    const response: ApiResponse = {
      message: 'File upload failed',
      error: error.message
    };
    res.status(400).json(response);
    return;
  }

  if (error instanceof DatabaseError) {
    const response: ApiResponse = {
      message: 'Database operation failed',
      error: process.env.NODE_ENV === 'production' 
        ? 'An internal error occurred' 
        : error.message
    };
    res.status(500).json(response);
    return;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    switch (prismaError.code) {
      case 'P2002':
        const response: ApiResponse = {
          message: 'Conflict',
          error: 'A record with this information already exists'
        };
        res.status(409).json(response);
        return;
        
      case 'P2025':
        const notFoundResponse: ApiResponse = {
          message: 'Resource not found',
          error: 'The requested resource was not found'
        };
        res.status(404).json(notFoundResponse);
        return;
        
      default:
        const dbErrorResponse: ApiResponse = {
          message: 'Database operation failed',
          error: process.env.NODE_ENV === 'production' 
            ? 'An internal error occurred' 
            : prismaError.message
        };
        res.status(500).json(dbErrorResponse);
        return;
    }
  }

  // Handle unknown errors
  const response: ApiResponse = {
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : error.message
  };
  
  res.status(500).json(response);
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    message: 'Route not found',
    error: `The route ${req.method} ${req.path} was not found`
  };
  
  res.status(404).json(response);
};


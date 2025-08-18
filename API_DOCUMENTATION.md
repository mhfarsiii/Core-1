# API Documentation - Portfolio Management System

## Overview
This API provides endpoints for managing a portfolio system with categories and works. It includes both admin endpoints (requiring authentication) and public endpoints for the website frontend.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Admin endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Admin Endpoints

### Categories Management

#### Create Category
- **POST** `/categories`
- **Description**: Create a new category
- **Authentication**: Required
- **Body**: `multipart/form-data`
  - `title` (string, required): Category title
  - `description` (string, optional): Category description
  - `image` (file, optional): Category image

#### Get All Categories
- **GET** `/categories`
- **Description**: Retrieve all categories with work counts
- **Authentication**: Required
- **Response**: Categories with `_count.works` field

#### Get Category by ID
- **GET** `/categories/:id`
- **Description**: Retrieve a specific category with its works
- **Authentication**: Required
- **Response**: Category with included works

#### Update Category
- **PUT** `/categories/:id`
- **Description**: Update an existing category
- **Authentication**: Required
- **Body**: `multipart/form-data`
  - `title` (string, optional): New title
  - `description` (string, optional): New description
  - `image` (file, optional): New image

#### Delete Category
- **DELETE** `/categories/:id`
- **Description**: Delete a category (cascades to works)
- **Authentication**: Required

### Works Management

#### Create Work
- **POST** `/works`
- **Description**: Create a new work within a category
- **Authentication**: Required
- **Body**: `multipart/form-data`
  - `title` (string, required): Work title
  - `description` (string, optional): Work description
  - `categoryId` (string, required): Category ID
  - `mainImage` (file, required): Main work image
  - `additionalImages` (files, optional): Additional images (max 10)
  - `videoLink` (string, optional): Video URL

#### Get All Works
- **GET** `/works`
- **Description**: Retrieve all works with category information
- **Authentication**: Required
- **Response**: Works with included category data

#### Get Work by ID
- **GET** `/works/:id`
- **Description**: Retrieve a specific work with category information
- **Authentication**: Required
- **Response**: Work with included category data

#### Get Works by Category
- **GET** `/works/category/:categoryId`
- **Description**: Retrieve all works in a specific category
- **Authentication**: Required
- **Response**: Works with included category data

#### Update Work
- **PUT** `/works/:id`
- **Description**: Update an existing work
- **Authentication**: Required
- **Body**: `multipart/form-data`
  - `title` (string, optional): New title
  - `description` (string, optional): New description
  - `categoryId` (string, optional): New category ID
  - `mainImage` (file, optional): New main image
  - `additionalImages` (files, optional): New additional images
  - `videoLink` (string, optional): New video URL

#### Delete Work
- **DELETE** `/works/:id`
- **Description**: Delete a work
- **Authentication**: Required

## Public Endpoints (Website Frontend)

### Get All Categories
- **GET** `/public/categories`
- **Description**: Retrieve all categories for public display
- **Authentication**: Not required
- **Response**: Categories with work counts

### Get Works by Category
- **GET** `/public/categories/:categoryId/works`
- **Description**: Retrieve all works in a specific category for public display
- **Authentication**: Not required
- **Response**: Works with category information

### Get Work Details
- **GET** `/public/works/:id`
- **Description**: Retrieve detailed work information with similar works
- **Authentication**: Not required
- **Response**: Work details with similar works from same category

### Get All Works
- **GET** `/public/works`
- **Description**: Retrieve all works for public display
- **Authentication**: Not required
- **Response**: Works with category information

## Data Models

### Category
```json
{
  "id": "string",
  "title": "string",
  "imageUrl": "string | null",
  "description": "string | null",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "_count": {
    "works": "number"
  }
}
```

### Work
```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "mainImageUrl": "string",
  "additionalImages": "string[]",
  "videoLink": "string | null",
  "categoryId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "category": {
    "id": "string",
    "title": "string"
  }
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## File Upload

### Supported Formats
- Images: JPG, PNG, GIF, WebP
- Maximum file size: 5MB (configurable)

### Upload Fields
- **Categories**: Single image upload
- **Works**: Multiple image uploads (main + additional)

## Example Usage

### Creating a Category
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer <token>" \
  -F "title=طراحی گرافیک" \
  -F "description=طراحی‌های خلاقانه و مدرن" \
  -F "image=@category-image.jpg"
```

### Creating a Work
```bash
curl -X POST http://localhost:3000/api/works \
  -H "Authorization: Bearer <token>" \
  -F "title=لوگو شرکت" \
  -F "description=لوگوی مدرن برای شرکت فناوری" \
  -F "categoryId=<category-id>" \
  -F "mainImage=@main-image.jpg" \
  -F "additionalImages=@image1.jpg" \
  -F "additionalImages=@image2.jpg" \
  -F "videoLink=https://youtube.com/watch?v=..."
```

### Getting Public Categories
```bash
curl http://localhost:3000/api/public/categories
```

## Frontend Integration

### Admin Panel
Access the admin panel at: `http://localhost:3000/admin-panel`

### Portfolio Website Demo
View the portfolio website demo at: `http://localhost:3000/portfolio-website`

## Error Handling

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `404`: Not Found
- `500`: Internal Server Error

## Security Features

- JWT-based authentication for admin endpoints
- File type validation for uploads
- File size limits
- CORS configuration for frontend integration
- Input validation and sanitization

## Database Schema

The system uses Prisma with MySQL and includes:
- **Admin**: User authentication
- **Category**: Portfolio categories with images
- **Work**: Portfolio works with multiple images and video links
- **Image**: Legacy image management
- **Text**: Legacy text content management

## Getting Started

1. Set up environment variables (see `.env.example`)
2. Run database migrations: `bun run db:migrate`
3. Start the server: `bun run dev`
4. Access admin panel or portfolio website demo
5. Use the API endpoints for your frontend integration


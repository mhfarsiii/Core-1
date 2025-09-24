import { Router } from 'express';
import { CategoryService } from '../services/categoryService';
import { WorkService } from '../services/workService';
import { ApiResponse } from '../types/interfaces';

const router = Router();
const categoryService = new CategoryService();
const workService = new WorkService();

// Get all categories for website display (GET)
router.get('/categories', async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    
    const response: ApiResponse = {
      message: 'Categories retrieved successfully',
      data: categories
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    const response: ApiResponse = {
      message: 'Failed to fetch categories',
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

// Get works by category for website display (GET)
router.get('/categories/:categoryId/works', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const parsedCategoryId = parseInt(categoryId);
    
    if (isNaN(parsedCategoryId)) {
      const response: ApiResponse = {
        message: 'Validation failed',
        error: 'Invalid category ID'
      };
      return res.status(400).json(response);
    }

    const works = await workService.getWorksByCategory(parsedCategoryId);
    
    const response: ApiResponse = {
      message: 'Works retrieved successfully',
      data: works
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching works:', error);
    const response: ApiResponse = {
      message: 'Failed to fetch works',
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

// Get work details for website display (GET)
router.get('/works/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workId = parseInt(id);
    
    if (isNaN(workId)) {
      const response: ApiResponse = {
        message: 'Validation failed',
        error: 'Invalid work ID'
      };
      return res.status(400).json(response);
    }

    const work = await workService.getWorkById(workId);
    
    if (!work) {
      const response: ApiResponse = {
        message: 'Resource not found',
        error: 'Work not found'
      };
      return res.status(404).json(response);
    }

    // Get similar works
    const similarWorks = await workService.getSimilarWorks(workId, 4);

    const response: ApiResponse = {
      message: 'Work retrieved successfully',
      data: {
        work,
        similarWorks
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching work:', error);
    const response: ApiResponse = {
      message: 'Failed to fetch work',
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

// Get all works for website display (GET)
router.get('/works', async (req, res) => {
  try {
    const works = await workService.getAllWorks();
    
    const response: ApiResponse = {
      message: 'Works retrieved successfully',
      data: works
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching works:', error);
    const response: ApiResponse = {
      message: 'Failed to fetch works',
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

export default router;

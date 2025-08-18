import { Request, Response } from 'express'
import { ImageService } from '../services/imageService'

const imageService = new ImageService()

export class ImageController {
  async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' })
      }

      const { title, description, category } = req.body
      if (!title) {
        return res.status(400).json({ error: 'Title is required' })
      }

      const imageUrl = `/uploads/${req.file.filename}`
      
      const result = await imageService.createImage({
        url: imageUrl,
        title,
        description,
        category
      })

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json({
        message: 'Image uploaded successfully',
        image: result.data
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      res.status(500).json({ error: 'Failed to upload image' })
    }
  }

  async getAllImages(req: Request, res: Response) {
    try {
      const result = await imageService.getAllImages()
      res.json(result)
    } catch (error) {
      console.error('Error fetching images:', error)
      res.status(500).json({ error: 'Failed to fetch images' })
    }
  }

  async getImagesByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params
      const result = await imageService.getImagesByCategory(category)
      res.json(result)
    } catch (error) {
      console.error('Error fetching images by category:', error)
      res.status(500).json({ error: 'Failed to fetch images' })
    }
  }

  async updateImage(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { title, description, category } = req.body
      
      const result = await imageService.updateImage(id, {
        title,
        description,
        category
      })

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        message: 'Image updated successfully',
        image: result.data
      })
    } catch (error) {
      console.error('Error updating image:', error)
      res.status(500).json({ error: 'Failed to update image' })
    }
  }

  async deleteImage(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await imageService.deleteImage(id)
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        message: 'Image deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting image:', error)
      res.status(500).json({ error: 'Failed to delete image' })
    }
  }

  async getImageById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await imageService.getImageById(id)
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result)
    } catch (error) {
      console.error('Error fetching image:', error)
      res.status(500).json({ error: 'Failed to fetch image' })
    }
  }
} 
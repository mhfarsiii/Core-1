// UserController - Complete user request handling
// Following Microsoft Principal Engineer best practices

import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import {
  UserRegistrationData,
  UserLoginData,
  UpdateUserData,
  CartItem,
  UserAuthenticatedRequest,
  ApiResponse
} from '../types/interfaces';
import { ValidationError, AuthenticationError } from '../types/errors';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Register new user
   * POST /api/users/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, confirmPassword }: UserRegistrationData = req.body;

      // Input validation
      if (!name || !email || !password || !confirmPassword) {
        res.status(400).json({
          error: 'Name, email, password, and confirm password are required'
        } as ApiResponse);
        return;
      }

      const registrationData: UserRegistrationData = {
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword
      };

      const result = await this.userService.registerUser(registrationData);

      res.status(201).json({
        message: 'User registered successfully',
        data: result
      } as ApiResponse);
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: error.message
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        error: 'Registration failed'
      } as ApiResponse);
    }
  }

  /**
   * User login
   * POST /api/users/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: UserLoginData = req.body;

      // Input validation
      if (!email || !password) {
        res.status(400).json({
          error: 'Email and password are required'
        } as ApiResponse);
        return;
      }

      const loginData: UserLoginData = {
        email: email.trim(),
        password
      };

      const result = await this.userService.loginUser(loginData);

      res.status(200).json({
        message: 'Login successful',
        data: result
      } as ApiResponse);
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: error.message
        } as ApiResponse);
        return;
      }

      if (error instanceof AuthenticationError) {
        res.status(401).json({
          error: error.message
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        error: 'Login failed'
      } as ApiResponse);
    }
  }

  /**
   * Get current user profile
   * GET /api/users/profile
   */
  async getProfile(req: UserAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated'
        } as ApiResponse);
        return;
      }

      const user = await this.userService.getUserById(req.user.id);
      
      if (!user) {
        res.status(404).json({
          error: 'User not found'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        message: 'Profile retrieved successfully',
        data: user
      } as ApiResponse);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Failed to get profile'
      } as ApiResponse);
    }
  }

  /**
   * Update user profile
   * PUT /api/users/profile
   */
  async updateProfile(req: UserAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated'
        } as ApiResponse);
        return;
      }

      const { name, email, password }: UpdateUserData = req.body;

      // At least one field must be provided
      if (!name && !email && !password) {
        res.status(400).json({
          error: 'At least one field (name, email, or password) must be provided'
        } as ApiResponse);
        return;
      }

      const updateData: UpdateUserData = {};
      
      if (name) updateData.name = name.trim();
      if (email) updateData.email = email.trim();
      if (password) updateData.password = password;

      const updatedUser = await this.userService.updateUser(req.user.id, updateData);

      res.status(200).json({
        message: 'Profile updated successfully',
        data: updatedUser
      } as ApiResponse);
    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: error.message
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        error: 'Failed to update profile'
      } as ApiResponse);
    }
  }

  /**
   * Update shopping cart
   * PUT /api/users/cart
   */
  async updateCart(req: UserAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated'
        } as ApiResponse);
        return;
      }

      const { cart }: { cart: CartItem[] } = req.body;

      if (!Array.isArray(cart)) {
        res.status(400).json({
          error: 'Cart must be an array'
        } as ApiResponse);
        return;
      }

      const updatedUser = await this.userService.updateShoppingCart(req.user.id, cart);

      res.status(200).json({
        message: 'Shopping cart updated successfully',
        data: updatedUser
      } as ApiResponse);
    } catch (error) {
      console.error('Update cart error:', error);
      
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: error.message
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        error: 'Failed to update shopping cart'
      } as ApiResponse);
    }
  }

  /**
   * Add item to cart
   * POST /api/users/cart/add
   */
  async addToCart(req: UserAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated'
        } as ApiResponse);
        return;
      }

      const { productId, productName, quantity, price, imageUrl }: Omit<CartItem, 'id'> = req.body;

      if (!productId || !productName || !quantity || price === undefined) {
        res.status(400).json({
          error: 'Product ID, name, quantity, and price are required'
        } as ApiResponse);
        return;
      }

      // Get current user to access cart
      const currentUser = await this.userService.getUserById(req.user.id);
      if (!currentUser) {
        res.status(404).json({
          error: 'User not found'
        } as ApiResponse);
        return;
      }

      const currentCart = currentUser.shoppingCart || [];
      
      // Check if item already exists in cart
      const existingItemIndex = currentCart.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId,
          productName,
          quantity,
          price,
          imageUrl
        };
        currentCart.push(newItem);
      }

      const updatedUser = await this.userService.updateShoppingCart(req.user.id, currentCart);

      res.status(200).json({
        message: 'Item added to cart successfully',
        data: updatedUser
      } as ApiResponse);
    } catch (error) {
      console.error('Add to cart error:', error);
      
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: error.message
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        error: 'Failed to add item to cart'
      } as ApiResponse);
    }
  }

  /**
   * Remove item from cart
   * DELETE /api/users/cart/remove/:itemId
   */
  async removeFromCart(req: UserAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated'
        } as ApiResponse);
        return;
      }

      const { itemId } = req.params;

      if (!itemId) {
        res.status(400).json({
          error: 'Item ID is required'
        } as ApiResponse);
        return;
      }

      // Get current user to access cart
      const currentUser = await this.userService.getUserById(req.user.id);
      if (!currentUser) {
        res.status(404).json({
          error: 'User not found'
        } as ApiResponse);
        return;
      }

      const currentCart = currentUser.shoppingCart || [];
      const updatedCart = currentCart.filter(item => item.id !== itemId);

      const updatedUser = await this.userService.updateShoppingCart(req.user.id, updatedCart);

      res.status(200).json({
        message: 'Item removed from cart successfully',
        data: updatedUser
      } as ApiResponse);
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({
        error: 'Failed to remove item from cart'
      } as ApiResponse);
    }
  }

  /**
   * Update favorite products
   * PUT /api/users/favorites
   */
  async updateFavorites(req: UserAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated'
        } as ApiResponse);
        return;
      }

      const { favorites }: { favorites: string[] } = req.body;

      if (!Array.isArray(favorites)) {
        res.status(400).json({
          error: 'Favorites must be an array'
        } as ApiResponse);
        return;
      }

      const updatedUser = await this.userService.updateFavoriteProducts(req.user.id, favorites);

      res.status(200).json({
        message: 'Favorite products updated successfully',
        data: updatedUser
      } as ApiResponse);
    } catch (error) {
      console.error('Update favorites error:', error);
      
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: error.message
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        error: 'Failed to update favorite products'
      } as ApiResponse);
    }
  }

  /**
   * Add product to favorites
   * POST /api/users/favorites/add
   */
  async addToFavorites(req: UserAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated'
        } as ApiResponse);
        return;
      }

      const { productId }: { productId: string } = req.body;

      if (!productId) {
        res.status(400).json({
          error: 'Product ID is required'
        } as ApiResponse);
        return;
      }

      // Get current user to access favorites
      const currentUser = await this.userService.getUserById(req.user.id);
      if (!currentUser) {
        res.status(404).json({
          error: 'User not found'
        } as ApiResponse);
        return;
      }

      const currentFavorites = currentUser.favoriteProducts || [];
      
      // Add to favorites if not already there
      if (!currentFavorites.includes(productId)) {
        currentFavorites.push(productId);
      }

      const updatedUser = await this.userService.updateFavoriteProducts(req.user.id, currentFavorites);

      res.status(200).json({
        message: 'Product added to favorites successfully',
        data: updatedUser
      } as ApiResponse);
    } catch (error) {
      console.error('Add to favorites error:', error);
      res.status(500).json({
        error: 'Failed to add product to favorites'
      } as ApiResponse);
    }
  }

  /**
   * Remove product from favorites
   * DELETE /api/users/favorites/remove/:productId
   */
  async removeFromFavorites(req: UserAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated'
        } as ApiResponse);
        return;
      }

      const { productId } = req.params;

      if (!productId) {
        res.status(400).json({
          error: 'Product ID is required'
        } as ApiResponse);
        return;
      }

      // Get current user to access favorites
      const currentUser = await this.userService.getUserById(req.user.id);
      if (!currentUser) {
        res.status(404).json({
          error: 'User not found'
        } as ApiResponse);
        return;
      }

      const currentFavorites = currentUser.favoriteProducts || [];
      const updatedFavorites = currentFavorites.filter(id => id !== productId);

      const updatedUser = await this.userService.updateFavoriteProducts(req.user.id, updatedFavorites);

      res.status(200).json({
        message: 'Product removed from favorites successfully',
        data: updatedUser
      } as ApiResponse);
    } catch (error) {
      console.error('Remove from favorites error:', error);
      res.status(500).json({
        error: 'Failed to remove product from favorites'
      } as ApiResponse);
    }
  }

  /**
   * Deactivate user account
   * DELETE /api/users/account
   */
  async deactivateAccount(req: UserAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated'
        } as ApiResponse);
        return;
      }

      await this.userService.deactivateUser(req.user.id);

      res.status(200).json({
        message: 'Account deactivated successfully'
      } as ApiResponse);
    } catch (error) {
      console.error('Deactivate account error:', error);
      res.status(500).json({
        error: 'Failed to deactivate account'
      } as ApiResponse);
    }
  }
}

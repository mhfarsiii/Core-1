// UserService - Complete user management service
// Following Microsoft Principal Engineer best practices

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from './prisma';
import {
  IUserService,
  UserRegistrationData,
  UserLoginData,
  CreateUserData,
  UserLoginResult,
  UserProfile,
  UpdateUserData,
  CartItem,
  UserJwtPayload,
  User
} from '../types/interfaces';
import { ValidationError, AuthenticationError } from '../types/errors';

export class UserService implements IUserService {
  private readonly jwtSecret: string;
  private readonly saltRounds: number = 12;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-user-secret';
    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET not set in environment variables');
    }
  }

  /**
   * Register a new user
   */
  async registerUser(data: UserRegistrationData): Promise<UserLoginResult> {
    try {
      // Input validation
      this.validateRegistrationData(data);

      // Check if user already exists
      const existingUser = await (prisma as any).user.findUnique({
        where: { email: data.email.toLowerCase() }
      });

      if (existingUser) {
        throw new ValidationError('User with this email already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, this.saltRounds);

      // Create user
      const createData: CreateUserData = {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: passwordHash
      };

      const user = await (prisma as any).user.create({
        data: {
          name: createData.name,
          email: createData.email,
          passwordHash: createData.password,
          isActive: true,
          emailVerified: false,
          shoppingCart: JSON.stringify([]),
          favoriteProducts: JSON.stringify([])
        }
      });

      // Generate JWT token
      const token = this.generateToken(user);

      // Return login result
      return {
        token,
        user: this.mapUserToProfile(user)
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AuthenticationError) {
        throw error;
      }
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  }

  /**
   * Login user
   */
  async loginUser(data: UserLoginData): Promise<UserLoginResult> {
    try {
      // Input validation
      this.validateLoginData(data);

      // Find user by email
      const user = await (prisma as any).user.findUnique({
        where: { 
          email: data.email.toLowerCase().trim(),
          isActive: true
        }
      });

      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Update last login
      await (prisma as any).user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        token,
        user: this.mapUserToProfile(user)
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AuthenticationError) {
        throw error;
      }
      console.error('Login error:', error);
      throw new AuthenticationError('Login failed');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserProfile | null> {
    try {
      const user = await (prisma as any).user.findUnique({
        where: { id, isActive: true }
      });

      if (!user) {
        return null;
      }

      return this.mapUserToProfile(user);
    } catch (error) {
      console.error('Get user error:', error);
      throw new Error('Failed to get user');
    }
  }

  /**
   * Update user profile
   */
  async updateUser(id: string, data: UpdateUserData): Promise<UserProfile> {
    try {
      // Validate update data
      this.validateUpdateData(data);

      const updateData: any = {};

      if (data.name) {
        updateData.name = data.name.trim();
      }

      if (data.email) {
        // Check if email is already taken by another user
        const existingUser = await (prisma as any).user.findFirst({
          where: {
            email: data.email.toLowerCase().trim(),
            id: { not: id }
          }
        });

        if (existingUser) {
          throw new ValidationError('Email is already taken');
        }

        updateData.email = data.email.toLowerCase().trim();
      }

      if (data.password) {
        if (data.password.length < 6) {
          throw new ValidationError('Password must be at least 6 characters long');
        }
        updateData.passwordHash = await bcrypt.hash(data.password, this.saltRounds);
      }

      const user = await (prisma as any).user.update({
        where: { id },
        data: updateData
      });

      return this.mapUserToProfile(user);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error('Update user error:', error);
      throw new Error('Failed to update user');
    }
  }

  /**
   * Update shopping cart
   */
  async updateShoppingCart(id: string, cart: CartItem[]): Promise<UserProfile> {
    try {
      // Validate cart items
      this.validateCartItems(cart);

      const user = await (prisma as any).user.update({
        where: { id },
        data: { shoppingCart: JSON.stringify(cart) }
      });

      return this.mapUserToProfile(user);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error('Update cart error:', error);
      throw new Error('Failed to update shopping cart');
    }
  }

  /**
   * Update favorite products
   */
  async updateFavoriteProducts(id: string, favorites: string[]): Promise<UserProfile> {
    try {
      // Validate favorites array
      if (!Array.isArray(favorites)) {
        throw new ValidationError('Favorites must be an array');
      }

      // Remove duplicates and filter out empty strings
      const uniqueFavorites = [...new Set(favorites.filter(id => id && typeof id === 'string'))];

      const user = await (prisma as any).user.update({
        where: { id },
        data: { favoriteProducts: JSON.stringify(uniqueFavorites) }
      });

      return this.mapUserToProfile(user);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error('Update favorites error:', error);
      throw new Error('Failed to update favorite products');
    }
  }

  /**
   * Verify JWT token and return user profile
   */
  async verifyToken(token: string): Promise<UserProfile> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as UserJwtPayload;
      
      const user = await this.getUserById(decoded.id);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('Invalid token');
      }
      if (error instanceof AuthenticationError) {
        throw error;
      }
      console.error('Token verification error:', error);
      throw new AuthenticationError('Token verification failed');
    }
  }

  /**
   * Deactivate user account
   */
  async deactivateUser(id: string): Promise<void> {
    try {
      await (prisma as any).user.update({
        where: { id },
        data: { isActive: false }
      });
    } catch (error) {
      console.error('Deactivate user error:', error);
      throw new Error('Failed to deactivate user');
    }
  }

  // ========================
  // Private Helper Methods
  // ========================

  private validateRegistrationData(data: UserRegistrationData): void {
    if (!data.name || data.name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters long');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      throw new ValidationError('Valid email is required');
    }

    if (!data.password || data.password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters long');
    }

    if (!data.confirmPassword) {
      throw new ValidationError('Password confirmation is required');
    }

    if (data.password !== data.confirmPassword) {
      throw new ValidationError('Passwords do not match');
    }
  }

  private validateLoginData(data: UserLoginData): void {
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new ValidationError('Valid email is required');
    }

    if (!data.password) {
      throw new ValidationError('Password is required');
    }
  }

  private validateUpdateData(data: UpdateUserData): void {
    if (data.name !== undefined && data.name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters long');
    }

    if (data.email !== undefined && !this.isValidEmail(data.email)) {
      throw new ValidationError('Valid email is required');
    }
  }

  private validateCartItems(cart: CartItem[]): void {
    if (!Array.isArray(cart)) {
      throw new ValidationError('Shopping cart must be an array');
    }

    for (const item of cart) {
      if (!item.id || !item.productId || !item.productName) {
        throw new ValidationError('Cart item must have id, productId, and productName');
      }

      if (typeof item.quantity !== 'number' || item.quantity < 1) {
        throw new ValidationError('Cart item quantity must be a positive number');
      }

      if (typeof item.price !== 'number' || item.price < 0) {
        throw new ValidationError('Cart item price must be a non-negative number');
      }
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateToken(user: User): string {
    const payload: UserJwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    return jwt.sign(payload, this.jwtSecret, { 
      expiresIn: '7d' // Token expires in 7 days
    });
  }

  private mapUserToProfile(user: User): UserProfile {
    let shoppingCart: CartItem[] = [];
    let favoriteProducts: string[] = [];

    // Parse JSON strings for SQLite compatibility
    try {
      shoppingCart = user.shoppingCart ? JSON.parse(user.shoppingCart) : [];
    } catch (error) {
      console.error('Error parsing shopping cart:', error);
      shoppingCart = [];
    }

    try {
      favoriteProducts = user.favoriteProducts ? JSON.parse(user.favoriteProducts) : [];
    } catch (error) {
      console.error('Error parsing favorite products:', error);
      favoriteProducts = [];
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      shoppingCart,
      favoriteProducts,
      createdAt: user.createdAt
    };
  }
}

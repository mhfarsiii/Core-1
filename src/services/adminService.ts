import prisma from './prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Admin } from '@prisma/client';
import { 
  AdminLoginData, 
  CreateAdminData, 
  LoginResult, 
  AdminProfile, 
  JwtPayload,
  IAdminService,
  UserStats,
  PaginatedUsers,
  UserProfile
} from '../types/interfaces';
import { 
  AuthenticationError, 
  ValidationError, 
  ConflictError, 
  NotFoundError, 
  DatabaseError 
} from '../types/errors';
import { config } from '../config/environment';

export class AdminService implements IAdminService {
  private readonly jwtSecret: string;
  private readonly bcryptRounds: number;
  private readonly tokenExpiration: string;

  constructor() {
    this.jwtSecret = config.auth.jwtSecret;
    this.bcryptRounds = config.auth.bcryptRounds;
    this.tokenExpiration = config.auth.tokenExpiration;
  }

  async createAdmin(data: CreateAdminData): Promise<Admin> {
    try {
      // Input validation
      if (!data.username || !data.password || !data.email) {
        throw new ValidationError('Username, password, and email are required');
      }

      if (data.password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters long');
      }

      // Check if admin already exists
      const existingAdmin = await prisma.admin.findFirst({
        where: {
          OR: [
            { username: data.username },
            { email: data.email }
          ]
        }
      });

      if (existingAdmin) {
        throw new ConflictError('Admin with this username or email already exists');
      }

      const hashedPassword = await bcrypt.hash(data.password, this.bcryptRounds);
      
      return await prisma.admin.create({
        data: {
          username: data.username,
          passwordHash: hashedPassword,
          email: data.email
        }
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ConflictError) {
        throw error;
      }
      throw new DatabaseError('Failed to create admin');
    }
  }

  async login(data: AdminLoginData): Promise<LoginResult> {
    try {
      // Input validation
      if (!data.username || !data.password) {
        throw new ValidationError('Username and password are required');
      }

      const admin = await prisma.admin.findUnique({
        where: { username: data.username }
      });

      if (!admin) {
        throw new AuthenticationError('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(data.password, admin.passwordHash);
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid credentials');
      }

      const payload: JwtPayload = {
        id: admin.id,
        username: admin.username,
        email: admin.email
      };

      const token = jwt.sign(payload, this.jwtSecret, { expiresIn: this.tokenExpiration } as jwt.SignOptions);

      return {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          createdAt: admin.createdAt
        }
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AuthenticationError) {
        throw error;
      }
      throw new DatabaseError('Login failed');
    }
  }

  async verifyToken(token: string): Promise<AdminProfile> {
    try {
      if (!token) {
        throw new AuthenticationError('No token provided');
      }

      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id }
      });
      
      if (!admin) {
        throw new NotFoundError('Admin not found');
      }

      return {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        createdAt: admin.createdAt
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Token expired');
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AuthenticationError('Token verification failed');
    }
  }

  async getAdminById(id: string): Promise<AdminProfile | null> {
    try {
      if (!id) {
        throw new ValidationError('Admin ID is required');
      }

      const admin = await prisma.admin.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true
        }
      });

      return admin;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Failed to fetch admin');
    }
  }

  // ========================
  // User Management Methods
  // ========================

  async getUserStats(): Promise<UserStats> {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const [
        totalUsers,
        activeUsers,
        verifiedUsers,
        usersRegisteredToday,
        usersRegisteredThisWeek,
        usersRegisteredThisMonth,
        recentUsers
      ] = await Promise.all([
        (prisma as any).user.count(),
        (prisma as any).user.count({ where: { isActive: true } }),
        (prisma as any).user.count({ where: { emailVerified: true } }),
        (prisma as any).user.count({ where: { createdAt: { gte: todayStart } } }),
        (prisma as any).user.count({ where: { createdAt: { gte: weekStart } } }),
        (prisma as any).user.count({ where: { createdAt: { gte: monthStart } } }),
        (prisma as any).user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
            emailVerified: true,
            createdAt: true,
            shoppingCart: true,
            favoriteProducts: true
          }
        })
      ]);

      const inactiveUsers = totalUsers - activeUsers;
      const unverifiedUsers = totalUsers - verifiedUsers;

      const recentRegistrations = recentUsers.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        shoppingCart: user.shoppingCart ? JSON.parse(user.shoppingCart) : [],
        favoriteProducts: user.favoriteProducts ? JSON.parse(user.favoriteProducts) : [],
        createdAt: user.createdAt
      }));

      return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        verifiedUsers,
        unverifiedUsers,
        usersRegisteredToday,
        usersRegisteredThisWeek,
        usersRegisteredThisMonth,
        recentRegistrations
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      throw new DatabaseError('Failed to get user statistics');
    }
  }

  async getAllUsers(page: number = 1, limit: number = 20): Promise<PaginatedUsers> {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        (prisma as any).user.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
            emailVerified: true,
            lastLoginAt: true,
            createdAt: true,
            shoppingCart: true,
            favoriteProducts: true
          }
        }),
        (prisma as any).user.count()
      ]);

      const mappedUsers = users.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLoginAt: user.lastLoginAt,
        shoppingCart: user.shoppingCart ? JSON.parse(user.shoppingCart) : [],
        favoriteProducts: user.favoriteProducts ? JSON.parse(user.favoriteProducts) : [],
        createdAt: user.createdAt
      }));

      return {
        users: mappedUsers,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Get all users error:', error);
      throw new DatabaseError('Failed to get users');
    }
  }

  async getUserById(id: string): Promise<UserProfile | null> {
    try {
      if (!id) {
        throw new ValidationError('User ID is required');
      }

      const user = await (prisma as any).user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          shoppingCart: true,
          favoriteProducts: true
        }
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLoginAt: user.lastLoginAt,
        shoppingCart: user.shoppingCart ? JSON.parse(user.shoppingCart) : [],
        favoriteProducts: user.favoriteProducts ? JSON.parse(user.favoriteProducts) : [],
        createdAt: user.createdAt
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error('Get user by ID error:', error);
      throw new DatabaseError('Failed to get user');
    }
  }

  async deactivateUser(id: string): Promise<void> {
    try {
      if (!id) {
        throw new ValidationError('User ID is required');
      }

      const user = await (prisma as any).user.findUnique({
        where: { id },
        select: { id: true, isActive: true }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (!user.isActive) {
        throw new ValidationError('User is already deactivated');
      }

      await (prisma as any).user.update({
        where: { id },
        data: { isActive: false }
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      console.error('Deactivate user error:', error);
      throw new DatabaseError('Failed to deactivate user');
    }
  }

  async activateUser(id: string): Promise<void> {
    try {
      if (!id) {
        throw new ValidationError('User ID is required');
      }

      const user = await (prisma as any).user.findUnique({
        where: { id },
        select: { id: true, isActive: true }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.isActive) {
        throw new ValidationError('User is already active');
      }

      await (prisma as any).user.update({
        where: { id },
        data: { isActive: true }
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      console.error('Activate user error:', error);
      throw new DatabaseError('Failed to activate user');
    }
  }
} 
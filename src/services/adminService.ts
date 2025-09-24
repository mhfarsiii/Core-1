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
  IAdminService 
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
} 
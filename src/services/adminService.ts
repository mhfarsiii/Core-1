import prisma from './prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export interface AdminLoginData {
  username: string
  password: string
}

export interface CreateAdminData {
  username: string
  password: string
  email: string
}

export class AdminService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

  async createAdmin(data: CreateAdminData) {
    const rounds = Number(process.env.BCRYPT_ROUNDS || 10)
    const hashedPassword = await bcrypt.hash(data.password, rounds)
    
    return await prisma.admin.create({
      data: {
        username: data.username,
        passwordHash: hashedPassword,
        email: data.email
      }
    })
  }

  async login(data: AdminLoginData) {
    const admin = await prisma.admin.findUnique({
      where: { username: data.username }
    })

    if (!admin) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await bcrypt.compare(data.password, admin.passwordHash)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username,
        email: admin.email 
      },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    )

    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    }
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id }
      })
      
      if (!admin) {
        throw new Error('Admin not found')
      }

      return {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        createdAt: admin.createdAt
      }
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  async getAdminById(id: string) {
    return await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    })
  }
} 
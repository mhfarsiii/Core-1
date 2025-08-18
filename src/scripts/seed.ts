import prisma from '../services/prisma'
import bcrypt from 'bcrypt'

async function seed() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Create admin user if it doesn't exist
    const adminExists = await prisma.admin.findFirst()
    
    if (!adminExists) {
      const rounds = Number(process.env.BCRYPT_ROUNDS || 10)
      const hashedPassword = await bcrypt.hash('admin123', rounds)
      
      const admin = await prisma.admin.create({
        data: {
          username: 'admin',
          email: 'admin@yourportfolio.com',
          passwordHash: hashedPassword
        }
      })
      
      console.log('✅ Admin user created:', admin.username)
      console.log('🎯 Username: admin')
      console.log('🔑 Password: admin123')
      console.log('⚠️  Change this password after first login!')
    } else {
      console.log('✅ Admin user already exists')
    }
    
    console.log('✨ Seeding completed successfully!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seed() 
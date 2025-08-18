import { Router } from 'express'
import { AdminController } from '../controllers/adminController'
import { authMiddleware } from '../middlewares/auth'

const router = Router()
const adminController = new AdminController()

// Public routes
router.get('/', (req, res) => {
  res.json({
    message: 'Admin API is running',
    endpoints: {
      'POST /login': 'Login to admin panel',
      'POST /register': 'Create admin account (first time only)',
      'GET /profile': 'Get admin profile (requires authentication)'
    }
  })
})

// Login endpoint
router.post('/login', adminController.login)

// Temporary endpoint to create admin user (remove in production)
router.post('/create-admin', async (req, res) => {
  try {
    const { username, password, email } = req.body
    
    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        error: 'نام کاربری، رمز عبور و ایمیل الزامی است'
      })
    }

    const adminService = new (await import('../services/adminService')).AdminService()
    const admin = await adminService.createAdmin({ username, password, email })
    
    res.status(201).json({
      success: true,
      message: 'کاربر ادمین با موفقیت ایجاد شد',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'کاربر با این نام کاربری یا ایمیل قبلاً وجود دارد'
      })
    }
    
    res.status(500).json({
      success: false,
      error: 'خطا در ایجاد کاربر ادمین: ' + error.message
    })
  }
})

// Protected routes
router.get('/profile', authMiddleware, adminController.getProfile)

export default router 
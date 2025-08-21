import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import imageRoutes from './routes/imageRoutes'
import textRoutes from './routes/textRoutes'
import adminRoutes from './routes/adminRoutes'
import categoryRoutes from './routes/categoryRoutes'
import workRoutes from './routes/workRoutes'
import publicRoutes from './routes/publicRoutes'


// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Subdomain detection middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const host = req.get('host') || ''
  const subdomain = host.split('.')[0]
  
  // Add subdomain to request object
  ;(req as any).subdomain = subdomain
  
  next()
})

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:3000', 
    'http://localhost:3001',
    'http://195.248.240.98:3000',
    'https://hamedaei.com',
    'https://www.hamedaei.com',
    'https://api.hamedaei.com',
    'https://admin.hamedaei.com',
    'https://cdn.hamedaei.com'
  ],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Serve examples folder (HTML files)
app.use('/examples', express.static(path.join(__dirname, '../examples')))

// Root endpoint - helpful for IP access (must be before other routes)
app.get('/', (req, res) => {
  const host = req.get('host') || ''
  const subdomain = (req as any).subdomain || 'none'
  
  // If it's not a hamedaei.com domain, show API info
  if (!host.includes('hamedaei.com')) {
    res.json({
      message: 'Personal Portfolio API',
      status: 'running',
      access_type: 'direct_ip',
      host: host,
      subdomain: subdomain,
      endpoints: {
        health: '/health',
        images: '/api/images',
        texts: '/api/texts',
        admin: '/api/admin', 
        categories: '/api/categories',
        works: '/api/works',
        public: '/api/public'
      },
      examples: {
        admin_panel: '/admin-panel',
        upload_example: '/upload-example',
        portfolio_website: '/portfolio-website'
      },
      note: 'Use /api/ prefix for all API endpoints when accessing via IP'
    })
    return
  }
  
  // Handle domain-specific routing
  switch(subdomain) {
    case 'admin':
      res.sendFile(path.join(__dirname, '../examples/admin-panel.html'))
      break
    case 'www':
    case '':
    default:
      res.sendFile(path.join(__dirname, '../examples/portfolio-website.html'))
      break
  }
})

// API Routes - Always mount these for development/direct IP access
app.use('/api/images', imageRoutes)
app.use('/api/texts', textRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/works', workRoutes)
app.use('/api/public', publicRoutes)

// Domain-specific API routes (for api.hamedaei.com without /api prefix)
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const host = req.get('host') || ''
  const subdomain = (req as any).subdomain
  
  // Only add these routes for api.hamedaei.com
  if (host.includes('hamedaei.com') && subdomain === 'api') {
    // Mount routes without /api prefix
    app.use('/images', imageRoutes)
    app.use('/texts', textRoutes)
    app.use('/admin', adminRoutes)
    app.use('/categories', categoryRoutes)
    app.use('/works', workRoutes)
    app.use('/public', publicRoutes)
  }
  
  next()
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Personal Portfolio API is running',
    environment: process.env.NODE_ENV || 'development',
    subdomain: (req as any).subdomain || 'none',
    host: req.get('host') || '',
    endpoints: {
      images: '/api/images',
      texts: '/api/texts',
      admin: '/api/admin',
      categories: '/api/categories',
      works: '/api/works',
      public: '/api/public'
    }
  })
})

// Test route for admin panel
app.get('/admin-panel', (req, res) => {
  res.sendFile(path.join(__dirname, '../examples/admin-panel.html'))
})

app.get('/upload-example', (req, res) => {
  res.sendFile(path.join(__dirname, '../examples/upload-example.html'))
})

app.get('/portfolio-website', (req, res) => {
  res.sendFile(path.join(__dirname, '../examples/portfolio-website.html'))
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Start server
app.listen(Number(PORT) , '0.0.0.0',() => {
  const apiDomain = process.env.API_DOMAIN || 'localhost'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseUrl = process.env.NODE_ENV === 'production' ? `${protocol}://${apiDomain}` : `http://localhost:${PORT}`
  
  
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📄 Examples: ${baseUrl}/examples/`)
  }
  
}) 
import express from 'express';
import cors from 'cors';
import path from 'path';
import compression from 'compression';
import helmet from 'helmet';

// Import configuration and middlewares
import { config } from './config/environment';
import { globalErrorHandler, notFoundHandler } from './middlewares/errorHandler';

// Import routes
import imageRoutes from './routes/imageRoutes';
import textRoutes from './routes/textRoutes';
import adminRoutes from './routes/adminRoutes';
import categoryRoutes from './routes/categoryRoutes';
import workRoutes from './routes/workRoutes';
import publicRoutes from './routes/publicRoutes';

const app = express();
const PORT = config.server.port;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for API
  crossOriginEmbedderPolicy: false
}));

// Compression middleware
app.use(compression());

// Trust proxy for accurate client IP (important for rate limiting)
app.set('trust proxy', 1);

// Subdomain detection middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const host = req.get('host') || '';
  const subdomain = host.split('.')[0];
  
  // Add subdomain to request object
  (req as any).subdomain = subdomain;
  
  next();
});

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all localhost origins
    if (config.server.nodeEnv === 'development') {
      const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
      if (isLocalhost) return callback(null, true);
    }
    
    // Check against configured origins
    if (config.cors.origins.includes(origin)) {
      return callback(null, true);
    }
    
    // Reject other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware with size limits
app.use(express.json({ 
  limit: '10mb',
  strict: true
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb'
}));

// Serve static files with proper caching
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// Serve examples folder (HTML files)
app.use('/examples', express.static(path.join(__dirname, '../examples'), {
  maxAge: '1h',
  etag: true
}));

// Root endpoint - helpful for IP access (must be before other routes)
app.get('/', (req: express.Request, res: express.Response) => {
  const host = req.get('host') || '';
  const subdomain = (req as any).subdomain || 'none';
  
  // If it's not a hamedaei.com domain, show API info
  if (!host.includes('hamedaei.com')) {
    res.json({
      message: 'Personal Portfolio API',
      status: 'running',
      version: '1.0.0',
      environment: config.server.nodeEnv,
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
    });
    return;
  }
  
  // Handle domain-specific routing
  try {
    switch(subdomain) {
      case 'admin':
        res.sendFile(path.join(__dirname, '../examples/admin-panel.html'));
        break;
      case 'www':
      case '':
      default:
        res.sendFile(path.join(__dirname, '../examples/portfolio-website.html'));
        break;
    }
  } catch (error) {
    console.error('Error serving static file:', error);
    res.status(500).json({
      message: 'Error serving content',
      error: 'Internal server error'
    });
  }
});

// API Routes - Always mount these for development/direct IP access
app.use('/api/images', imageRoutes);
app.use('/api/texts', textRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/works', workRoutes);
app.use('/api/public', publicRoutes);

// Domain-specific API routes (for api.hamedaei.com without /api prefix)
// Note: Mounting routes conditionally for api.hamedaei.com subdomain
const host = process.env.API_DOMAIN || 'localhost';
if (host.includes('hamedaei.com')) {
  // Mount routes without /api prefix for api.hamedaei.com
  app.use('/images', imageRoutes);
  app.use('/texts', textRoutes);
  app.use('/admin', adminRoutes);
  app.use('/categories', categoryRoutes);
  app.use('/works', workRoutes);
  app.use('/public', publicRoutes);
}

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  const healthData = {
    status: 'OK',
    message: 'Personal Portfolio API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.server.nodeEnv,
    subdomain: (req as any).subdomain || 'none',
    host: req.get('host') || '',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    endpoints: {
      images: '/api/images',
      texts: '/api/texts',
      admin: '/api/admin',
      categories: '/api/categories',
      works: '/api/works',
      public: '/api/public'
    }
  };
  
  res.status(200).json(healthData);
});

// Test routes for examples
app.get('/admin-panel', (req: express.Request, res: express.Response) => {
  try {
    res.sendFile(path.join(__dirname, '../examples/admin-panel.html'));
  } catch (error) {
    res.status(404).json({ message: 'Admin panel example not found' });
  }
});

app.get('/upload-example', (req: express.Request, res: express.Response) => {
  try {
    res.sendFile(path.join(__dirname, '../examples/upload-example.html'));
  } catch (error) {
    res.status(404).json({ message: 'Upload example not found' });
  }
});

app.get('/portfolio-website', (req: express.Request, res: express.Response) => {
  try {
    res.sendFile(path.join(__dirname, '../examples/portfolio-website.html'));
  } catch (error) {
    res.status(404).json({ message: 'Portfolio website example not found' });
  }
});

// 404 handler for undefined routes (must be before error handler)
app.use(notFoundHandler);

// Global error handling middleware (must be last)
app.use(globalErrorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  const protocol = config.server.nodeEnv === 'production' ? 'https' : 'http';
  const baseUrl = config.server.nodeEnv === 'production' 
    ? `${protocol}://${config.server.apiDomain}` 
    : `http://localhost:${PORT}`;
  
  console.log(`🚀 Personal Portfolio API is running`);
  console.log(`📡 Server: ${baseUrl}`);
  console.log(`🌍 Environment: ${config.server.nodeEnv}`);
  console.log(`💾 Database: Connected`);
  
  if (config.server.nodeEnv !== 'production') {
    console.log(`📄 Examples: ${baseUrl}/examples/`);
    console.log(`🏥 Health Check: ${baseUrl}/health`);
    console.log(`📚 API Documentation: Available at root endpoint`);
  }
  
  console.log(`✅ Server started successfully on port ${PORT}`);
});

// Handle server errors
server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});

export default app; 
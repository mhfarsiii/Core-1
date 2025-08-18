"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
const textRoutes_1 = __importDefault(require("./routes/textRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const workRoutes_1 = __importDefault(require("./routes/workRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Subdomain detection middleware
app.use((req, res, next) => {
    const host = req.get('host') || '';
    const subdomain = host.split('.')[0];
    req.subdomain = subdomain;
    console.log(`🌐 Request from subdomain: ${subdomain}`);
    next();
});
// CORS configuration
app.use((0, cors_1.default)({
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
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve uploaded files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Serve examples folder (HTML files)
app.use('/examples', express_1.default.static(path_1.default.join(__dirname, '../examples')));
// Root endpoint - helpful for IP access (must be before other routes)
app.get('/', (req, res) => {
    const host = req.get('host') || '';
    const subdomain = req.subdomain || 'none';
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
        });
        return;
    }
    // Handle domain-specific routing
    switch (subdomain) {
        case 'admin':
            res.sendFile(path_1.default.join(__dirname, '../examples/admin-panel.html'));
            break;
        case 'www':
        case '':
        default:
            res.sendFile(path_1.default.join(__dirname, '../examples/portfolio-website.html'));
            break;
    }
});
// API Routes - Always mount these for development/direct IP access
app.use('/api/images', imageRoutes_1.default);
app.use('/api/texts', textRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/works', workRoutes_1.default);
app.use('/api/public', publicRoutes_1.default);
// Domain-specific API routes (for api.hamedaei.com without /api prefix)
app.use((req, res, next) => {
    const host = req.get('host') || '';
    const subdomain = req.subdomain;
    // Only add these routes for api.hamedaei.com
    if (host.includes('hamedaei.com') && subdomain === 'api') {
        // Mount routes without /api prefix
        app.use('/images', imageRoutes_1.default);
        app.use('/texts', textRoutes_1.default);
        app.use('/admin', adminRoutes_1.default);
        app.use('/categories', categoryRoutes_1.default);
        app.use('/works', workRoutes_1.default);
        app.use('/public', publicRoutes_1.default);
    }
    next();
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Personal Portfolio API is running',
        environment: process.env.NODE_ENV || 'development',
        subdomain: req.subdomain || 'none',
        host: req.get('host') || '',
        endpoints: {
            images: '/api/images',
            texts: '/api/texts',
            admin: '/api/admin',
            categories: '/api/categories',
            works: '/api/works',
            public: '/api/public'
        }
    });
});
// Test route for admin panel
app.get('/admin-panel', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../examples/admin-panel.html'));
});
app.get('/upload-example', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../examples/upload-example.html'));
});
app.get('/portfolio-website', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../examples/portfolio-website.html'));
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Start server
app.listen(Number(PORT), '0.0.0.0', () => {
    const apiDomain = process.env.API_DOMAIN || 'localhost';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = process.env.NODE_ENV === 'production' ? `${protocol}://${apiDomain}` : `http://localhost:${PORT}`;
    console.log(`🚀 Personal Portfolio API is running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Domain: ${apiDomain}`);
    console.log(`📁 Uploads directory: ${path_1.default.join(__dirname, '../uploads')}`);
    console.log(`🔗 Health check: ${baseUrl}/health`);
    console.log(`🖼️  Image API: ${baseUrl}/images`);
    console.log(`📝 Text API: ${baseUrl}/texts`);
    console.log(`👤 Admin API: ${baseUrl}/admin`);
    console.log(`🏷️  Category API: ${baseUrl}/categories`);
    console.log(`💼 Work API: ${baseUrl}/works`);
    console.log(`🌐 Public API: ${baseUrl}/public`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`📄 Examples: ${baseUrl}/examples/`);
    }
    console.log(`\n🔧 API is configured for domain: ${apiDomain}`);
    console.log(`🔒 CORS enabled for: ${process.env.CORS_ORIGIN || 'default origins'}`);
});
//# sourceMappingURL=server.js.map
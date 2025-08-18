# 🚀 Setup Guide - Image Upload API

## 📋 Prerequisites

1. **MySQL Database** - Make sure you have MySQL running
2. **Bun Runtime** - Install Bun if you haven't already: `curl -fsSL https://bun.sh/install | bash`

## 🛠️ Step-by-Step Setup

### 1. Install Dependencies
```bash
bun install
```

### 2. Configure Database
Edit `.env` file and update the `DATABASE_URL`:
```env
DATABASE_URL="mysql://username:password@localhost:3306/image_upload_db"
PORT=3000
NODE_ENV=development
```

### 3. Create Database
```bash
# Create a new MySQL database
mysql -u root -p -e "CREATE DATABASE image_upload_db;"
```

### 4. Generate Prisma Client
```bash
bun run db:generate
```

### 5. Push Database Schema
```bash
bun run db:push
```

### 6. Seed Database (Optional)
```bash
bun run db:seed
```

### 7. Start Development Server
```bash
bun run dev
```

## 🧪 Testing the API

### Option 1: Use the HTML Test Page
1. Open `examples/upload-example.html` in your browser
2. Upload images and test the functionality

### Option 2: Use curl
```bash
# Test health endpoint
curl http://localhost:3000/health

# Get all images
curl http://localhost:3000/api/images

# Upload an image
curl -X POST -F "image=@path/to/your/image.jpg" -F "title=My Image" http://localhost:3000/api/images
```

### Option 3: Use Postman
- Import the collection from `examples/` folder
- Test all endpoints

## 📁 Project Structure
```
project-1/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Custom middleware (multer)
│   ├── routes/          # API routes
│   ├── services/        # Business logic & Prisma
│   └── server.ts        # Main server file
├── prisma/
│   └── schema.prisma    # Database schema
├── uploads/             # Image storage
├── examples/            # Test files
└── .env                 # Environment variables
```

## 🔧 Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build TypeScript to JavaScript
- `bun run start` - Start production server
- `bun run db:generate` - Generate Prisma client
- `bun run db:push` - Push schema to database
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Prisma Studio
- `bun run db:seed` - Seed database with default data

## 🌐 API Endpoints

- `GET /health` - Server health check
- `POST /api/images` - Upload image (multipart/form-data)
- `GET /api/images` - Get all images

## 🖼️ Image Upload

Images are stored in the `uploads/` directory and served at `/uploads/` endpoint.

**Supported formats:** JPG, PNG, GIF, WebP
**Max file size:** 5MB

## 🔒 CORS Configuration

CORS is enabled for:
- `http://localhost:3000` (API server)
- `http://localhost:3001` (Nuxt frontend)

## 🐛 Troubleshooting

### Database Connection Issues
1. Check if MySQL is running
2. Verify database credentials in `.env`
3. Ensure database exists: `mysql -u root -p -e "CREATE DATABASE image_upload_db;"`

### Port Already in Use
Change the port in `.env` file:
```env
PORT=3001
```

### File Upload Issues
1. Check `uploads/` directory permissions
2. Ensure file size is under 5MB
3. Verify file is an image format

## 📚 Next Steps

1. **Authentication** - Add user login/registration
2. **Image Processing** - Add image resizing/compression
3. **Cloud Storage** - Move to AWS S3 or similar
4. **Frontend** - Build Nuxt.js frontend
5. **Testing** - Add unit and integration tests

## 🆘 Need Help?

- Check the console logs for error messages
- Verify all environment variables are set
- Ensure all dependencies are installed
- Check database connection and schema 
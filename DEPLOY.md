# 🚀 Portfolio Core - Cloud Deployment

## 📋 Requirements for Cloud Server

### Essential Files:
- ✅ `Dockerfile` - Main container configuration
- ✅ `docker-compose.yml` - Container orchestration
- ✅ `.dockerignore` - Build optimization
- ✅ `package.json` & `package-lock.json` - Dependencies
- ✅ `src/` - Source code
- ✅ `prisma/` - Database schema
- ✅ `tsconfig.json` - TypeScript configuration

### Environment Variables:
Create `.env` file with:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=your_domain
```

## 🐳 Quick Deploy

### 1. Build and Run
```bash
# Build image
docker build -t portfolio-core .

# Run container
docker run -d \
  --name portfolio-core \
  -p 3000:3000 \
  -v $(pwd)/uploads:/app/uploads \
  --env-file .env \
  portfolio-core
```

### 2. Using Docker Compose
```bash
docker-compose up -d
```

### 3. Stop and Remove
```bash
docker-compose down
# or
docker stop portfolio-core && docker rm portfolio-core
```

## 🌐 Access Points
- **API**: http://your-domain:3000
- **Health**: http://your-domain:3000/health
- **Examples**: http://your-domain:3000/examples/

## 📁 Volume Mounts
- `./uploads` → `/app/uploads` (persistent file storage)

## 🔧 Container Management
```bash
# View logs
docker logs portfolio-core

# Restart
docker restart portfolio-core

# Update (rebuild and restart)
docker-compose down
docker-compose up -d --build
```

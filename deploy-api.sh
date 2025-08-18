#!/bin/bash

# Deployment script for api.hamedaei.com
# This script helps you deploy your portfolio API to the api.hamedaei.com domain

echo "🚀 Portfolio API Deployment Script for api.hamedaei.com"
echo "=============================================="

# Check if required files exist
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found!"
    exit 1
fi

if [ ! -f "nginx.conf" ]; then
    echo "❌ nginx.conf not found!"
    exit 1
fi

# Create SSL directory if it doesn't exist
echo "📁 Creating SSL directory..."
mkdir -p ssl

# Check if SSL certificates exist
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    echo "⚠️  SSL certificates not found!"
    echo "Please place your SSL certificates in the ssl/ directory:"
    echo "  - ssl/cert.pem (certificate file)"
    echo "  - ssl/key.pem (private key file)"
    echo ""
    echo "You can obtain SSL certificates from:"
    echo "  - Let's Encrypt (free): https://letsencrypt.org/"
    echo "  - Your domain provider"
    echo "  - CloudFlare (if using their proxy)"
    echo ""
    read -p "Do you want to continue without SSL? (y/N): " -n 1 -r
    echo
    if [[ ! $GREP_OPTIONS =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Set environment variables if not already set
if [ -z "$JWT_SECRET" ]; then
    echo "⚠️  JWT_SECRET not set. Using default (change this in production!)"
    export JWT_SECRET="your-jwt-secret-change-this"
fi

if [ -z "$ADMIN_PASSWORD" ]; then
    echo "⚠️  ADMIN_PASSWORD not set. Using default (change this!)"
    export ADMIN_PASSWORD="changeme123"
fi

# Build and start the containers
echo "🏗️  Building Docker containers..."
docker-compose down
docker-compose build --no-cache

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "🌐 Your API is now available at:"
    echo "   - HTTP: http://api.hamedaei.com (redirects to HTTPS)"
    echo "   - HTTPS: https://api.hamedaei.com"
    echo ""
    echo "📋 API Endpoints:"
    echo "   - Health Check: https://api.hamedaei.com/health"
    echo "   - Images: https://api.hamedaei.com/images"
    echo "   - Texts: https://api.hamedaei.com/texts"
    echo "   - Categories: https://api.hamedaei.com/categories"
    echo "   - Works: https://api.hamedaei.com/works"
    echo "   - Admin: https://api.hamedaei.com/admin"
    echo "   - Public: https://api.hamedaei.com/public"
    echo ""
    echo "🔧 Next steps:"
    echo "   1. Update your DNS to point api.hamedaei.com to this server"
    echo "   2. Test the API endpoints"
    echo "   3. Update your frontend to use the new API URL"
    echo ""
    echo "📝 Logs: docker-compose logs -f"
else
    echo "❌ Services failed to start. Check logs: docker-compose logs"
    exit 1
fi

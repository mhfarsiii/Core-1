📋 Setup Instructions for api.hamedaei.com

🔧 Before running on server, you need to:

1. Copy this file as .env:
   cp env.example .env

2. Edit .env file with these values:
   NODE_ENV=production
   API_DOMAIN=api.hamedaei.com
   BASE_URL=https://api.hamedaei.com
   CORS_ORIGIN=https://hamedaei.com,https://www.hamedaei.com,https://api.hamedaei.com,https://admin.hamedaei.com,https://cdn.hamedaei.com
   JWT_SECRET=your-super-secure-secret
   ADMIN_PASSWORD=your-secure-password

3. Get SSL certificates and place them in ssl/ directory:
   ssl/cert.pem
   ssl/key.pem

4. Run deployment:
   ./deploy-api.sh

5. Test the API:
   ./test-api.sh

Your API will be available at https://api.hamedaei.com

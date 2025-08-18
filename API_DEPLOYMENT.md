# API Deployment Guide for api.hamedaei.com

This guide will help you deploy your Portfolio API to the `api.hamedaei.com` domain.

## Prerequisites

1. **Domain Setup**: Ensure you have control over the `hamedaei.com` domain
2. **DNS Configuration**: Point `api.hamedaei.com` to your server's IP address
3. **SSL Certificates**: Obtain SSL certificates for `api.hamedaei.com`
4. **Docker & Docker Compose**: Installed on your server

## Quick Deployment

### 1. SSL Certificates

First, obtain SSL certificates and place them in the `ssl/` directory:

```bash
# Create SSL directory
mkdir -p ssl/

# For Let's Encrypt (recommended):
# Install certbot first, then:
certbot certonly --standalone -d api.hamedaei.com

# Copy certificates
cp /etc/letsencrypt/live/api.hamedaei.com/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/api.hamedaei.com/privkey.pem ssl/key.pem
```

### 2. Environment Variables

Set up your environment variables:

```bash
# Required environment variables
export JWT_SECRET="your-super-secure-jwt-secret-here"
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="your-secure-admin-password"

# Optional: Database URL (if using external database)
export DATABASE_URL="postgresql://user:pass@host:5432/portfolio_db"
```

### 3. Deploy

Run the deployment script:

```bash
./deploy-api.sh
```

Or manually deploy:

```bash
# Build and start services
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

## API Endpoints

Once deployed, your API will be available at:

- **Base URL**: `https://api.hamedaei.com`
- **Health Check**: `https://api.hamedaei.com/health`

### Available Endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/images` | GET, POST, PUT, DELETE | Image management |
| `/texts` | GET, POST, PUT, DELETE | Text content management |
| `/categories` | GET, POST, PUT, DELETE | Category management |
| `/works` | GET, POST, PUT, DELETE | Portfolio works |
| `/admin` | POST | Admin authentication |
| `/public` | GET | Public content |

## Configuration Details

### Nginx Configuration
- HTTP traffic redirects to HTTPS
- SSL/TLS termination
- Security headers included
- CORS headers configured

### Docker Services
- **portfolio-api**: Node.js application (port 3000)
- **nginx**: Reverse proxy (ports 80, 443)

### Environment Variables
- `NODE_ENV=production`
- `DOMAIN=hamedaei.com`
- `API_DOMAIN=api.hamedaei.com`
- `CORS_ORIGIN` includes all subdomains

## DNS Configuration

Configure your DNS with these records:

```
Type: A
Name: api.hamedaei.com
Value: YOUR_SERVER_IP
TTL: 300
```

## SSL Certificate Renewal

For Let's Encrypt certificates, set up auto-renewal:

```bash
# Add to crontab
crontab -e

# Add this line for automatic renewal
0 12 * * * /usr/bin/certbot renew --quiet && docker-compose restart nginx
```

## Troubleshooting

### Check Logs
```bash
# API logs
docker-compose logs portfolio-api

# Nginx logs
docker-compose logs nginx

# All logs
docker-compose logs -f
```

### Test SSL
```bash
# Test SSL configuration
openssl s_client -connect api.hamedaei.com:443 -servername api.hamedaei.com
```

### Test API
```bash
# Health check
curl https://api.hamedaei.com/health

# With verbose output
curl -v https://api.hamedaei.com/health
```

### Common Issues

1. **502 Bad Gateway**: API container not running
   ```bash
   docker-compose restart portfolio-api
   ```

2. **SSL Certificate Error**: Check certificate paths in nginx.conf
   ```bash
   # Verify certificates exist
   ls -la ssl/
   ```

3. **CORS Issues**: Check CORS_ORIGIN environment variable
   ```bash
   docker-compose exec portfolio-api env | grep CORS
   ```

## Security Considerations

1. **Change Default Passwords**: Update JWT_SECRET and ADMIN_PASSWORD
2. **Firewall**: Only allow ports 80, 443, and SSH
3. **Regular Updates**: Keep Docker images and SSL certificates updated
4. **Monitoring**: Set up monitoring for the API endpoints

## Support

If you encounter issues:
1. Check the logs as shown above
2. Verify DNS configuration
3. Ensure SSL certificates are valid
4. Test network connectivity

The API is now configured to work specifically with the `api.hamedaei.com` domain with proper SSL, CORS, and security headers.

// Environment Configuration and Validation following Microsoft Principal Engineer best practices

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'PORT',
  'NODE_ENV'
];

// Optional environment variables with defaults
const optionalEnvVars = {
  BCRYPT_ROUNDS: '12',
  CORS_ORIGIN: 'http://localhost:3000,http://localhost:3001,http://localhost:8080,http://localhost:5000,http://127.0.0.1:8080,http://127.0.0.1:3001',
  API_DOMAIN: 'localhost',
  MAX_FILE_SIZE: '10485760', // 10MB in bytes
  ALLOWED_FILE_TYPES: 'image/jpeg,image/png,image/gif,image/webp'
};

// Validate required environment variables
export function validateEnvironment(): void {
  const missingVars: string[] = [];
  
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  });
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

// Environment configuration object
export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL!
  },
  
  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET!,
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || optionalEnvVars.BCRYPT_ROUNDS),
    tokenExpiration: '24h'
  },
  
  // Server
  server: {
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiDomain: process.env.API_DOMAIN || optionalEnvVars.API_DOMAIN
  },
  
  // CORS
  cors: {
    origins: (process.env.CORS_ORIGIN || optionalEnvVars.CORS_ORIGIN).split(',').map(origin => origin.trim()),
    credentials: true
  },
  
  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || optionalEnvVars.MAX_FILE_SIZE),
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || optionalEnvVars.ALLOWED_FILE_TYPES)
      .split(',').map(type => type.trim()),
    uploadDir: 'uploads'
  }
};

// Validate environment on import
validateEnvironment();


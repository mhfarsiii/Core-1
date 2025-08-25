# Simple Node.js Backend Dockerfile - using debian for better compatibility
FROM node:18-slim

WORKDIR /app

# Update and install dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libssl3 \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install all dependencies (needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Create uploads directory and set permissions
RUN mkdir -p uploads && chown -R node:node /app

USER node

EXPOSE 3000

# Start the application
CMD ["npm", "start"]

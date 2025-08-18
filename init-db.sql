-- Initialize database for Portfolio API
-- This script runs when MySQL container starts

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS portfolio_db;

-- Use the database
USE portfolio_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'%';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES; 
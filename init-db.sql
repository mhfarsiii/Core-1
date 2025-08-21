-- Initialize database for Portfolio API
-- This script runs when MySQL container starts

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS portfolio;

-- Create PHPMyAdmin user with proper permissions
CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'admin123';
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin123';

-- Grant full privileges to admin user for all databases
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost' WITH GRANT OPTION;

-- Grant privileges to existing portfolio user
GRANT ALL PRIVILEGES ON portfolio.* TO 'portfolio'@'%';
GRANT ALL PRIVILEGES ON portfolio.* TO 'portfolio'@'localhost';

-- Create a read-only user for safer access
CREATE USER IF NOT EXISTS 'viewer'@'%' IDENTIFIED BY 'viewer123';
CREATE USER IF NOT EXISTS 'viewer'@'localhost' IDENTIFIED BY 'viewer123';
GRANT SELECT ON portfolio.* TO 'viewer'@'%';
GRANT SELECT ON portfolio.* TO 'viewer'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES; 
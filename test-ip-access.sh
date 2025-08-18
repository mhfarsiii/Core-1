#!/bin/bash

# Test script for direct IP access
# This script tests the API endpoints via direct IP address

IP_ADDRESS="195.248.240.98"
PORT="3000"
BASE_URL="http://${IP_ADDRESS}:${PORT}"

echo "🧪 API Testing Script for Direct IP Access"
echo "==========================================="
echo "Testing: $BASE_URL"
echo ""

# Function to test an endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    
    echo "Testing $description..."
    echo "URL: $BASE_URL$endpoint"
    
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}\nTIME:%{time_total}" "$BASE_URL$endpoint")
    http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
    time_total=$(echo "$response" | grep "TIME:" | cut -d: -f2)
    
    if [ "$http_code" = "200" ]; then
        echo "✅ Success (${time_total}s)"
        # Show first few lines of response
        echo "$response" | head -5 | grep -v "HTTP_CODE\|TIME"
    elif [ "$http_code" = "301" ] || [ "$http_code" = "302" ]; then
        echo "🔄 Redirect (${http_code})"
    else
        echo "❌ Failed (HTTP $http_code)"
        echo "$response" | grep -v "HTTP_CODE\|TIME"
    fi
    echo ""
}

# Test basic endpoints
test_endpoint "/" "Root Endpoint (API Info)"
test_endpoint "/health" "Health Check"
test_endpoint "/api/images" "Images API"
test_endpoint "/api/texts" "Texts API"
test_endpoint "/api/categories" "Categories API"
test_endpoint "/api/works" "Works API"
test_endpoint "/api/public" "Public API"

# Test example pages
echo "Testing Example Pages..."
test_endpoint "/admin-panel" "Admin Panel"
test_endpoint "/upload-example" "Upload Example"
test_endpoint "/portfolio-website" "Portfolio Website"

echo ""
echo "🏁 Testing complete!"
echo ""
echo "📋 If you see errors:"
echo "   1. Check if the server is running: docker-compose ps"
echo "   2. Check logs: docker-compose logs portfolio-api"
echo "   3. Restart if needed: docker-compose restart portfolio-api"
echo ""
echo "✨ Working endpoints should be:"
echo "   - $BASE_URL/ (API info)"
echo "   - $BASE_URL/health (health check)"
echo "   - $BASE_URL/api/* (all API endpoints)"

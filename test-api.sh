#!/bin/bash

# Test script for api.hamedaei.com
# This script tests the API endpoints to ensure everything is working correctly

API_URL="https://api.hamedaei.com"
LOCAL_URL="http://localhost:3000"

echo "🧪 API Testing Script for api.hamedaei.com"
echo "============================================="

# Function to test an endpoint
test_endpoint() {
    local url=$1
    local endpoint=$2
    local description=$3
    
    echo "Testing $description..."
    echo "URL: $url$endpoint"
    
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}\nTIME:%{time_total}" "$url$endpoint")
    http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
    time_total=$(echo "$response" | grep "TIME:" | cut -d: -f2)
    
    if [ "$http_code" = "200" ]; then
        echo "✅ Success (${time_total}s)"
    elif [ "$http_code" = "301" ] || [ "$http_code" = "302" ]; then
        echo "🔄 Redirect (${http_code})"
    else
        echo "❌ Failed (HTTP $http_code)"
    fi
    echo ""
}

# Check if we're testing local or production
if [ "$1" = "local" ]; then
    echo "Testing LOCAL environment..."
    BASE_URL=$LOCAL_URL
else
    echo "Testing PRODUCTION environment..."
    BASE_URL=$API_URL
fi

echo "Base URL: $BASE_URL"
echo ""

# Test basic endpoints
test_endpoint "$BASE_URL" "/health" "Health Check"
test_endpoint "$BASE_URL" "/images" "Images Endpoint"
test_endpoint "$BASE_URL" "/texts" "Texts Endpoint"
test_endpoint "$BASE_URL" "/categories" "Categories Endpoint"
test_endpoint "$BASE_URL" "/works" "Works Endpoint"
test_endpoint "$BASE_URL" "/public" "Public Endpoint"

# Test CORS with a simple preflight request
echo "Testing CORS..."
cors_response=$(curl -s -H "Origin: https://hamedaei.com" \
                     -H "Access-Control-Request-Method: GET" \
                     -H "Access-Control-Request-Headers: Content-Type" \
                     -X OPTIONS \
                     "$BASE_URL/health")

if [ $? -eq 0 ]; then
    echo "✅ CORS preflight request successful"
else
    echo "❌ CORS preflight request failed"
fi

echo ""
echo "🏁 Testing complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Verify DNS: dig api.hamedaei.com"
echo "   2. Check SSL: openssl s_client -connect api.hamedaei.com:443"
echo "   3. Monitor logs: docker-compose logs -f"

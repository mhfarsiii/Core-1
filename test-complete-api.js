#!/usr/bin/env node

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:3001';
const API_URL = `${BASE_URL}/api`;

// Test data
let authToken = '';
let createdCategoryId = null;
let createdWorkId = null;
let createdTextId = null;
let createdImageId = null;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  log(`\n${colors.bold}🧪 Testing: ${testName}${colors.reset}`, 'blue');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

// Helper function for file uploads
async function uploadFile(endpoint, filePath, additionalFields = {}) {
  try {
    const form = new FormData();
    
    // Add file if it exists
    if (filePath && fs.existsSync(filePath)) {
      form.append('image', fs.createReadStream(filePath));
    } else {
      // Create a simple test image buffer
      const testImageBuffer = Buffer.from('test-image-data');
      form.append('image', testImageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });
    }

    // Add additional fields
    Object.keys(additionalFields).forEach(key => {
      form.append(key, additionalFields[key]);
    });

    const response = await axios.post(`${API_URL}${endpoint}`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      }
    });

    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

// Test functions
async function testHealthCheck() {
  logTest('Health Check');
  
  try {
    const response = await axios.get(BASE_URL);
    logSuccess(`Server is running on ${BASE_URL}`);
    return true;
  } catch (error) {
    logError(`Server is not accessible: ${error.message}`);
    return false;
  }
}

async function testAdminCreation() {
  logTest('Admin Creation');
  
  const adminData = {
    username: 'testadmin',
    password: 'testpassword123',
    email: 'test@example.com'
  };

  const result = await apiRequest('POST', '/admin/create', adminData);
  
  if (result.success) {
    logSuccess('Admin created successfully');
    return true;
  } else {
    if (result.error?.error?.includes('already exists')) {
      logWarning('Admin already exists, continuing with tests');
      return true;
    }
    logError(`Admin creation failed: ${JSON.stringify(result.error)}`);
    return false;
  }
}

async function testAdminLogin() {
  logTest('Admin Login');
  
  const loginData = {
    username: 'testadmin',
    password: 'testpassword123'
  };

  const result = await apiRequest('POST', '/admin/login', loginData);
  
  if (result.success && result.data.data?.token) {
    authToken = result.data.data.token;
    logSuccess('Admin login successful');
    logSuccess(`Token: ${authToken.substring(0, 20)}...`);
    return true;
  } else {
    logError(`Admin login failed: ${JSON.stringify(result.error)}`);
    return false;
  }
}

async function testCategoryOperations() {
  logTest('Category Operations');
  
  // Create category
  const categoryData = {
    title: 'Test Category',
    description: 'This is a test category',
    imageUrl: 'https://example.com/test-image.jpg'
  };

  const createResult = await apiRequest('POST', '/categories', categoryData, {
    'Authorization': `Bearer ${authToken}`
  });

  if (createResult.success) {
    createdCategoryId = createResult.data.data.id;
    logSuccess(`Category created with ID: ${createdCategoryId}`);
  } else {
    logError(`Category creation failed: ${JSON.stringify(createResult.error)}`);
    return false;
  }

  // Get all categories
  const getAllResult = await apiRequest('GET', '/categories');
  
  if (getAllResult.success) {
    logSuccess(`Retrieved ${getAllResult.data.data.length} categories`);
  } else {
    logError(`Get categories failed: ${JSON.stringify(getAllResult.error)}`);
  }

  // Get category by ID
  const getByIdResult = await apiRequest('GET', `/categories/${createdCategoryId}`);
  
  if (getByIdResult.success) {
    logSuccess(`Retrieved category by ID: ${createdCategoryId}`);
  } else {
    logError(`Get category by ID failed: ${JSON.stringify(getByIdResult.error)}`);
  }

  // Update category
  const updateData = {
    title: 'Updated Test Category',
    description: 'This is an updated test category'
  };

  const updateResult = await apiRequest('PUT', `/categories/${createdCategoryId}`, updateData, {
    'Authorization': `Bearer ${authToken}`
  });

  if (updateResult.success) {
    logSuccess('Category updated successfully');
  } else {
    logError(`Category update failed: ${JSON.stringify(updateResult.error)}`);
  }

  return true;
}

async function testWorkOperations() {
  logTest('Work Operations');
  
  if (!createdCategoryId) {
    logError('No category available for work creation');
    return false;
  }

  // Create work
  const workData = {
    title: 'Test Work',
    description: 'This is a test work item',
    mainImageUrl: 'https://example.com/test-work.jpg',
    categoryId: createdCategoryId,
    additionalImages: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    videoLink: 'https://youtube.com/watch?v=test'
  };

  const createResult = await apiRequest('POST', '/works', workData, {
    'Authorization': `Bearer ${authToken}`
  });

  if (createResult.success) {
    createdWorkId = createResult.data.data.id;
    logSuccess(`Work created with ID: ${createdWorkId}`);
  } else {
    logError(`Work creation failed: ${JSON.stringify(createResult.error)}`);
    return false;
  }

  // Get all works
  const getAllResult = await apiRequest('GET', '/works');
  
  if (getAllResult.success) {
    logSuccess(`Retrieved ${getAllResult.data.data.length} works`);
  } else {
    logError(`Get works failed: ${JSON.stringify(getAllResult.error)}`);
  }

  // Get work by ID
  const getByIdResult = await apiRequest('GET', `/works/${createdWorkId}`);
  
  if (getByIdResult.success) {
    logSuccess(`Retrieved work by ID: ${createdWorkId}`);
  } else {
    logError(`Get work by ID failed: ${JSON.stringify(getByIdResult.error)}`);
  }

  // Update work
  const updateData = {
    title: 'Updated Test Work',
    description: 'This is an updated test work item'
  };

  const updateResult = await apiRequest('PUT', `/works/${createdWorkId}`, updateData, {
    'Authorization': `Bearer ${authToken}`
  });

  if (updateResult.success) {
    logSuccess('Work updated successfully');
  } else {
    logError(`Work update failed: ${JSON.stringify(updateResult.error)}`);
  }

  return true;
}

async function testTextOperations() {
  logTest('Text Operations');
  
  // Create text
  const textData = {
    title: 'Test Text',
    content: 'This is a test text content with some sample text to test the API.',
    excerpt: 'This is a test excerpt',
    category: 'blog',
    published: true
  };

  const createResult = await apiRequest('POST', '/texts', textData, {
    'Authorization': `Bearer ${authToken}`
  });

  if (createResult.success) {
    createdTextId = createResult.data.data.id;
    logSuccess(`Text created with ID: ${createdTextId}`);
  } else {
    logError(`Text creation failed: ${JSON.stringify(createResult.error)}`);
    return false;
  }

  // Get all texts
  const getAllResult = await apiRequest('GET', '/texts');
  
  if (getAllResult.success) {
    logSuccess(`Retrieved ${getAllResult.data.data.length} texts`);
  } else {
    logError(`Get texts failed: ${JSON.stringify(getAllResult.error)}`);
  }

  // Get text by ID
  const getByIdResult = await apiRequest('GET', `/texts/${createdTextId}`);
  
  if (getByIdResult.success) {
    logSuccess(`Retrieved text by ID: ${createdTextId}`);
  } else {
    logError(`Get text by ID failed: ${JSON.stringify(getByIdResult.error)}`);
  }

  // Update text
  const updateData = {
    title: 'Updated Test Text',
    content: 'This is updated test content'
  };

  const updateResult = await apiRequest('PUT', `/texts/${createdTextId}`, updateData, {
    'Authorization': `Bearer ${authToken}`
  });

  if (updateResult.success) {
    logSuccess('Text updated successfully');
  } else {
    logError(`Text update failed: ${JSON.stringify(updateResult.error)}`);
  }

  return true;
}

async function testImageOperations() {
  logTest('Image Operations');
  
  // Test image upload
  const uploadResult = await uploadFile('/images', null, {
    title: 'Test Image',
    description: 'This is a test image upload',
    category: 'test'
  });

  if (uploadResult.success) {
    createdImageId = uploadResult.data.data.id;
    logSuccess(`Image uploaded with ID: ${createdImageId}`);
  } else {
    logError(`Image upload failed: ${JSON.stringify(uploadResult.error)}`);
    return false;
  }

  // Get all images
  const getAllResult = await apiRequest('GET', '/images');
  
  if (getAllResult.success) {
    logSuccess(`Retrieved ${getAllResult.data.data.length} images`);
  } else {
    logError(`Get images failed: ${JSON.stringify(getAllResult.error)}`);
  }

  // Get image by ID
  const getByIdResult = await apiRequest('GET', `/images/${createdImageId}`);
  
  if (getByIdResult.success) {
    logSuccess(`Retrieved image by ID: ${createdImageId}`);
  } else {
    logError(`Get image by ID failed: ${JSON.stringify(getByIdResult.error)}`);
  }

  return true;
}

async function testPublicRoutes() {
  logTest('Public Routes');
  
  // Test public categories
  const categoriesResult = await apiRequest('GET', '/public/categories');
  
  if (categoriesResult.success) {
    logSuccess(`Public categories retrieved: ${categoriesResult.data.data.length} items`);
  } else {
    logError(`Public categories failed: ${JSON.stringify(categoriesResult.error)}`);
  }

  // Test public works
  const worksResult = await apiRequest('GET', '/public/works');
  
  if (worksResult.success) {
    logSuccess(`Public works retrieved: ${worksResult.data.data.length} items`);
  } else {
    logError(`Public works failed: ${JSON.stringify(worksResult.error)}`);
  }

  // Test public texts
  const textsResult = await apiRequest('GET', '/public/texts');
  
  if (textsResult.success) {
    logSuccess(`Public texts retrieved: ${textsResult.data.data.length} items`);
  } else {
    logError(`Public texts failed: ${JSON.stringify(textsResult.error)}`);
  }

  return true;
}

async function testErrorHandling() {
  logTest('Error Handling');
  
  // Test invalid endpoint
  const invalidResult = await apiRequest('GET', '/invalid-endpoint');
  
  if (!invalidResult.success && invalidResult.status === 404) {
    logSuccess('404 error handling works correctly');
  } else {
    logWarning('404 error handling might need attention');
  }

  // Test unauthorized access
  const unauthorizedResult = await apiRequest('POST', '/categories', { title: 'Test' });
  
  if (!unauthorizedResult.success && (unauthorizedResult.status === 401 || unauthorizedResult.status === 403)) {
    logSuccess('Unauthorized access handling works correctly');
  } else {
    logWarning('Unauthorized access handling might need attention');
  }

  // Test invalid data
  const invalidDataResult = await apiRequest('POST', '/categories', {}, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (!invalidDataResult.success && invalidDataResult.status === 400) {
    logSuccess('Invalid data handling works correctly');
  } else {
    logWarning('Invalid data handling might need attention');
  }

  return true;
}

async function cleanup() {
  logTest('Cleanup');
  
  // Delete created resources in reverse order
  if (createdImageId) {
    const result = await apiRequest('DELETE', `/images/${createdImageId}`, null, {
      'Authorization': `Bearer ${authToken}`
    });
    if (result.success) {
      logSuccess(`Deleted image: ${createdImageId}`);
    }
  }

  if (createdTextId) {
    const result = await apiRequest('DELETE', `/texts/${createdTextId}`, null, {
      'Authorization': `Bearer ${authToken}`
    });
    if (result.success) {
      logSuccess(`Deleted text: ${createdTextId}`);
    }
  }

  if (createdWorkId) {
    const result = await apiRequest('DELETE', `/works/${createdWorkId}`, null, {
      'Authorization': `Bearer ${authToken}`
    });
    if (result.success) {
      logSuccess(`Deleted work: ${createdWorkId}`);
    }
  }

  if (createdCategoryId) {
    const result = await apiRequest('DELETE', `/categories/${createdCategoryId}`, null, {
      'Authorization': `Bearer ${authToken}`
    });
    if (result.success) {
      logSuccess(`Deleted category: ${createdCategoryId}`);
    }
  }
}

// Main test runner
async function runTests() {
  log(`${colors.bold}🚀 Starting API Tests for Portfolio Project${colors.reset}`, 'blue');
  log(`${colors.bold}Target URL: ${BASE_URL}${colors.reset}`, 'blue');
  
  let passedTests = 0;
  let totalTests = 0;

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Admin Creation', fn: testAdminCreation },
    { name: 'Admin Login', fn: testAdminLogin },
    { name: 'Category Operations', fn: testCategoryOperations },
    { name: 'Work Operations', fn: testWorkOperations },
    { name: 'Text Operations', fn: testTextOperations },
    { name: 'Image Operations', fn: testImageOperations },
    { name: 'Public Routes', fn: testPublicRoutes },
    { name: 'Error Handling', fn: testErrorHandling }
  ];

  for (const test of tests) {
    totalTests++;
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      logError(`Test "${test.name}" threw an error: ${error.message}`);
    }
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Cleanup
  await cleanup();

  // Results
  log(`\n${colors.bold}📊 Test Results:${colors.reset}`, 'blue');
  log(`Passed: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log(`\n🎉 All tests passed! Your API is working correctly.`, 'green');
  } else {
    log(`\n⚠️  Some tests failed. Please check the output above for details.`, 'yellow');
  }

  process.exit(passedTests === totalTests ? 0 : 1);
}

// Handle command line arguments
if (require.main === module) {
  runTests().catch(error => {
    logError(`Test runner failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runTests };


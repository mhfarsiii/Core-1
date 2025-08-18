const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    // Write test image to uploads directory
    fs.writeFileSync('uploads/test-image.png', testImageBuffer);
    
    console.log('✅ Test image created successfully');
    console.log('📁 Test image saved to: uploads/test-image.png');
    console.log('🚀 You can now test the API endpoints:');
    console.log('   - GET http://localhost:3000/health');
    console.log('   - GET http://localhost:3000/api/images');
    console.log('   - POST http://localhost:3000/api/images (with image file and title)');
    
  } catch (error) {
    console.error('❌ Error creating test image:', error);
  }
}

testUpload(); 
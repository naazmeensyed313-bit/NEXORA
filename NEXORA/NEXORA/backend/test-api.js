// Test the backend API directly
const axios = require('axios');

async function testAnalyze() {
  try {
    console.log('Testing backend API...');
    const response = await axios.post('http://localhost:5000/analyze', {
      idea: 'AI-powered medical diagnostic tool that analyzes medical imaging using computer vision and machine learning'
    });
    
    console.log('✅ Success! Response:', response.data);
  } catch (error) {
    console.error('❌ Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
  }
}

testAnalyze();

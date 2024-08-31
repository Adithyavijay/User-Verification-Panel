const axios = require('axios');

async function generateAccessToken() {
  try {
    const response = await axios.post('https://api.sandbox.co.in/authenticate', null, {
      headers: {
        'x-api-key': process.env.SANDBOX_API_KEY,
        'x-api-secret': process.env.SANDBOX_API_SECRET,
        'x-api-version': process.env.SANDBOX_API_VERSION
      }
    });

    if (response.data && response.data.access_token) {
      return response.data.access_token;
    } else {
      throw new Error('Failed to retrieve access token');
    }
  } catch (error) {
    console.error('Error generating access token:', error);
    throw error;
  }
}

module.exports = generateAccessToken;
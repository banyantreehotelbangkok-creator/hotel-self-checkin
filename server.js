const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// API URL - ใช้ Manus sandbox URL
const API_URL = process.env.API_URL || 'https://3000-i5ptp0rqj6qe8ike2fss3-8519c6ae.sg1.manus.computer';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Proxy API requests to the backend
app.all('/api/*', async (req, res) => {
  try {
    const targetUrl = `${API_URL}${req.originalUrl}`;
    console.log(`Proxying ${req.method} ${req.originalUrl} -> ${targetUrl}`);
    
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };
    
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
      console.log('Request body:', JSON.stringify(req.body));
    }
    
    const response = await fetch(targetUrl, fetchOptions);
    
    // Get response as text first to handle non-JSON responses
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text (first 500 chars):', responseText.substring(0, 500));
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.error('Response was not valid JSON:', responseText.substring(0, 200));
      
      // Return error with details
      return res.status(502).json({ 
        error: 'Backend returned invalid JSON',
        details: responseText.substring(0, 200),
        status: response.status
      });
    }
    
    // Forward the response status and data
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error.message);
    console.error('Full error:', error);
    
    // Check if it's a network error
    if (error.cause && error.cause.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'Backend server is not available',
        message: 'ไม่สามารถเชื่อมต่อกับ Backend ได้ กรุณาลองใหม่อีกครั้ง'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to connect to API server',
      message: error.message
    });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/self-checkin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    apiUrl: API_URL,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Self Check-in server running on port ${PORT}`);
  console.log(`API URL: ${API_URL}`);
});

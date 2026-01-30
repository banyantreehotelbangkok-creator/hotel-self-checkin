const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// API URL - ต้องเปลี่ยนเป็น URL ของ Railway หลัง deploy
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
      },
    };
    
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
    }
    
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to connect to API server' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/self-checkin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Self Check-in server running on port ${PORT}`);
  console.log(`API URL: ${API_URL}`);
});

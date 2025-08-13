
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Water Meter Management API is running' });
});

app.get('/api/meters', (req, res) => {
  // This would typically connect to your database
  res.json([
    {
      id: '001234',
      type: 'Sensus 620',
      dn: 'DN20',
      serial: 'ABC123456',
      supplier: 'ABC Kft.',
      manufacturer: 'Sensus',
      address: '1052 Budapest, Váci utca 15.',
      status: 'active',
      procurementDate: '2024-01-15',
      installDate: '2024-02-01',
      lastReading: '2024-11-15',
      currentReading: '1234.5',
      sealNumber: 'SEAL001'
    }
  ]);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});

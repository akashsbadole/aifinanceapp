const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import API routes
const invoiceRoutes = require('./routes/invoices.cjs');
const expenseRoutes = require('./routes/expenses.cjs');
const categoryRoutes = require('./routes/categories.cjs');
const businessProfileRoutes = require('./routes/businessProfiles.cjs');
const qrCodeRoutes = require('./routes/qrCodes.cjs');
const settingsRoutes = require('./routes/settings.cjs');

// API Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/business-profiles', businessProfileRoutes);
app.use('/api/qr-codes', qrCodeRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Finance App API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Finance App API server running on port ${PORT}`);
  console.log(`📊 Database: SQLite (${process.env.DATABASE_URL})`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

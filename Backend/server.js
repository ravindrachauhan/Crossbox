// server.js - Main Server File
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
// Parse JSON bodies
app.use(express.json());

// Enable CORS (allows frontend to connect)
app.use(cors());

// Log all incoming requests (helpful for debugging)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ==================== ROUTES ====================
// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Customer Management API!',
        endpoints: {
            customers: {
                getAll: 'GET /api/customers',
                getOne: 'GET /api/customers/:id',
                searchByCity: 'GET /api/customers/city/:city',
                create: 'POST /api/customers',
                update: 'PUT /api/customers/:id',
                delete: 'DELETE /api/customers/:id'
            }
        }
    });
});

// All API routes start with /api
app.use('/api', routes);

// ==================== ERROR HANDLING ====================
// Handle 404 - Route not found
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log('=================================');
});
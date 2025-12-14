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
        message: 'Welcome to CrossBox Fitness API!',
        version: '1.0.0',
        endpoints: {
            users: {
                getAll: 'GET /api/users',
                getOne: 'GET /api/users/:id',
                searchByMembership: 'GET /api/users/membership/:type',
                searchByStatus: 'GET /api/users/status/:status (active/inactive)',
                create: 'POST /api/users',
                update: 'PUT /api/users/:id',
                delete: 'DELETE /api/users/:id'
            },
            trainers: {
                getAll: 'GET /api/trainers',
                getOne: 'GET /api/trainers/:id',
                searchBySpecialization: 'GET /api/trainers/specialization/:spec',
                searchByStatus: 'GET /api/trainers/status/:status (active/inactive)',
                create: 'POST /api/trainers',
                update: 'PUT /api/trainers/:id',
                delete: 'DELETE /api/trainers/:id'
            },
            plans: {
                getAll: 'GET /api/plans',
                getOne: 'GET /api/plans/:id',
                searchByLevel: 'GET /api/plans/level/:level',
                searchByStatus: 'GET /api/plans/status/:status (active/inactive)',
                create: 'POST /api/plans',
                update: 'PUT /api/plans/:id',
                delete: 'DELETE /api/plans/:id'
            },
            subscriptions: {
                getAll: 'GET /api/subscriptions',
                getOne: 'GET /api/subscriptions/:id',
                searchByMember: 'GET /api/subscriptions/member/:memberId',
                searchByPlan: 'GET /api/subscriptions/plan/:planId',
                searchByPaymentStatus: 'GET /api/subscriptions/payment/:status',
                searchByMembershipStatus: 'GET /api/subscriptions/memstatus/:status',
                create: 'POST /api/subscriptions',
                update: 'PUT /api/subscriptions/:id',
                delete: 'DELETE /api/subscriptions/:id'
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
    console.log(`🔗 http://localhost:${PORT}`);
    console.log('=================================');
});
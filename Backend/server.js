// server.js - Main Server File
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;  // Changed to 5000 to match your frontend

// ==================== MIDDLEWARE ====================
// Enable CORS FIRST (before any other middleware)
app.use(cors({
    origin: '*',  // Allow all origins for development
    credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests (helpful for debugging)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// ==================== ROUTES ====================
// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to CrossBox Fitness API!',
        version: '1.0.0',
        status: 'Running',
        timestamp: new Date().toISOString(),
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
            },
            findMyFit: {
                submit: 'POST /api/find-my-fit',
                getSubmissions: 'GET /api/find-my-fit/submissions',
                getSubmission: 'GET /api/find-my-fit/submissions/:id'
            },
            freeTrials: {
                submit: 'POST /api/free-trial',
                getAll: 'GET /api/free-trials',
                getOne: 'GET /api/free-trials/:id'
            },
            facilityVisits: {
                submit: 'POST /api/book-visit',
                getAll: 'GET /api/facility-visits',
                getOne: 'GET /api/facility-visits/:id'
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
        message: `Route not found: ${req.method} ${req.url}`,
        availableRoutes: 'Visit http://localhost:5000/ for API documentation'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 CrossBox API Server Running`);
    console.log(`🔗 Local: http://localhost:${PORT}`);
    console.log(`📝 API Docs: http://localhost:${PORT}/`);
    console.log(`⏰ Started: ${new Date().toLocaleString()}`);
    console.log('=================================');
});
// routes.js - All API Routes in One File
const express = require('express');
const router = express.Router();
const db = require('./db');

// ==================== CUSTOMER APIs ====================

// 1. GET - Get all customers
router.get('/customers', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM customer');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching customers',
            error: error.message
        });
    }
});

// 2. GET - Get single customer by ID
router.get('/customers/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM customer WHERE custID = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching customer',
            error: error.message
        });
    }
});

// 3. GET - Search customers by city
router.get('/customers/city/:city', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM customer WHERE city = ?', [req.params.city]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching customers',
            error: error.message
        });
    }
});

// 4. POST - Create new customer
router.post('/customers', async (req, res) => {
    try {
        const { firstname, lastname, address, city, country, birthdate } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO customer (firstname, lastname, address, city, country, birthdate) VALUES (?, ?, ?, ?, ?, ?)',
            [firstname, lastname, address, city, country, birthdate]
        );
        
        res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            custID: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating customer',
            error: error.message
        });
    }
});

// 5. PUT - Update existing customer
router.put('/customers/:id', async (req, res) => {
    try {
        const { firstname, lastname, address, city, country, birthdate } = req.body;
        
        const [result] = await db.query(
            'UPDATE customer SET firstname = ?, lastname = ?, address = ?, city = ?, country = ?, birthdate = ? WHERE custID = ?',
            [firstname, lastname, address, city, country, birthdate, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Customer updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating customer',
            error: error.message
        });
    }
});

// 6. DELETE - Delete customer
router.delete('/customers/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM customer WHERE custID = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Customer deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting customer',
            error: error.message
        });
    }
});

// ==================== ADD MORE ROUTES FOR OTHER TABLES HERE ====================

module.exports = router;
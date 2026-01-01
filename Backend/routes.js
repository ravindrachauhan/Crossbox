// routes.js - All API Routes in One File
const express = require('express');
const router = express.Router();
const db = require('./db');
const chatbot = require('./chatbot');

// ==================== USERS APIs ====================

// 1. GET - Get all users
router.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// 2. GET - Get single user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
});

// 3. GET - Get users by membership type
router.get('/users/membership/:type', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE membership_type = ?', [req.params.type]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching users by membership type',
            error: error.message
        });
    }
});

// 4. GET - Get active/inactive users
router.get('/users/status/:status', async (req, res) => {
    try {
        const isActive = req.params.status === 'active' ? 1 : 0;
        const [rows] = await db.query('SELECT * FROM users WHERE isActive = ?', [isActive]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching users by status',
            error: error.message
        });
    }
});

// 5. POST - Create new user
router.post('/users', async (req, res) => {
    try {
        const { 
            user_name, 
            email, 
            password_hash, 
            gender, 
            user_dob, 
            user_phone, 
            u_address, 
            membership_type, 
            trainer_id, 
            isActive, 
            created_by 
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO users (user_name, email, password_hash, gender, user_dob, user_phone, u_address, 
             membership_type, trainer_id, isActive, created_by, modified_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_name, email, password_hash, gender, user_dob, user_phone, u_address, 
             membership_type, trainer_id, isActive, created_by, created_by]
        );
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});

// 6. PUT - Update existing user
router.put('/users/:id', async (req, res) => {
    try {
        const { 
            user_name, 
            email, 
            password_hash, 
            gender, 
            user_dob, 
            user_phone, 
            u_address, 
            membership_type, 
            trainer_id, 
            isActive, 
            modified_by 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE users SET user_name = ?, email = ?, password_hash = ?, gender = ?, user_dob = ?, 
             user_phone = ?, u_address = ?, membership_type = ?, trainer_id = ?, isActive = ?, 
             modified_by = ?, modified_on = CURRENT_TIMESTAMP WHERE user_id = ?`,
            [user_name, email, password_hash, gender, user_dob, user_phone, u_address, 
             membership_type, trainer_id, isActive, modified_by, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
});

// 7. DELETE - Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
});

// ==================== TRAINER APIs ====================

// 1. GET - Get all trainers
router.get('/trainers', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM trainer');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching trainers',
            error: error.message
        });
    }
});

// 2. GET - Get single trainer by ID
router.get('/trainers/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM trainer WHERE trainerId = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Trainer not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching trainer',
            error: error.message
        });
    }
});

// 3. GET - Get trainers by specialization
router.get('/trainers/specialization/:spec', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM trainer WHERE specialisation = ?', [req.params.spec]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching trainers by specialization',
            error: error.message
        });
    }
});

// 4. GET - Get active/inactive trainers
router.get('/trainers/status/:status', async (req, res) => {
    try {
        const isActive = req.params.status === 'active' ? 1 : 0;
        const [rows] = await db.query('SELECT * FROM trainer WHERE isActive = ?', [isActive]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching trainers by status',
            error: error.message
        });
    }
});

// 5. POST - Create new trainer
router.post('/trainers', async (req, res) => {
    try {
        const { 
            trainercode,
            trainername, 
            traineremail, 
            trainerphonenumber, 
            specialisation, 
            experienceyears, 
            certification, 
            isActive, 
            created_by 
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO trainer (trainercode, trainername, traineremail, trainerphonenumber, 
             specialisation, experienceyears, certification, isActive, created_by, modified_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [trainercode, trainername, traineremail, trainerphonenumber, specialisation, 
             experienceyears, certification, isActive, created_by, created_by]
        );
        
        res.status(201).json({
            success: true,
            message: 'Trainer created successfully',
            trainer_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating trainer',
            error: error.message
        });
    }
});

// 6. PUT - Update existing trainer
router.put('/trainers/:id', async (req, res) => {
    try {
        const { 
            trainercode,
            trainername, 
            traineremail, 
            trainerphonenumber, 
            specialisation, 
            experienceyears, 
            certification, 
            isActive, 
            modified_by 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE trainer SET trainercode = ?, trainername = ?, traineremail = ?, 
             trainerphonenumber = ?, specialisation = ?, experienceyears = ?, 
             certification = ?, isActive = ?, modified_by = ?, modified_on = CURRENT_TIMESTAMP 
             WHERE trainerId = ?`,
            [trainercode, trainername, traineremail, trainerphonenumber, specialisation, 
             experienceyears, certification, isActive, modified_by, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Trainer not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Trainer updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating trainer',
            error: error.message
        });
    }
});

// 7. DELETE - Delete trainer
router.delete('/trainers/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM trainer WHERE trainerId = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Trainer not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Trainer deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting trainer',
            error: error.message
        });
    }
});

// ==================== PLANS APIs ====================

// 1. GET - Get all plans
router.get('/plans', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM plans');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching plans',
            error: error.message
        });
    }
});

// 2. GET - Get single plan by ID
router.get('/plans/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM plans WHERE planId = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching plan',
            error: error.message
        });
    }
});

// 3. GET - Get plans by level
router.get('/plans/level/:level', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM plans WHERE planLevel = ?', [req.params.level]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching plans by level',
            error: error.message
        });
    }
});

// 4. GET - Get active/inactive plans
router.get('/plans/status/:status', async (req, res) => {
    try {
        const isActive = req.params.status === 'active' ? 1 : 0;
        const [rows] = await db.query('SELECT * FROM plans WHERE isActive = ?', [isActive]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching plans by status',
            error: error.message
        });
    }
});

// 5. POST - Create new plan
router.post('/plans', async (req, res) => {
    try {
        const { 
            planName, 
            planLevel, 
            planPrice, 
            planDesc, 
            planDuration, 
            isActive, 
            created_by 
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO plans (planName, planLevel, planPrice, planDesc, planDuration, isActive, created_by, modified_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [planName, planLevel, planPrice, planDesc, planDuration, isActive, created_by, created_by]
        );
        
        res.status(201).json({
            success: true,
            message: 'Plan created successfully',
            plan_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating plan',
            error: error.message
        });
    }
});

// 6. PUT - Update existing plan
router.put('/plans/:id', async (req, res) => {
    try {
        const { 
            planName, 
            planLevel, 
            planPrice, 
            planDesc, 
            planDuration, 
            isActive, 
            modified_by 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE plans SET planName = ?, planLevel = ?, planPrice = ?, planDesc = ?, planDuration = ?, 
             isActive = ?, modified_by = ?, modified_on = CURRENT_TIMESTAMP WHERE planId = ?`,
            [planName, planLevel, planPrice, planDesc, planDuration, isActive, modified_by, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Plan updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating plan',
            error: error.message
        });
    }
});

// 7. DELETE - Delete plan
router.delete('/plans/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM plans WHERE planId = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Plan deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting plan',
            error: error.message
        });
    }
});

// ==================== SUBSCRIPTIONS APIs ====================

// 1. GET - Get all subscriptions
router.get('/subscriptions', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM subscriptions');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching subscriptions',
            error: error.message
        });
    }
});

// 2. GET - Get single subscription by ID
router.get('/subscriptions/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM subscriptions WHERE subscriptionId = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching subscription',
            error: error.message
        });
    }
});

// 3. GET - Get subscriptions by member ID
router.get('/subscriptions/member/:memberId', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM subscriptions WHERE memberId = ?', [req.params.memberId]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching subscriptions',
            error: error.message
        });
    }
});

// 4. GET - Get subscriptions by plan ID
router.get('/subscriptions/plan/:planId', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM subscriptions WHERE planId = ?', [req.params.planId]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching subscriptions by plan',
            error: error.message
        });
    }
});

// 5. GET - Get subscriptions by payment status
router.get('/subscriptions/payment/:status', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM subscriptions WHERE paymentStatus = ?', [req.params.status]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching subscriptions by payment status',
            error: error.message
        });
    }
});

// 6. GET - Get subscriptions by membership status
router.get('/subscriptions/memstatus/:status', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM subscriptions WHERE membershipStatus = ?', [req.params.status]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching subscriptions by membership status',
            error: error.message
        });
    }
});

// 7. POST - Create new subscription
router.post('/subscriptions', async (req, res) => {
    try {
        const { 
            memberId, 
            planId, 
            startDate, 
            endDate, 
            paymentStatus, 
            membershipStatus, 
            created_by 
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO subscriptions (memberId, planId, startDate, endDate, paymentStatus, membershipStatus, created_by, modified_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [memberId, planId, startDate, endDate, paymentStatus, membershipStatus, created_by, created_by]
        );
        
        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            subscription_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating subscription',
            error: error.message
        });
    }
});

// 8. PUT - Update existing subscription
router.put('/subscriptions/:id', async (req, res) => {
    try {
        const { 
            memberId, 
            planId, 
            startDate, 
            endDate, 
            paymentStatus, 
            membershipStatus, 
            modified_by 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE subscriptions SET memberId = ?, planId = ?, startDate = ?, endDate = ?, paymentStatus = ?, 
             membershipStatus = ?, modified_by = ?, modified_on = CURRENT_TIMESTAMP WHERE subscriptionId = ?`,
            [memberId, planId, startDate, endDate, paymentStatus, membershipStatus, modified_by, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Subscription updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating subscription',
            error: error.message
        });
    }
});

// 9. DELETE - Delete subscription
router.delete('/subscriptions/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM subscriptions WHERE subscriptionId = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Subscription deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting subscription',
            error: error.message
        });
    }
});

// ==================== BOOKINGS API ====================

// POST - Create booking
router.post('/bookings', async (req, res) => {
    try {
        const { 
            fullName,
            email,
            phone,
            className,
            bookingDate,
            timeSlot,
            numParticipants,
            specialRequirements,
            bookingStatus
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO bookings (full_name, email, phone, class_name, booking_date, time_slot, 
             num_participants, special_requirements, booking_status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [fullName, email, phone, className, bookingDate, timeSlot, numParticipants, specialRequirements, bookingStatus]
        );
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
});

router.post('/quick-book', async (req, res) => {
    try {
        const { 
            fullName,
            email,
            phone,
            className,
            bookingDate,
            timeSlot,
            numParticipants,
            specialRequirements,
            reminderSMS,
            reminderEmail,
            waitlist
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone || !className || !bookingDate || !timeSlot) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        // Check if slot is available (you can add your own logic here)
        // For now, we'll assume all bookings are confirmed
        const bookingStatus = 'Confirmed';

        // Insert booking record
        const [result] = await db.query(
            `INSERT INTO bookings 
            (full_name, email, phone, class_name, booking_date, time_slot, 
             num_participants, special_requirements, booking_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [fullName, email, phone, className, bookingDate, timeSlot, 
             numParticipants || 1, specialRequirements, bookingStatus]
        );

        res.status(201).json({
            success: true,
            message: `Your class has been booked successfully! We'll send you a confirmation email shortly.`,
            data: {
                booking_id: result.insertId,
                fullName,
                email,
                className,
                bookingDate,
                timeSlot,
                status: bookingStatus
            }
        });

    } catch (error) {
        console.error('Quick Book Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing booking. Please try again.',
            error: error.message
        });
    }
});

// GET - Get all bookings
router.get('/bookings', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM bookings WHERE isDeleted = 0 ORDER BY booking_date DESC');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
});



// GET - Get booking by ID
router.get('/bookings/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM bookings WHERE booking_id = ? AND isDeleted = 0', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
});

// GET - Get bookings by email
router.get('/bookings/email/:email', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM bookings WHERE email = ? AND isDeleted = 0 ORDER BY booking_date DESC',
            [req.params.email]
        );
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
});

// GET - Get bookings by date
router.get('/bookings/date/:date', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM bookings WHERE booking_date = ? AND isDeleted = 0 ORDER BY time_slot ASC',
            [req.params.date]
        );
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
});

// PUT - Update booking
router.put('/bookings/:id', async (req, res) => {
    try {
        const { 
            fullName,
            email,
            phone,
            className,
            bookingDate,
            timeSlot,
            numParticipants,
            specialRequirements,
            bookingStatus
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE bookings SET full_name = ?, email = ?, phone = ?, class_name = ?, 
             booking_date = ?, time_slot = ?, num_participants = ?, special_requirements = ?, 
             booking_status = ?, modified_at = CURRENT_TIMESTAMP WHERE booking_id = ?`,
            [fullName, email, phone, className, bookingDate, timeSlot, 
             numParticipants, specialRequirements, bookingStatus, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Booking updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating booking',
            error: error.message
        });
    }
});

// DELETE - Cancel booking (soft delete)
router.delete('/bookings/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE bookings SET isDeleted = 1, booking_status = "Cancelled" WHERE booking_id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
});


// ==================== ENROLL MODAL API (NEW!) ====================

// POST - Submit Enroll Form (Create Class Enrollment)
router.post('/enroll', async (req, res) => {
    try {
        const { 
            firstName,
            lastName,
            email,
            phone,
            className,
            enrollmentType,
            preferredSchedule,
            startDate,
            experienceLevel,
            fitnessGoals,
            medicalConditions
        } = req.body;
        
        const fullName = `${firstName} ${lastName}`;
        
        // Create enrollment record
        const [result] = await db.query(
            `INSERT INTO enrollments 
            (full_name, first_name, last_name, email, phone, class_name, enrollment_type, 
             preferred_schedule, start_date, experience_level, fitness_goals, medical_conditions, 
             enrollment_status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', CURRENT_TIMESTAMP)`,
            [fullName, firstName, lastName, email, phone, className, enrollmentType, 
             preferredSchedule, startDate, experienceLevel, JSON.stringify(fitnessGoals), 
             medicalConditions]
        );
        
        res.status(201).json({
            success: true,
            message: 'Enrollment successful! Welcome to CrossBox! We\'ve sent you a confirmation email with your class details.',
            data: {
                enrollment_id: result.insertId,
                name: fullName,
                email: email,
                class_name: className,
                enrollment_type: enrollmentType,
                start_date: startDate
            }
        });
    } catch (error) {
        // Check for duplicate enrollment
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'You are already enrolled in this class. Please check your email for details.',
                error: 'Duplicate enrollment'
            });
        }
        
        // Check if table doesn't exist
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({
                success: false,
                message: 'Enrollment system is being set up. Please try again in a few minutes or contact support.',
                error: 'Table not found - please create enrollments table'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error processing enrollment. Please try again.',
            error: error.message
        });
    }
});

// GET - Get all enrollments
router.get('/enrollments', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM enrollments ORDER BY created_at DESC');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching enrollments',
            error: error.message
        });
    }
});

// GET - Get enrollment by ID
router.get('/enrollments/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM enrollments WHERE enrollment_id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching enrollment',
            error: error.message
        });
    }
});

// GET - Get enrollments by email
router.get('/enrollments/email/:email', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM enrollments WHERE email = ? ORDER BY created_at DESC',
            [req.params.email]
        );
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching enrollments',
            error: error.message
        });
    }
});

// ==================== CHATBOT API (NEW!) ====================

// POST - Chat with the gym chatbot
router.post('/chatbot', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Please provide a message'
            });
        }

        // Process message through chatbot
        const response = await chatbot.processMessage(message);

        res.json({
            success: true,
            data: response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing chatbot message',
            error: error.message
        });
    }
});

// GET - Chatbot info endpoint
router.get('/chatbot/info', (req, res) => {
    res.json({
        success: true,
        data: {
            name: 'CrossBox Fitness Assistant',
            version: '1.0.0',
            description: 'AI-powered gym assistant that helps with subscriptions, classes, trainers, bookings and gym information'
        }
    });
});

// ==================== FREE TRIAL APIs ====================

// POST - Submit Free Trial Form
router.post('/free-trial', async (req, res) => {
    try {
        const { 
            firstName,
            lastName,
            email, 
            phone,
            preferredStartDate,
            preferredTime,
            fitnessGoals,  // Array or comma-separated string
            experienceLevel,
            heardAboutUs,
            additionalNotes
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !preferredStartDate || !preferredTime || !experienceLevel) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        // Check for duplicate email
        const [existingTrial] = await db.query(
            'SELECT * FROM free_trials WHERE email = ? AND isDeleted = 0',
            [email]
        );

        if (existingTrial.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'An active free trial request already exists with this email'
            });
        }

        // Convert fitness goals array to comma-separated string
        const goalsString = Array.isArray(fitnessGoals) ? fitnessGoals.join(', ') : fitnessGoals;

        // Insert free trial record
        const [result] = await db.query(
            `INSERT INTO free_trials 
            (first_name, last_name, email, phone, preferred_start_date, preferred_time, 
             fitness_goals, experience_level, heard_about_us, additional_notes, trial_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
            [firstName, lastName, email, phone, preferredStartDate, preferredTime, 
             goalsString, experienceLevel, heardAboutUs, additionalNotes]
        );

        res.status(201).json({
            success: true,
            message: '🎉 Free trial request submitted successfully!',
            trialId: result.insertId,
            data: {
                firstName,
                lastName,
                email,
                preferredStartDate,
                preferredTime
            }
        });

    } catch (error) {
        console.error('Free Trial Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting free trial request',
            error: error.message
        });
    }
});

// GET - Get all free trials
router.get('/free-trials', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM free_trials WHERE isDeleted = 0 ORDER BY created_at DESC'
        );
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching free trials',
            error: error.message
        });
    }
});

// GET - Get single free trial by ID
router.get('/free-trials/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM free_trials WHERE trial_id = ? AND isDeleted = 0',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Free trial not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching free trial',
            error: error.message
        });
    }
});

// PUT - Update free trial status
router.put('/free-trials/:id/status', async (req, res) => {
    try {
        const { status } = req.body; // Pending, Confirmed, Completed, Cancelled
        
        const [result] = await db.query(
            'UPDATE free_trials SET trial_status = ?, modified_at = NOW() WHERE trial_id = ?',
            [status, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Free trial not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Trial status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating trial status',
            error: error.message
        });
    }
});

// ==================== FACILITY VISIT APIs ====================

// POST - Submit Visit Booking Form
router.post('/book-visit', async (req, res) => {
    try {
        const { 
            firstName,
            lastName,
            email, 
            phone,
            visitDate,
            visitTime,
            numGuests,
            visitPurpose,
            interestedIn,  // Array or comma-separated string
            specialRequests,
            tourGuideNeeded
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !visitDate || !visitTime || !visitPurpose) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        // Convert interested areas array to comma-separated string
        const interestedString = Array.isArray(interestedIn) ? interestedIn.join(', ') : interestedIn;

        // Insert visit booking record
        const [result] = await db.query(
            `INSERT INTO facility_visits 
            (first_name, last_name, email, phone, visit_date, visit_time, 
             num_guests, visit_purpose, interested_in, special_requests, tour_guide_needed, visit_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Scheduled')`,
            [firstName, lastName, email, phone, visitDate, visitTime, 
             numGuests || 1, visitPurpose, interestedString, specialRequests, tourGuideNeeded || false]
        );

        res.status(201).json({
            success: true,
            message: '🎉 Visit booking confirmed successfully!',
            visitId: result.insertId,
            data: {
                firstName,
                lastName,
                email,
                visitDate,
                visitTime,
                visitPurpose
            }
        });

    } catch (error) {
        console.error('Visit Booking Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error booking facility visit',
            error: error.message
        });
    }
});

// GET - Get all facility visits
router.get('/facility-visits', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM facility_visits WHERE isDeleted = 0 ORDER BY visit_date DESC, created_at DESC'
        );
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching facility visits',
            error: error.message
        });
    }
});

// GET - Get single facility visit by ID
router.get('/facility-visits/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM facility_visits WHERE visit_id = ? AND isDeleted = 0',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Visit booking not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching visit booking',
            error: error.message
        });
    }
});

// GET - Get visits by date
router.get('/facility-visits/date/:date', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM facility_visits WHERE visit_date = ? AND isDeleted = 0 ORDER BY visit_time',
            [req.params.date]
        );
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching visits by date',
            error: error.message
        });
    }
});

// PUT - Update visit status
router.put('/facility-visits/:id/status', async (req, res) => {
    try {
        const { status } = req.body; // Scheduled, Confirmed, Completed, Cancelled
        
        const [result] = await db.query(
            'UPDATE facility_visits SET visit_status = ?, modified_at = NOW() WHERE visit_id = ?',
            [status, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Visit booking not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Visit status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating visit status',
            error: error.message
        });
    }
});

// DELETE - Soft delete free trial
router.delete('/free-trials/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE free_trials SET isDeleted = 1, modified_at = NOW() WHERE trial_id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Free trial not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Free trial deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting free trial',
            error: error.message
        });
    }
});

// DELETE - Soft delete facility visit
router.delete('/facility-visits/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE facility_visits SET isDeleted = 1, modified_at = NOW() WHERE visit_id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Visit booking not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Visit booking deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting visit booking',
            error: error.message
        });
    }
})

// ==================== FIND MY FIT API ====================

// Match reason generator (place this BEFORE the route)
function generateMatchReason(goal, intensity, experience) {
    const reasons = {
        weight_loss: 'Burns maximum calories and boosts metabolism',
        muscle_gain: 'Focuses on strength building and muscle development',
        endurance: 'Builds cardiovascular stamina and aerobic capacity',
        flexibility: 'Improves range of motion and body awareness',
        general_fitness: 'Provides balanced, full-body conditioning'
    };

    const experienceMod = {
        beginner: ', with modifications for newcomers',
        intermediate: ', perfect for your fitness level',
        advanced: ', challenging enough for experienced athletes'
    };

    return reasons[goal] + experienceMod[experience];
}

// Class matching rules (place this BEFORE the route)
const classMatchingRules = {
    weight_loss: {
        high: ['Crossfit', 'HIIT', 'Cardio Blast', 'Boot Camp'],
        moderate: ['Circuit Training', 'Cardio Dance', 'Boxing'],
        low: ['Walking Club', 'Aqua Aerobics']
    },
    muscle_gain: {
        high: ['Crossfit', 'Powerlifting', 'Strength Training'],
        moderate: ['Functional Training', 'Kettlebell'],
        low: ['Resistance Band Training']
    },
    endurance: {
        high: ['Crossfit', 'Running Club', 'Cycling'],
        moderate: ['Rowing', 'Swim Training'],
        low: ['Walking', 'Light Cardio']
    },
    flexibility: {
        high: ['Advanced Yoga', 'Gymnastics'],
        moderate: ['Zen Core', 'Pilates', 'Yoga'],
        low: ['Gentle Stretch', 'Mobility Flow']
    },
    general_fitness: {
        high: ['Crossfit', 'HIIT'],
        moderate: ['Group Fitness', 'Athletic Conditioning'],
        low: ['General Wellness', 'Active Recovery']
    }
};

// POST - Submit Find My Fit Form
router.post('/find-my-fit', async (req, res) => {
    const { goal, experience, intensity, duration, health_notes, name, email, phone, contact_trainer } = req.body;

    console.log('📥 Received Find My Fit submission:', req.body);

    try {
        // 1. Save user submission to database
        const [submissionResult] = await db.query(
            `INSERT INTO find_my_fit_submissions 
            (name, email, phone, goal, experience, intensity, duration, health_notes, contact_trainer) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, phone, goal, experience, intensity, parseInt(duration), health_notes || null, contact_trainer || false]
        );

        const submissionId = submissionResult.insertId;
        console.log('✅ Submission saved with ID:', submissionId);

        // 2. Get matching classes based on goal and intensity
        const matchingClassNames = classMatchingRules[goal]?.[intensity] || [];
        
        console.log('🔍 Looking for classes:', matchingClassNames);

        let recommendations = [];

        if (matchingClassNames.length === 0) {
            console.log('⚠️ No matching rules, fetching any available classes...');
            // Fallback: get any classes
            const [allClasses] = await db.query(
                `SELECT * FROM classes WHERE duration >= ? LIMIT 3`,
                [parseInt(duration)]
            );

            recommendations = allClasses.map(cls => ({
                ...cls,
                match_reason: 'Great option for your fitness journey'
            }));
        } else {
            // 3. Fetch matching classes from database
            const placeholders = matchingClassNames.map(() => '?').join(',');
            
            console.log('📊 SQL Query:', `SELECT c.*, t.trainerName as trainer_name FROM classes c LEFT JOIN trainer t ON c.trainer_id = t.trainerId WHERE c.class_name IN (${placeholders}) AND c.duration >= ?`);
            console.log('📊 Parameters:', [...matchingClassNames, parseInt(duration), experience]);

            // FIXED: Removed t.email which doesn't exist
            const [classes] = await db.query(
                `SELECT c.*, t.trainerName as trainer_name
                FROM classes c
                LEFT JOIN trainer t ON c.trainer_id = t.trainerId
                WHERE c.class_name IN (${placeholders}) AND c.duration >= ?
                ORDER BY 
                    CASE 
                        WHEN c.difficulty = ? THEN 1 
                        ELSE 2 
                    END,
                    c.duration ASC
                LIMIT 3`,
                [...matchingClassNames, parseInt(duration), experience]
            );

            console.log('✅ Found classes:', classes.length);

            // 4. Add match reasons
            recommendations = classes.map(cls => ({
                ...cls,
                match_reason: generateMatchReason(goal, intensity, experience)
            }));
        }

        // 5. If user wants trainer contact, notify trainers
        if (contact_trainer && recommendations.length > 0) {
            console.log(`📧 Notify trainers for user: ${name} (${email})`);
        }

        // 6. Log recommendations to database
        for (const rec of recommendations) {
            if (rec.class_id) {
                try {
                    await db.query(
                        `INSERT INTO find_my_fit_recommendations (submission_id, class_id) VALUES (?, ?)`,
                        [submissionId, rec.class_id]
                    );
                } catch (err) {
                    console.warn('Could not save recommendation:', err.message);
                }
            }
        }

        console.log('🎉 Sending response with', recommendations.length, 'recommendations');

        res.json({
            success: true,
            recommendations,
            userSubmission: { name, email, phone, submissionId }
        });

    } catch (error) {
        console.error('❌ Find My Fit Error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            sql: error.sql
        });
        
        res.status(500).json({
            success: false,
            message: 'Error processing your request',
            error: error.message
        });
    }
});

// GET - Get all Find My Fit submissions
router.get('/find-my-fit/submissions', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM find_my_fit_submissions ORDER BY created_at DESC'
        );
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching submissions',
            error: error.message
        });
    }
});

// GET - Get Find My Fit submission by ID
router.get('/find-my-fit/submissions/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM find_my_fit_submissions WHERE submission_id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching submission',
            error: error.message
        });
    }
});

// ==================== ADMIN AUTHENTICATION APIs ====================
// POST - Admin Login
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        console.log('📝 Login attempt:', { email, role });

        // Validate input
        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, password, and role'
            });
        }

        // Admin login (hardcoded for demo - you can create an admin table later)
        if (role === 'admin') {
            if (email === 'admin@crossbox.com' && password === 'admin123') {
                console.log('✅ Admin login successful');
                return res.json({
                    success: true,
                    message: 'Admin login successful',
                    user: {
                        id: 1,
                        email: email,
                        role: 'admin',
                        name: 'Admin'
                    }
                });
            } else {
                console.log('❌ Invalid admin credentials');
                return res.status(401).json({
                    success: false,
                    message: 'Invalid admin credentials'
                });
            }
        } 
        
        // Trainer login
        else if (role === 'trainer') {
            const [trainers] = await db.query(
                'SELECT * FROM trainer WHERE email = ? AND isActive = 1',
                [email]
            );
            
            if (trainers.length > 0) {
                // In production, verify hashed password here
                console.log('✅ Trainer login successful');
                return res.json({
                    success: true,
                    message: 'Trainer login successful',
                    user: {
                        id: trainers[0].trainerId,
                        email: trainers[0].email,
                        role: 'trainer',
                        name: trainers[0].trainerName
                    }
                });
            } else {
                console.log('❌ Trainer not found or inactive');
                return res.status(401).json({
                    success: false,
                    message: 'Invalid trainer credentials or account is inactive'
                });
            }
        } 
        
        // Member login
        else if (role === 'member') {
            const [members] = await db.query(
                'SELECT * FROM users WHERE email = ? AND isActive = 1',
                [email]
            );
            
            if (members.length > 0) {
                // In production, verify hashed password here
                console.log('✅ Member login successful');
                return res.json({
                    success: true,
                    message: 'Member login successful',
                    user: {
                        id: members[0].user_id,
                        email: members[0].email,
                        role: 'member',
                        name: members[0].user_name
                    }
                });
            } else {
                console.log('❌ Member not found or inactive');
                return res.status(401).json({
                    success: false,
                    message: 'Invalid member credentials or account is inactive'
                });
            }
        }

        // Invalid role
        return res.status(400).json({
            success: false,
            message: 'Invalid role selected'
        });

    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login: ' + error.message,
            error: error.message
        });
    }
});

// ==================== ADMIN DASHBOARD APIs ====================

// GET - Dashboard Statistics
router.get('/admin/dashboard-stats', async (req, res) => {
    try {
        console.log('📊 Fetching dashboard stats...');

        // Get total and active members
        const [memberStats] = await db.query(
            'SELECT COUNT(*) as total, SUM(CASE WHEN isActive = 1 THEN 1 ELSE 0 END) as active FROM users'
        );

        // Get total and active trainers
        const [trainerStats] = await db.query(
            'SELECT COUNT(*) as total, SUM(CASE WHEN isActive = 1 THEN 1 ELSE 0 END) as active FROM trainer'
        );

        // Get total classes
        const [classStats] = await db.query(
            'SELECT COUNT(*) as total FROM classes'
        );

        // Get recent bookings count (last 7 days)
        const [bookingStats] = await db.query(
            `SELECT COUNT(*) as recent FROM bookings 
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND isDeleted = 0`
        );

        console.log('✅ Stats fetched successfully');

        res.json({
            success: true,
            stats: {
                members: {
                    total: memberStats[0].total || 0,
                    active: memberStats[0].active || 0
                },
                trainers: {
                    total: trainerStats[0].total || 0,
                    active: trainerStats[0].active || 0
                },
                classes: {
                    total: classStats[0].total || 0
                },
                bookings: {
                    recent: bookingStats[0].recent || 0
                }
            }
        });

    } catch (error) {
        console.error('❌ Dashboard Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
});

// GET - All Members with Details
router.get('/admin/members', async (req, res) => {
    try {
        console.log('👥 Fetching all members...');

        const [members] = await db.query(`
            SELECT 
                u.*,
                t.trainerName as trainer_name
            FROM users u
            LEFT JOIN trainer t ON u.trainer_id = t.trainerId
            ORDER BY u.created_on DESC
        `);

        console.log(`✅ Fetched ${members.length} members`);

        res.json({
            success: true,
            count: members.length,
            data: members
        });
    } catch (error) {
        console.error('❌ Error fetching members:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching members',
            error: error.message
        });
    }
});

// GET - All Trainers with Details
router.get('/admin/trainers', async (req, res) => {
    try {
        console.log('💪 Fetching all trainers...');

        const [trainers] = await db.query(`
            SELECT 
                t.trainerId,
                t.trainercode,
                t.trainername as trainerName,
                t.traineremail as email,
                t.trainerphonenumber as phone,
                t.specialisation,
                t.experienceyears as experience,
                t.certification as bio,
                t.isActive,
                t.created_on,
                t.modified_on,
                COUNT(DISTINCT u.user_id) as member_count
            FROM trainer t
            LEFT JOIN users u ON t.trainerId = u.trainer_id
            GROUP BY t.trainerId, t.trainercode, t.trainername, t.traineremail, 
                     t.trainerphonenumber, t.specialisation, t.experienceyears, 
                     t.certification, t.isActive, t.created_on, t.modified_on
            ORDER BY t.created_on DESC
        `);

        console.log(`✅ Fetched ${trainers.length} trainers`);
        
        res.json({
            success: true,
            count: trainers.length,
            data: trainers
        });
    } catch (error) {
        console.error('❌ Error fetching trainers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching trainers',
            error: error.message
        });
    }
});

// GET - All Classes with Details
router.get('/admin/classes', async (req, res) => {
    try {
        console.log('📚 Fetching all classes...');

        const [classes] = await db.query(`
            SELECT 
                c.class_id,
                c.class_desc as class_name,
                c.difficulty,
                c.duration,
                c.intensity,
                c.trainer_id,
                t.trainername as trainer_name,
                COUNT(DISTINCT e.enrollment_id) as enrolled_count
            FROM classes c
            LEFT JOIN trainer t ON c.trainer_id = t.trainerId
            LEFT JOIN enrollments e ON c.class_desc COLLATE utf8mb4_unicode_ci = e.class_name COLLATE utf8mb4_unicode_ci
            GROUP BY c.class_id, c.class_desc, c.difficulty, c.duration, 
                     c.intensity, c.trainer_id, t.trainername
            ORDER BY c.class_desc
        `);

        console.log(`✅ Fetched ${classes.length} classes`);
        if (classes.length > 0) {
            console.log('Sample class:', classes[0]);
        }

        res.json({
            success: true,
            count: classes.length,
            data: classes
        });
    } catch (error) {
        console.error('❌ Error fetching classes:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching classes',
            error: error.message
        });
    }
});

// GET - Recent Activity
router.get('/admin/recent-activity', async (req, res) => {
    try {
        console.log('📋 Fetching recent activity...');

        // Get recent bookings
        const [bookings] = await db.query(`
            SELECT 'booking' as type, booking_id as id, full_name as name, 
                   class_name, booking_date as date, created_at
            FROM bookings 
            WHERE isDeleted = 0 
            ORDER BY created_at DESC 
            LIMIT 5
        `);

        // Get recent enrollments
        const [enrollments] = await db.query(`
            SELECT 'enrollment' as type, enrollment_id as id, full_name as name,
                   class_name, start_date as date, created_at
            FROM enrollments
            ORDER BY created_at DESC
            LIMIT 5
        `);

        // Get recent trial requests
        const [trials] = await db.query(`
            SELECT 'trial' as type, trial_id as id, 
                   CONCAT(first_name, ' ', last_name) as name,
                   preferred_start_date as date, created_at
            FROM free_trials
            WHERE isDeleted = 0
            ORDER BY created_at DESC
            LIMIT 5
        `);

        // Get recent facility visits
        const [visits] = await db.query(`
            SELECT 'visit' as type, visit_id as id,
                   CONCAT(first_name, ' ', last_name) as name,
                   visit_date as date, created_at
            FROM facility_visits
            WHERE isDeleted = 0
            ORDER BY created_at DESC
            LIMIT 5
        `);

        // Combine and sort all activities
        const allActivities = [...bookings, ...enrollments, ...trials, ...visits]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 10);

        console.log(`✅ Fetched ${allActivities.length} activities`);

        res.json({
            success: true,
            data: allActivities
        });

    } catch (error) {
        console.error('❌ Error fetching recent activity:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recent activity',
            error: error.message
        });
    }
});

// PUT - Toggle User Status (Enable/Disable)
router.put('/admin/toggle-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        console.log(`🔄 Toggling user ${userId} status...`);

        // Get current status
        const [user] = await db.query('SELECT isActive FROM users WHERE user_id = ?', [userId]);
        
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Toggle status
        const newStatus = user[0].isActive === 1 ? 0 : 1;
        
        await db.query(
            'UPDATE users SET isActive = ?, modified_on = NOW() WHERE user_id = ?',
            [newStatus, userId]
        );

        console.log(`✅ User ${userId} ${newStatus === 1 ? 'enabled' : 'disabled'}`);

        res.json({
            success: true,
            message: `User ${newStatus === 1 ? 'enabled' : 'disabled'} successfully`,
            isActive: newStatus
        });

    } catch (error) {
        console.error('❌ Error toggling user status:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling user status',
            error: error.message
        });
    }
});

// PUT - Toggle Trainer Status (Enable/Disable)
router.put('/admin/toggle-trainer/:id', async (req, res) => {
    try {
        const trainerId = req.params.id;
        
        console.log(`🔄 Toggling trainer ${trainerId} status...`);

        // Get current status
        const [trainer] = await db.query('SELECT isActive FROM trainer WHERE trainerId = ?', [trainerId]);
        
        if (trainer.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Trainer not found'
            });
        }

        // Toggle status
        const newStatus = trainer[0].isActive === 1 ? 0 : 1;
        
        await db.query(
            'UPDATE trainer SET isActive = ?, modified_on = NOW() WHERE trainerId = ?',
            [newStatus, trainerId]
        );

        console.log(`✅ Trainer ${trainerId} ${newStatus === 1 ? 'enabled' : 'disabled'}`);

        res.json({
            success: true,
            message: `Trainer ${newStatus === 1 ? 'enabled' : 'disabled'} successfully`,
            isActive: newStatus
        });

    } catch (error) {
        console.error('❌ Error toggling trainer status:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling trainer status',
            error: error.message
        });
    }
});

// GET - New Members (Last 30 days)
router.get('/admin/new-members', async (req, res) => {
    try {
        const [members] = await db.query(`
            SELECT * FROM users 
            WHERE created_on >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            ORDER BY created_on DESC
        `);

        res.json({
            success: true,
            count: members.length,
            data: members
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching new members',
            error: error.message
        });
    }
});

module.exports = router;

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
            trainerName, 
            email, 
            phone, 
            specialisation, 
            experience, 
            bio, 
            isActive, 
            created_by 
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO trainer (trainerName, email, phone, specialisation, experience, bio, isActive, created_by, modified_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [trainerName, email, phone, specialisation, experience, bio, isActive, created_by, created_by]
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
            trainerName, 
            email, 
            phone, 
            specialisation, 
            experience, 
            bio, 
            isActive, 
            modified_by 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE trainer SET trainerName = ?, email = ?, phone = ?, specialisation = ?, experience = ?, 
             bio = ?, isActive = ?, modified_by = ?, modified_on = CURRENT_TIMESTAMP WHERE trainerId = ?`,
            [trainerName, email, phone, specialisation, experience, bio, isActive, modified_by, req.params.id]
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

module.exports = router;

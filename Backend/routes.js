// routes.js - All API Routes in One File
const express = require('express');
const router = express.Router();
const db = require('./db');

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
            trainergender, 
            trainerphonenumber, 
            specialisation, 
            experienceyears, 
            certification, 
            isActive, 
            created_by 
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO trainer (trainercode, trainername, traineremail, trainergender, trainerphonenumber, 
             specialisation, experienceyears, certification, isActive, created_by, modified_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [trainercode, trainername, traineremail, trainergender, trainerphonenumber, 
             specialisation, experienceyears, certification, isActive, created_by, created_by]
        );
        
        res.status(201).json({
            success: true,
            message: 'Trainer created successfully',
            trainerId: result.insertId
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
            trainergender, 
            trainerphonenumber, 
            specialisation, 
            experienceyears, 
            certification, 
            isActive, 
            modified_by 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE trainer SET trainercode = ?, trainername = ?, traineremail = ?, trainergender = ?, 
             trainerphonenumber = ?, specialisation = ?, experienceyears = ?, certification = ?, 
             isActive = ?, modified_by = ?, modified_on = CURRENT_TIMESTAMP WHERE trainerId = ?`,
            [trainercode, trainername, traineremail, trainergender, trainerphonenumber, 
             specialisation, experienceyears, certification, isActive, modified_by, req.params.id]
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

// ==================== PLAN APIs ====================

// 1. GET - Get all plans
router.get('/plans', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM plan');
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
        const [rows] = await db.query('SELECT * FROM plan WHERE planid = ?', [req.params.id]);
        
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
        const [rows] = await db.query('SELECT * FROM plan WHERE plan_level = ?', [req.params.level]);
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
        const [rows] = await db.query('SELECT * FROM plan WHERE isActive = ?', [isActive]);
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
            planname, 
            duration_days, 
            price, 
            description, 
            plan_level, 
            trainer_id, 
            isActive, 
            created_by 
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO plan (planname, duration_days, price, description, plan_level, trainer_id, 
             isActive, created_by, modified_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [planname, duration_days, price, description, plan_level, trainer_id, 
             isActive, created_by, created_by]
        );
        
        res.status(201).json({
            success: true,
            message: 'Plan created successfully',
            planid: result.insertId
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
            planname, 
            duration_days, 
            price, 
            description, 
            plan_level, 
            trainer_id, 
            isActive, 
            modified_by 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE plan SET planname = ?, duration_days = ?, price = ?, description = ?, 
             plan_level = ?, trainer_id = ?, isActive = ?, modified_by = ?, 
             modified_on = CURRENT_TIMESTAMP WHERE planid = ?`,
            [planname, duration_days, price, description, plan_level, trainer_id, 
             isActive, modified_by, req.params.id]
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
        const [result] = await db.query('DELETE FROM plan WHERE planid = ?', [req.params.id]);
        
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

// ==================== MEMBER SUBSCRIPTIONS APIs ====================

// 1. GET - Get all subscriptions
router.get('/subscriptions', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM memberSubscriptions');
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
        const [rows] = await db.query('SELECT * FROM memberSubscriptions WHERE subscription_id = ?', [req.params.id]);
        
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
        const [rows] = await db.query('SELECT * FROM memberSubscriptions WHERE memberid = ?', [req.params.memberId]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching member subscriptions',
            error: error.message
        });
    }
});

// 4. GET - Get subscriptions by plan ID
router.get('/subscriptions/plan/:planId', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM memberSubscriptions WHERE planid = ?', [req.params.planId]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching plan subscriptions',
            error: error.message
        });
    }
});

// 5. GET - Get subscriptions by payment status
router.get('/subscriptions/payment/:status', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM memberSubscriptions WHERE paymentStatus = ?', [req.params.status]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching subscriptions by payment status',
            error: error.message
        });
    }
});

// 6. GET - Get subscriptions by membership status
router.get('/subscriptions/memstatus/:status', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM memberSubscriptions WHERE memsubstatus = ?', [req.params.status]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching subscriptions by membership status',
            error: error.message
        });
    }
});

// 7. POST - Create new subscription
router.post('/subscriptions', async (req, res) => {
    try {
        const { 
            memberid, 
            planid, 
            startDate, 
            endDate, 
            amountPaid, 
            paymentStatus, 
            memsubstatus 
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO memberSubscriptions (memberid, planid, startDate, endDate, amountPaid, 
             paymentStatus, memsubstatus) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [memberid, planid, startDate, endDate, amountPaid, paymentStatus, memsubstatus]
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
            memberid, 
            planid, 
            startDate, 
            endDate, 
            amountPaid, 
            paymentStatus, 
            memsubstatus 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE memberSubscriptions SET memberid = ?, planid = ?, startDate = ?, endDate = ?, 
             amountPaid = ?, paymentStatus = ?, memsubstatus = ? WHERE subscription_id = ?`,
            [memberid, planid, startDate, endDate, amountPaid, paymentStatus, memsubstatus, req.params.id]
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
        const [result] = await db.query('DELETE FROM memberSubscriptions WHERE subscription_id = ?', [req.params.id]);
        
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

// ==================== MODAL ROUTES ====================

// ==================== JOIN NOW MODAL APIs ====================

// POST - Submit Join Now Form (Create New User/Member)
router.post('/join-now', async (req, res) => {
    try {
        const { 
            firstName,
            lastName,
            email, 
            phone,
            membershipType,
            fitnessGoals,  // Array of goals: ['weight-loss', 'muscle-gain', etc.]
            experienceLevel,
            additionalNotes
        } = req.body;
        
        // Create full name
        const fullName = `${firstName} ${lastName}`;
        
        // Create user in users table
        const [result] = await db.query(
            `INSERT INTO users (user_name, first_name, last_name, email, password_hash, user_phone, 
             membership_type, experience_level, additional_notes, isActive, isDeleted, created_by, modified_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 'web_form', 'web_form')`,
            [fullName, firstName, lastName, email, 'temp_password_123', phone, 
             membershipType, experienceLevel, additionalNotes]
        );
        
        const userId = result.insertId;
        
        // Insert fitness goals if provided
        if (fitnessGoals && Array.isArray(fitnessGoals) && fitnessGoals.length > 0) {
            const goalValues = fitnessGoals.map(goal => [userId, goal]);
            await db.query(
                'INSERT INTO user_fitness_goals (user_id, goal_type) VALUES ?',
                [goalValues]
            );
        }
        
        res.status(201).json({
            success: true,
            message: 'Welcome to CrossBox! Your membership has been created successfully.',
            data: {
                user_id: userId,
                name: fullName,
                email: email,
                membership_type: membershipType
            }
        });
    } catch (error) {
        // Check for duplicate email
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists. Please login or use a different email.',
                error: 'Duplicate email'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error creating membership. Please try again.',
            error: error.message
        });
    }
});

// GET - Get user with fitness goals
router.get('/members/:id/goals', async (req, res) => {
    try {
        // Get user info
        const [userRows] = await db.query('SELECT * FROM users WHERE user_id = ?', [req.params.id]);
        
        if (userRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }
        
        // Get fitness goals
        const [goalRows] = await db.query(
            'SELECT goal_type FROM user_fitness_goals WHERE user_id = ?',
            [req.params.id]
        );
        
        const user = userRows[0];
        user.fitness_goals = goalRows.map(g => g.goal_type);
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching member details',
            error: error.message
        });
    }
});

// ==================== QUICK BOOK MODAL APIs ====================

// POST - Submit Quick Book Form (Create New Booking)
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
        
        const [result] = await db.query(
            `INSERT INTO bookings (full_name, email, phone, class_name, booking_date, time_slot, 
             num_participants, special_requirements, reminder_sms, reminder_email, waitlist, booking_status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [fullName, email, phone, className, bookingDate, timeSlot, 
             numParticipants || 1, specialRequirements, reminderSMS || false, 
             reminderEmail || false, waitlist || false, waitlist ? 'Waitlist' : 'Confirmed']
        );
        
        res.status(201).json({
            success: true,
            message: waitlist 
                ? 'You have been added to the waitlist. We will notify you when a slot opens up.' 
                : 'Your class has been booked successfully! See you at the gym!',
            data: {
                booking_id: result.insertId,
                full_name: fullName,
                class_name: className,
                booking_date: bookingDate,
                time_slot: timeSlot,
                status: waitlist ? 'Waitlist' : 'Confirmed'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating booking. Please try again.',
            error: error.message
        });
    }
});

// GET - Get all bookings
router.get('/bookings', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM bookings WHERE isDeleted = 0 ORDER BY booking_date DESC, time_slot ASC');
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

// GET - Get single booking by ID
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


module.exports = router;
// chatbot.js - AI-Powered Gym Chatbot with Database Integration
const db = require('./db');

class GymChatbot {
    constructor() {
        this.conversationHistory = [];
    }

    // Main method to process user messages
    async processMessage(userMessage) {
        try {
            const lowercaseMsg = userMessage.toLowerCase();
            
            // Intent detection - what user is asking about
            if (this.matchesIntent(lowercaseMsg, ['subscription', 'plan', 'membership', 'price', 'cost', 'fee'])) {
                return await this.handleSubscriptionQuery(userMessage);
            } 
            else if (this.matchesIntent(lowercaseMsg, ['workout', 'exercise', 'class', 'training', 'session', 'classes'])) {
                return await this.handleWorkoutQuery(userMessage);
            } 
            else if (this.matchesIntent(lowercaseMsg, ['trainer', 'coach', 'instructor', 'specialist'])) {
                return await this.handleTrainerQuery(userMessage);
            } 
            else if (this.matchesIntent(lowercaseMsg, ['member', 'user', 'profile', 'account', 'registration'])) {
                return await this.handleMembershipQuery(userMessage);
            }
            else if (this.matchesIntent(lowercaseMsg, ['booking', 'reserve', 'appointment', 'schedule'])) {
                return await this.handleBookingQuery(userMessage);
            }
            else if (this.matchesIntent(lowercaseMsg, ['hello', 'hi', 'hey', 'greet', 'good morning', 'how are you'])) {
                return this.getGreeting();
            }
            else if (this.matchesIntent(lowercaseMsg, ['help', 'support', 'assist', 'question'])) {
                return this.getHelpInfo();
            }
            else if (this.matchesIntent(lowercaseMsg, ['gym', 'location', 'address', 'hours', 'timing', 'open', 'about'])) {
                return this.getGymInfo();
            }
            else {
                return this.getDefaultResponse();
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            return {
                success: false,
                message: "Sorry, I encountered an error. Please try again or contact our support team.",
                error: error.message
            };
        }
    }

    // Intent matching function
    matchesIntent(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    // Handle subscription/plan queries
    async handleSubscriptionQuery(userMessage) {
        try {
            const [plans] = await db.query('SELECT * FROM plans WHERE isActive = 1');
            
            if (plans.length === 0) {
                return {
                    success: true,
                    message: "We currently don't have any active subscription plans listed. Please contact our support team for more information.",
                    type: 'subscription'
                };
            }

            // Format plan information
            let planInfo = "📋 <b>Our Subscription Plans:</b>\n\n";
            plans.forEach((plan, index) => {
                planInfo += `<b>${plan.planName}</b>\n`;
                planInfo += `💪 Level: ${plan.planLevel}\n`;
                planInfo += `💵 Price: ₹${plan.planPrice}/month\n`;
                planInfo += `📝 Description: ${plan.planDesc}\n`;
                if (plan.planDuration) planInfo += `⏱️ Duration: ${plan.planDuration}\n`;
                planInfo += "\n";
            });

            planInfo += "💡 Would you like to know more about any specific plan, or would you like to enroll?";

            return {
                success: true,
                message: planInfo,
                type: 'subscription',
                data: plans
            };
        } catch (error) {
            return {
                success: false,
                message: "I couldn't fetch the subscription plans. Please try again.",
                error: error.message
            };
        }
    }

    // Handle workout/class queries
    async handleWorkoutQuery(userMessage) {
        try {
            const [classes] = await db.query('SELECT * FROM bookings GROUP BY class_name LIMIT 10');
            
            let response = "🏋️ <b>Classes Available at CrossBox:</b>\n\n";
            
            if (classes.length === 0) {
                response = "We have various workout classes and training sessions available. Here's what we offer:\n\n";
                response += "• <b>Strength Training</b> - Build muscle and increase power\n";
                response += "• <b>CrossFit</b> - High-intensity functional training\n";
                response += "• <b>Cardio Classes</b> - Burn calories and improve endurance\n";
                response += "• <b>Yoga & Flexibility</b> - Improve flexibility and mental peace\n";
                response += "• <b>Personal Training</b> - One-on-one customized sessions\n";
                response += "• <b>Group Classes</b> - Team-based workout sessions\n\n";
            } else {
                classes.forEach((cls, index) => {
                    response += `${index + 1}. <b>${cls.class_name}</b> - Check our schedule for availability\n`;
                });
                response += "\n";
            }

            response += "📅 Would you like to book a class or know about our training programs? Feel free to ask!";

            return {
                success: true,
                message: response,
                type: 'workout',
                data: classes
            };
        } catch (error) {
            return {
                success: false,
                message: "I couldn't retrieve the workout information. Please try again.",
                error: error.message
            };
        }
    }

    // Handle trainer queries
    async handleTrainerQuery(userMessage) {
        try {
            const [trainers] = await db.query('SELECT * FROM trainer WHERE isActive = 1 LIMIT 10');
            
            if (trainers.length === 0) {
                return {
                    success: true,
                    message: "We have experienced and certified trainers available. Please contact our support team to get connected with the right trainer for your fitness goals!",
                    type: 'trainer'
                };
            }

            let trainerInfo = "👨‍🏫 <b>Our Expert Trainers:</b>\n\n";
            trainers.forEach((trainer, index) => {
                trainerInfo += `<b>${index + 1}. ${trainer.trainerName}</b>\n`;
                trainerInfo += `🎯 Specialization: ${trainer.specialisation}\n`;
                if (trainer.email) trainerInfo += `📧 Email: ${trainer.email}\n`;
                if (trainer.phone) trainerInfo += `📱 Phone: ${trainer.phone}\n`;
                trainerInfo += "\n";
            });

            trainerInfo += "💬 Would you like to book a session with any of our trainers?";

            return {
                success: true,
                message: trainerInfo,
                type: 'trainer',
                data: trainers
            };
        } catch (error) {
            return {
                success: false,
                message: "I couldn't retrieve trainer information. Please contact our support team.",
                error: error.message
            };
        }
    }

    // Handle membership/user queries
    async handleMembershipQuery(userMessage) {
        try {
            const [users] = await db.query('SELECT COUNT(*) as total_members FROM users WHERE isActive = 1');
            const memberCount = users[0]?.total_members || 0;

            let response = "👥 <b>Membership Information:</b>\n\n";
            response += `✨ We have ${memberCount} active members in our gym family!\n\n`;
            response += "📋 <b>Membership Types:</b>\n";
            response += "• Standard - Access to all gym facilities\n";
            response += "• Premium - Gym access + Personal training sessions\n";
            response += "• Elite - Full access + Nutrition consultation\n\n";
            response += "🎁 <b>Member Benefits:</b>\n";
            response += "✓ Access to state-of-the-art equipment\n";
            response += "✓ Group fitness classes\n";
            response += "✓ Expert trainer guidance\n";
            response += "✓ Progress tracking and assessment\n";
            response += "✓ Community support and events\n\n";
            response += "🚀 Want to become a member? Let me help you get started!";

            return {
                success: true,
                message: response,
                type: 'membership'
            };
        } catch (error) {
            return {
                success: false,
                message: "I couldn't fetch membership details. Please try again.",
                error: error.message
            };
        }
    }

    // Handle booking queries
    async handleBookingQuery(userMessage) {
        try {
            const [bookings] = await db.query('SELECT DISTINCT class_name FROM bookings WHERE isDeleted = 0 LIMIT 10');
            
            let response = "📅 <b>Class Booking Information:</b>\n\n";
            response += "🎯 <b>How to Book a Class:</b>\n";
            response += "1. Choose your preferred class\n";
            response += "2. Select your desired date and time slot\n";
            response += "3. Provide your details\n";
            response += "4. Confirm your booking\n\n";

            if (bookings.length > 0) {
                response += "<b>Popular Classes:</b>\n";
                bookings.forEach((booking, index) => {
                    response += `${index + 1}. ${booking.class_name}\n`;
                });
            }

            response += "\n📌 <b>Available Time Slots:</b>\n";
            response += "• Morning: 6:00 AM - 10:00 AM\n";
            response += "• Afternoon: 12:00 PM - 4:00 PM\n";
            response += "• Evening: 5:00 PM - 9:00 PM\n\n";
            response += "🎫 Ready to book? Click the button below to get started!";

            return {
                success: true,
                message: response,
                type: 'booking'
            };
        } catch (error) {
            return {
                success: false,
                message: "I couldn't retrieve booking information. Please try again.",
                error: error.message
            };
        }
    }

    // Greeting response
    getGreeting() {
        const greetings = [
            "Hello! 👋 Welcome to CrossBox Fitness! I'm your gym assistant. How can I help you today? Feel free to ask about our subscription plans, classes, trainers, or bookings!",
            "Hi there! 💪 Welcome to CrossBox! I'm here to answer any questions about our gym services, membership plans, and classes. What would you like to know?",
            "Hey! 🏋️ Thanks for visiting CrossBox. I'm your virtual fitness guide. Ask me about anything - from memberships to workout classes!"
        ];
        return {
            success: true,
            message: greetings[Math.floor(Math.random() * greetings.length)],
            type: 'greeting'
        };
    }

    // Help information
    getHelpInfo() {
        const helpMessage = `❓ <b>How Can I Help You?</b>\n\n
I can provide information about:\n
📋 <b>Subscriptions & Plans</b> - Ask about our membership options and pricing\n
🏋️ <b>Workouts & Classes</b> - Information about available classes and training\n
👨‍🏫 <b>Trainers</b> - Details about our expert trainers and their specializations\n
👥 <b>Membership</b> - Member benefits and registration information\n
📅 <b>Class Booking</b> - How to book classes and available time slots\n
🏢 <b>Gym Info</b> - Location, hours, and general information\n\n
Just type your question naturally, and I'll try my best to help! 😊`;

        return {
            success: true,
            message: helpMessage,
            type: 'help'
        };
    }

    // Gym information
    getGymInfo() {
        const gymInfo = `🏢 <b>CrossBox Fitness Gym</b>\n\n
💪 <b>About Us:</b>\n
CrossBox is a premier fitness facility dedicated to transforming lives through fitness, strength, and community.\n\n
📍 <b>Location:</b>\n
[Your Gym Address]\n\n
🕐 <b>Operating Hours:</b>\n
Monday - Friday: 6:00 AM - 10:00 PM\n
Saturday: 7:00 AM - 8:00 PM\n
Sunday: 8:00 AM - 6:00 PM\n\n
🎯 <b>Our Mission:</b>\n
To inspire and empower our members to achieve their fitness goals in a supportive and professional environment.\n\n
📞 <b>Contact Us:</b>\n
Call or visit our website for more information!`;

        return {
            success: true,
            message: gymInfo,
            type: 'gym_info'
        };
    }

    // Default response for unmatched queries
    getDefaultResponse() {
        const responses = [
            "I didn't quite understand that. Could you rephrase? I can help with subscriptions, classes, trainers, bookings, or general gym information. 😊",
            "That's an interesting question! I specialize in gym information. Try asking about our plans, workouts, trainers, or memberships! 💪",
            "Hmm, I'm not sure about that one. Ask me about subscriptions, classes, trainers, or how to book a session! 🏋️"
        ];
        return {
            success: true,
            message: responses[Math.floor(Math.random() * responses.length)],
            type: 'default'
        };
    }
}

module.exports = new GymChatbot();
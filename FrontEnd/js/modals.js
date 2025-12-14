// ==================== MODALS.JS - Form Submission Handler (COMPLETELY FIXED) ====================
// This file handles all modal form submissions for CrossBox Fitness

// API Base URL - Change this to your backend URL
const API_BASE_URL = 'http://localhost:3000/api';

// ==================== JOIN NOW MODAL SUBMISSION ====================
document.addEventListener('DOMContentLoaded', function() {
    const joinForm = document.getElementById('joinForm');
    
    if (joinForm) {
        joinForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('📝 Join Now form submitted');
            
            // Show loading state
            const submitBtn = joinForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Processing...';
            
            try {
                // Get all fitness goals checkboxes that are checked (excluding terms)
                const fitnessGoals = [];
                joinForm.querySelectorAll('.checkbox-input:checked').forEach(cb => {
                    if (cb.id !== 'terms' && cb.value !== 'terms') {
                        fitnessGoals.push(cb.value);
                    }
                });
                
                // Prepare data object with specific selectors
                const data = {
                    firstName: joinForm.querySelector('input[placeholder="John"]').value.trim(),
                    lastName: joinForm.querySelector('input[placeholder="Doe"]').value.trim(),
                    email: joinForm.querySelector('input[type="email"]').value.trim(),
                    phone: joinForm.querySelector('input[type="tel"]').value.trim(),
                    membershipType: joinForm.querySelectorAll('.form-select')[0].value,
                    experienceLevel: joinForm.querySelectorAll('.form-select')[1].value,
                    fitnessGoals: fitnessGoals,
                    additionalNotes: joinForm.querySelector('.form-textarea') ? joinForm.querySelector('.form-textarea').value.trim() : ''
                };
                
                console.log('✅ Join Now data collected:', data);
                
                // Validate required fields
                if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.membershipType || !data.experienceLevel) {
                    alert('Please fill in all required fields');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    return;
                }
                
                // Submit to API
                const response = await fetch(`${API_BASE_URL}/join-now`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Success
                    showSuccessMessage(
                        'Welcome to CrossBox! 🎉',
                        result.message + ' We\'re excited to have you on board!'
                    );
                    
                    // Reset form
                    joinForm.reset();
                    
                    // Close modal after 2 seconds
                    setTimeout(() => {
                        closeModal();
                    }, 2000);
                } else {
                    // Error from server
                    showErrorMessage('Oops!', result.message);
                }
                
            } catch (error) {
                console.error('❌ Error submitting join form:', error);
                showErrorMessage(
                    'Connection Error',
                    'Unable to submit form. Please check your internet connection and try again.'
                );
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
});

// ==================== QUICK BOOK MODAL SUBMISSION (FIXED) ====================
document.addEventListener('DOMContentLoaded', function() {
    const quickBookForm = document.getElementById('quickBookForm');
    
    if (quickBookForm) {
        quickBookForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('📝 Quick Book form submitted');
            
            // Show loading state
            const submitBtn = quickBookForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Booking...';
            
            try {
                // Get all inputs from the Quick Book form
                const allInputs = quickBookForm.querySelectorAll('.form-input');
                const allSelects = quickBookForm.querySelectorAll('.form-select');
                
                console.log('🔍 Found inputs:', allInputs.length);
                console.log('🔍 Found selects:', allSelects.length);
                
                // Quick Book Modal Field Order (from HTML):
                // Input 0: Full Name (text, placeholder="John Doe")
                // Input 1: Phone (tel, placeholder="(555) 123-4567") 
                // Input 2: Email (email, placeholder="john.doe@example.com")
                // Input 3: Booking Date (date, id="bookingDate")
                // Select 0: Class Selection (id="classSelect")
                // Select 1: Time Slot
                // Select 2: Number of Participants
                
                const fullName = allInputs[0].value.trim();
                const phone = allInputs[1].value.trim();
                const email = allInputs[2].value.trim();
                const bookingDate = allInputs[3].value;
                const className = allSelects[0].value;
                const timeSlot = allSelects[1].value;
                const numParticipants = parseInt(allSelects[2].value) || 1;
                const specialRequirements = quickBookForm.querySelector('.form-textarea') ? quickBookForm.querySelector('.form-textarea').value.trim() : '';
                
                // Get checkbox preferences
                const checkboxes = quickBookForm.querySelectorAll('.checkbox-input:not(#bookingTerms)');
                const reminderSMS = checkboxes[0] ? checkboxes[0].checked : false;
                const reminderEmail = checkboxes[1] ? checkboxes[1].checked : false;
                const waitlist = checkboxes[2] ? checkboxes[2].checked : false;
                
                const data = {
                    fullName,
                    phone,
                    email,
                    className,
                    bookingDate,
                    timeSlot,
                    numParticipants,
                    specialRequirements,
                    reminderSMS,
                    reminderEmail,
                    waitlist
                };
                
                console.log('✅ Quick Book data collected:', data);
                
                // Validate required fields
                if (!fullName || !phone || !email || !className || !bookingDate || !timeSlot) {
                    alert('Please fill in all required fields');
                    console.log('❌ Validation failed:', {
                        fullName: !!fullName,
                        phone: !!phone,
                        email: !!email,
                        className: !!className,
                        bookingDate: !!bookingDate,
                        timeSlot: !!timeSlot
                    });
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    return;
                }
                
                // Submit to API
                const response = await fetch(`${API_BASE_URL}/quick-book`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Success
                    const icon = result.data.status === 'Waitlist' ? '⏰' : '✅';
                    showSuccessMessage(
                        `${icon} Booking ${result.data.status}!`,
                        result.message
                    );
                    
                    // Reset form
                    quickBookForm.reset();
                    
                    // Close modal after 2 seconds
                    setTimeout(() => {
                        closeQuickBookModal();
                    }, 2000);
                } else {
                    // Error from server
                    showErrorMessage('Booking Failed', result.message);
                }
                
            } catch (error) {
                console.error('❌ Error submitting booking form:', error);
                showErrorMessage(
                    'Connection Error',
                    'Unable to submit booking. Please check your internet connection and try again.'
                );
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
});

// ==================== ENROLL MODAL SUBMISSION (FIXED) ====================
document.addEventListener('DOMContentLoaded', function() {
    const enrollForm = document.getElementById('enrollForm');
    
    if (enrollForm) {
        enrollForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('📝 Enroll form submitted');
            
            // Show loading state
            const submitBtn = enrollForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Enrolling...';
            
            try {
                console.log('🔍 ENROLL FORM DEBUGGING:');
                
                // CRITICAL: Get inputs and selects ONLY from within enrollForm (not entire page)
                const formInputs = enrollForm.querySelectorAll('input.form-input');
                const formSelects = enrollForm.querySelectorAll('select.form-select');
                
                console.log('📊 Form inputs found:', formInputs.length);
                console.log('📊 Form selects found:', formSelects.length);
                
                // Log what we actually find
                formInputs.forEach((input, i) => {
                    console.log(`Input[${i}]:`, input.placeholder, '=', input.value);
                });
                
                formSelects.forEach((select, i) => {
                    console.log(`Select[${i}]:`, select.id, '=', select.value);
                });
                
                // Extract values using the EXACT order from your Enroll Modal HTML
                // Based on your HTML structure:
                // Row 1: First Name, Last Name
                // Row 2: Email, Phone  
                // Select: Class, Enrollment Type, Schedule, Date, Experience
                
                const firstName = formInputs[0]?.value.trim() || '';
                const lastName = formInputs[1]?.value.trim() || '';
                const email = formInputs[2]?.value.trim() || '';
                const phone = formInputs[3]?.value.trim() || '';
                const startDate = formInputs[4]?.value || '';
                
                const className = formSelects[0]?.value || '';
                const enrollmentType = formSelects[1]?.value || '';
                const preferredSchedule = formSelects[2]?.value || '';
                const experienceLevel = formSelects[3]?.value || '';
                
                // Get fitness goals checkboxes
                const fitnessGoals = [];
                enrollForm.querySelectorAll('.checkbox-group .checkbox-input:checked').forEach(cb => {
                    if (cb.value && cb.id !== 'enrollTerms') {
                        fitnessGoals.push(cb.value);
                    }
                });
                
                // Get medical conditions
                const medicalConditions = enrollForm.querySelector('.form-textarea') ? enrollForm.querySelector('.form-textarea').value.trim() : '';
                
                const data = {
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
                };
                
                console.log('✅ Enroll data collected:', data);
                
                // Validate required fields
                if (!firstName || !lastName || !email || !phone || !className || !enrollmentType || !preferredSchedule || !startDate || !experienceLevel) {
                    alert('Please fill in all required fields');
                    console.log('❌ Validation failed:', {
                        firstName: !!firstName,
                        lastName: !!lastName,
                        email: !!email,
                        phone: !!phone,
                        className: !!className,
                        enrollmentType: !!enrollmentType,
                        preferredSchedule: !!preferredSchedule,
                        startDate: !!startDate,
                        experienceLevel: !!experienceLevel
                    });
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    return;
                }
                
                // Submit to API
                const response = await fetch(`${API_BASE_URL}/enroll`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showSuccessMessage(
                        '🎉 Enrollment Successful!',
                        result.message
                    );
                    enrollForm.reset();
                    setTimeout(() => {
                        closeEnrollModal();
                    }, 2000);
                } else {
                    showErrorMessage('Enrollment Failed', result.message);
                }
                
            } catch (error) {
                console.error('❌ Error submitting enroll form:', error);
                showErrorMessage(
                    'Connection Error',
                    'Unable to submit enrollment. Please check your internet connection and try again.'
                );
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
});

// ==================== HELPER FUNCTIONS ====================

// Show success message
function showSuccessMessage(title, message) {
    alert(`${title}\n\n${message}`);
}

// Show error message
function showErrorMessage(title, message) {
    alert(`❌ ${title}\n\n${message}`);
}

// Set minimum date for booking (today)
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    const enrollDateInput = document.getElementById('enrollStartDate');
    if (enrollDateInput) {
        const today = new Date().toISOString().split('T')[0];
        enrollDateInput.setAttribute('min', today);
    }
});

console.log('✅ Modals.js (COMPLETELY FIXED VERSION) loaded successfully!');

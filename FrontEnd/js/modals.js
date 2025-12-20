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
                    showErrorMessage('Missing Information', 'Please fill in all required fields');
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

// ==================== QUICK BOOK MODAL SUBMISSION (COMPLETELY FIXED) ====================
document.addEventListener('DOMContentLoaded', function() {
    const quickBookForm = document.getElementById('quickBookForm');
    
    if (quickBookForm) {
        // Remove any existing listeners to avoid duplicates
        const newForm = quickBookForm.cloneNode(true);
        quickBookForm.parentNode.replaceChild(newForm, quickBookForm);
        
        newForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📝 Quick Book form submitted');
            
            // Show loading state
            const submitBtn = newForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Booking...';
            
            try {
                console.log('🔍 QUICK BOOK - DIRECT VALUE EXTRACTION');
                
                // Get values DIRECTLY - no arrays, no loops, just direct access
                const fullName = newForm.querySelector('input[type="text"]').value.trim();
                const phone = newForm.querySelector('input[type="tel"]').value.trim();
                const email = newForm.querySelector('input[type="email"]').value.trim();
                const bookingDate = newForm.querySelector('input[type="date"]').value;
                
                // Get selects by their exact position in the form
                const allSelects = newForm.querySelectorAll('select');
                const className = allSelects[0].value; // First select = Class
                const timeSlot = allSelects[1].value;  // Second select = Time
                const numParticipants = parseInt(allSelects[2].value) || 1; // Third select = Participants
                
                // Get textarea
                const specialRequirements = newForm.querySelector('textarea').value.trim();
                
                // Get checkboxes (not including the terms checkbox)
                const checkboxes = newForm.querySelectorAll('.checkbox-input:not(#bookingTerms)');
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
                    showErrorMessage('Missing Information', 'Please fill in all required fields');
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
                    newForm.reset();
                    
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

// ==================== ENROLL MODAL SUBMISSION (COMPLETELY FIXED) ====================
document.addEventListener('DOMContentLoaded', function() {
    const enrollForm = document.getElementById('enrollForm');
    
    if (enrollForm) {
        // Remove any existing listeners to avoid duplicates
        const newEnrollForm = enrollForm.cloneNode(true);
        enrollForm.parentNode.replaceChild(newEnrollForm, enrollForm);
        
        newEnrollForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📝 Enroll form submitted');
            
            // Show loading state
            const submitBtn = newEnrollForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Enrolling...';
            
            try {
                console.log('🔍 ENROLL - DIRECT VALUE EXTRACTION');
                
                // Get text inputs by position (First Name, Last Name in first row, Email, Phone in second row)
                const textInputs = newEnrollForm.querySelectorAll('input[type="text"]');
                const firstName = textInputs[0]?.value.trim() || '';
                const lastName = textInputs[1]?.value.trim() || '';
                
                // Get email and phone
                const email = newEnrollForm.querySelector('input[type="email"]').value.trim();
                const phone = newEnrollForm.querySelector('input[type="tel"]').value.trim();
                
                // Get date
                const startDate = newEnrollForm.querySelector('input[type="date"]').value;
                
                // Get selects by their exact position
                const allSelects = newEnrollForm.querySelectorAll('select');
                const className = allSelects[0].value;        // First = Class Selection
                const enrollmentType = allSelects[1].value;   // Second = Enrollment Type
                const preferredSchedule = allSelects[2].value; // Third = Preferred Schedule
                const experienceLevel = allSelects[3].value;   // Fourth = Experience Level
                
                // Get fitness goals checkboxes (in the checkbox-group)
                const fitnessGoals = [];
                const goalCheckboxes = newEnrollForm.querySelectorAll('.checkbox-group .checkbox-input');
                goalCheckboxes.forEach(cb => {
                    if (cb.checked && cb.value && cb.id !== 'enrollTerms' && 
                        (cb.value.includes('weight') || cb.value.includes('muscle') || 
                         cb.value.includes('endurance') || cb.value.includes('flexibility') || 
                         cb.value.includes('fitness'))) {
                        fitnessGoals.push(cb.value);
                    }
                });
                
                // Get medical conditions textarea
                const medicalConditions = newEnrollForm.querySelector('textarea').value.trim();
                
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
                    showErrorMessage('Missing Information', 'Please fill in all required fields');
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
                    newEnrollForm.reset();
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

// Show success message with custom modal
function showSuccessMessage(title, message) {
    showMessageModal('success', title, message);
}

// Show error message with custom modal
function showErrorMessage(title, message) {
    showMessageModal('error', title, message);
}

// Show info/warning message with custom modal
function showInfoMessage(title, message) {
    showMessageModal('info', title, message);
}

// Create and show custom message modal
function showMessageModal(type, title, message) {
    // Remove existing message modal if any
    const existingModal = document.getElementById('messageModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Icon based on type
    let icon = '';
    let iconColor = '';
    let buttonColor = '';
    
    if (type === 'success') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>`;
        iconColor = '#00ff87';
        buttonColor = 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)';
    } else if (type === 'error') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>`;
        iconColor = '#ff6b35';
        buttonColor = 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)';
    } else {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>`;
        iconColor = '#ff9500';
        buttonColor = 'linear-gradient(135deg, #ff9500 0%, #ffa726 100%)';
    }
    
    // Create modal HTML
    const modalHTML = `
        <div id="messageModal" class="modal-overlay active" style="z-index: 10000;">
            <div class="modal-container" style="max-width: 500px; animation: messageModalSlideIn 0.3s ease-out;">
                <!-- Modal Header -->
                <div class="modal-header" style="background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%); border-bottom: 2px solid ${iconColor};">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                        <div style="color: ${iconColor}; animation: messageIconBounce 0.5s ease-out;">
                            ${icon}
                        </div>
                        <h2 class="modal-title" style="margin: 0; font-size: 28px;">${title}</h2>
                    </div>
                </div>

                <!-- Modal Body -->
                <div class="modal-body" style="padding: 40px; text-align: center;">
                    <p style="font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.9); margin: 0;">
                        ${message}
                    </p>
                </div>

                <!-- Modal Footer -->
                <div style="padding: 0 40px 40px; display: flex; justify-content: center;">
                    <button onclick="closeMessageModal()" class="btn btn-primary" style="background: ${buttonColor}; min-width: 150px;">
                        <span>OK</span>
                    </button>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes messageModalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            @keyframes messageIconBounce {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
            }
        </style>
    `;
    
    // Add to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Close on outside click
    const modal = document.getElementById('messageModal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeMessageModal();
        }
    });
    
    // Close on Escape key
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closeMessageModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Close message modal
function closeMessageModal() {
    const modal = document.getElementById('messageModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
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
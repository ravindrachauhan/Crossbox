// Find My Fit Modal System - COMPLETE WORKING VERSION
class FindMyFitModal {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.isSubmitting = false;
        this.modalCreated = false;
        console.log('🏗️ FindMyFitModal constructor called');
        this.init();
    }

    init() {
        console.log('🔧 Initializing Find My Fit Modal...');
        this.createModal();
        setTimeout(() => {
            this.attachEventListeners();
            console.log('✅ Find My Fit Modal fully initialized');
        }, 50);
    }

    createModal() {
        if (document.getElementById('findMyFitModal')) {
            console.log('ℹ️ Modal already exists in DOM');
            this.modalCreated = true;
            return;
        }

        console.log('📝 Creating modal HTML...');
        
        const modalHTML = `
            <div id="findMyFitModal" class="modal-overlay" style="display: none;">
                <div class="modal-container find-fit-modal">
                    <button class="modal-close" aria-label="Close">&times;</button>
                    
                    <!-- Progress Indicator -->
                    <div class="progress-indicator">
                        <div class="progress-step active" data-step="1">1</div>
                        <div class="progress-line"></div>
                        <div class="progress-step" data-step="2">2</div>
                        <div class="progress-line"></div>
                        <div class="progress-step" data-step="3">3</div>
                    </div>

                    <h2 class="modal-title">Find Your Perfect Fit</h2>
                    <p class="modal-subtitle">Answer a few questions to get personalized class recommendations</p>

                    <form id="findMyFitForm">
                        <!-- Step 1: Goals & Experience -->
                        <div class="form-step active" data-step="1">
                            <div class="form-group">
                                <label>What's your primary fitness goal? *</label>
                                <div class="option-grid">
                                    <label class="option-card">
                                        <input type="radio" name="goal" value="weight_loss" required>
                                        <span class="option-content">
                                            <span class="option-icon">🔥</span>
                                            <span class="option-text">Weight Loss</span>
                                        </span>
                                    </label>
                                    <label class="option-card">
                                        <input type="radio" name="goal" value="muscle_gain" required>
                                        <span class="option-content">
                                            <span class="option-icon">💪</span>
                                            <span class="option-text">Build Muscle</span>
                                        </span>
                                    </label>
                                    <label class="option-card">
                                        <input type="radio" name="goal" value="endurance" required>
                                        <span class="option-content">
                                            <span class="option-icon">🏃</span>
                                            <span class="option-text">Endurance</span>
                                        </span>
                                    </label>
                                    <label class="option-card">
                                        <input type="radio" name="goal" value="flexibility" required>
                                        <span class="option-content">
                                            <span class="option-icon">🧘</span>
                                            <span class="option-text">Flexibility</span>
                                        </span>
                                    </label>
                                    <label class="option-card">
                                        <input type="radio" name="goal" value="general_fitness" required>
                                        <span class="option-content">
                                            <span class="option-icon">⚡</span>
                                            <span class="option-text">General Fitness</span>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>What's your experience level? *</label>
                                <div class="option-grid">
                                    <label class="option-card">
                                        <input type="radio" name="experience" value="beginner" required>
                                        <span class="option-content">
                                            <span class="option-text">Beginner</span>
                                            <span class="option-desc">New to fitness</span>
                                        </span>
                                    </label>
                                    <label class="option-card">
                                        <input type="radio" name="experience" value="intermediate" required>
                                        <span class="option-content">
                                            <span class="option-text">Intermediate</span>
                                            <span class="option-desc">Some experience</span>
                                        </span>
                                    </label>
                                    <label class="option-card">
                                        <input type="radio" name="experience" value="advanced" required>
                                        <span class="option-content">
                                            <span class="option-text">Advanced</span>
                                            <span class="option-desc">Regular training</span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Step 2: Preferences -->
                        <div class="form-step" data-step="2">
                            <div class="form-group">
                                <label>Preferred workout intensity? *</label>
                                <div class="option-grid">
                                    <label class="option-card">
                                        <input type="radio" name="intensity" value="low" required>
                                        <span class="option-content">
                                            <span class="option-text">Low Impact</span>
                                            <span class="option-desc">Gentle, recovery-focused</span>
                                        </span>
                                    </label>
                                    <label class="option-card">
                                        <input type="radio" name="intensity" value="moderate" required>
                                        <span class="option-content">
                                            <span class="option-text">Moderate</span>
                                            <span class="option-desc">Balanced challenge</span>
                                        </span>
                                    </label>
                                    <label class="option-card">
                                        <input type="radio" name="intensity" value="high" required>
                                        <span class="option-content">
                                            <span class="option-text">High Intensity</span>
                                            <span class="option-desc">Push your limits</span>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>How much time can you commit per session? *</label>
                                <div class="option-grid">
                                    <label class="option-card">
                                        <input type="radio" name="duration" value="30" required>
                                        <span class="option-content">
                                            <span class="option-text">30 min</span>
                                        </span>
                                    </label>
                                    <label class="option-card">
                                        <input type="radio" name="duration" value="45" required>
                                        <span class="option-content">
                                            <span class="option-text">45 min</span>
                                        </span>
                                    </label>
                                    <label class="option-card">
                                        <input type="radio" name="duration" value="60" required>
                                        <span class="option-content">
                                            <span class="option-text">60+ min</span>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Any health conditions or limitations? (Optional)</label>
                                <textarea name="health_notes" rows="3" placeholder="E.g., knee injury, back pain, pregnancy, etc."></textarea>
                            </div>
                        </div>

                        <!-- Step 3: Contact Info -->
                        <div class="form-step" data-step="3">
                            <p class="step-intro">Great! Let's get your personalized recommendations.</p>
                            
                            <div class="form-group">
                                <label for="fitName">Full Name *</label>
                                <input type="text" id="fitName" name="name" required placeholder="Enter your full name">
                            </div>

                            <div class="form-group">
                                <label for="fitEmail">Email Address *</label>
                                <input type="email" id="fitEmail" name="email" required placeholder="your.email@example.com">
                            </div>

                            <div class="form-group">
                                <label for="fitPhone">Phone Number *</label>
                                <input type="tel" id="fitPhone" name="phone" required placeholder="1234567890">
                            </div>

                            <div class="form-group checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" name="contact_trainer" value="true">
                                    <span>I'd like a trainer to contact me for personalized guidance</span>
                                </label>
                            </div>
                        </div>

                        <!-- Navigation Buttons -->
                        <div class="modal-actions">
                            <button type="button" class="btn-secondary" id="prevStep" style="display: none;">
                                ← Previous
                            </button>
                            <button type="button" class="btn-primary" id="nextStep">
                                Next →
                            </button>
                            <button type="submit" class="btn-primary" id="submitFit" style="display: none;">
                                Get My Recommendations
                            </button>
                        </div>
                    </form>

                    <!-- Results Section (Hidden initially) -->
                    <div id="fitResults" style="display: none;">
                        <div class="results-header">
                            <h3>Your Perfect Matches! 🎯</h3>
                            <p>Based on your goals and preferences, we recommend:</p>
                        </div>
                        <div id="recommendedClasses"></div>
                        <div class="results-actions">
                            <button class="btn-primary" onclick="location.href='classes.html'">View All Classes</button>
                            <button class="btn-secondary" onclick="findMyFitModal.reset()">Start Over</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modalCreated = true;
        console.log('✅ Modal HTML created and inserted into DOM');
    }
 
    attachEventListeners() {
        const modal = document.getElementById('findMyFitModal');
        if (!modal) {
            console.error('❌ Modal element not found when attaching listeners!');
            return;
        }

        const closeBtn = modal.querySelector('.modal-close');
        const nextBtn = document.getElementById('nextStep');
        const prevBtn = document.getElementById('prevStep');
        const form = document.getElementById('findMyFitForm');

        if (!closeBtn || !nextBtn || !prevBtn || !form) {
            console.error('❌ Modal child elements not found!');
            return;
        }

        closeBtn.addEventListener('click', () => {
            console.log('🚪 Close button clicked');
            this.close();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                console.log('🚪 Clicked outside modal');
                this.close();
            }
        });

        nextBtn.addEventListener('click', () => this.nextStep());
        prevBtn.addEventListener('click', () => this.prevStep());

        // Form submission - CRITICAL FIX
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('📝 Form submitted');
            this.submitForm();
        });

        console.log('✅ Event listeners attached');
    }

    open() {
        console.log('🔓 Opening Find My Fit Modal...');
        const modal = document.getElementById('findMyFitModal');
        if (!modal) {
            console.error('❌ Cannot open - modal not found!');
            this.createModal();
            setTimeout(() => {
                this.attachEventListeners();
                this.open();
            }, 100);
            return;
        }
        
        modal.style.display = 'flex';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('✅ Modal opened!');
    }

    close() {
        console.log('🔒 Closing modal...');
        const modal = document.getElementById('findMyFitModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
            document.body.style.overflow = '';
            console.log('✅ Modal closed');
        }
    }

    nextStep() {
        const currentStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
        
        // Validate current step
        let isValid = true;
        inputs.forEach(input => {
            if (input.type === 'radio') {
                const radioGroup = currentStepEl.querySelectorAll(`input[name="${input.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) isValid = false;
            } else if (!input.value.trim()) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Please complete all required fields', 'error');
            return;
        }

        // CRITICAL: Save current step data BEFORE moving to next step
        const form = document.getElementById('findMyFitForm');
        const formData = new FormData(form);
        formData.forEach((value, key) => {
            if (value && value.trim() !== '') {
                this.formData[key] = value;
            }
        });

        console.log('💾 Saved step data:', this.formData);

        // Move to next step
        if (this.currentStep < this.totalSteps) {
            currentStepEl.classList.remove('active');
            this.currentStep++;
            document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.add('active');
            
            document.querySelector(`.progress-step[data-step="${this.currentStep}"]`).classList.add('active');
            
            document.getElementById('prevStep').style.display = 'block';
            if (this.currentStep === this.totalSteps) {
                document.getElementById('nextStep').style.display = 'none';
                document.getElementById('submitFit').style.display = 'block';
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.remove('active');
            document.querySelector(`.progress-step[data-step="${this.currentStep}"]`).classList.remove('active');
            
            this.currentStep--;
            document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.add('active');
            
            if (this.currentStep === 1) {
                document.getElementById('prevStep').style.display = 'none';
            }
            document.getElementById('nextStep').style.display = 'block';
            document.getElementById('submitFit').style.display = 'none';
        }
    }
   

    async submitForm() {
    // Prevent multiple submissions
    if (this.isSubmitting) {
        console.log('⏳ Already submitting, please wait...');
        return;
    }
    
    this.isSubmitting = true;
    
    try {
        const form = document.getElementById('findMyFitForm');
        const formData = new FormData(form);
        
        // Start with saved data from previous steps
        const data = { ...this.formData };
        
        // Add/override with final step data
        formData.forEach((value, key) => {
            if (value && value.trim() !== '') {
                data[key] = value;
            }
        });

        // Validate required fields
        if (!data.name || !data.email || !data.phone) {
            this.showNotification('Please fill in all required contact information', 'error');
            this.isSubmitting = false;
            return;
        }
        
        if (!data.goal || !data.experience || !data.intensity || !data.duration) {
            this.showNotification('Please complete all steps', 'error');
            this.isSubmitting = false;
            return;
        }

        // Convert contact_trainer checkbox
        data.contact_trainer = data.contact_trainer === 'true';

        console.log('📤 Submitting Find My Fit form:', data);

        // FIXED: Using port 3000 to match your backend
        const response = await fetch('http://localhost:3000/api/find-my-fit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ Recommendations received:', result);
            this.showRecommendations(result.recommendations, result.userSubmission);
        } else {
            this.showNotification(result.message || 'Something went wrong', 'error');
        }
    } catch (error) {
        console.error('❌ Find My Fit submission error:', error);
        this.showNotification('Failed to connect to server. Please make sure the backend is running on port 3000.', 'error');
    } finally {
        this.isSubmitting = false;
    }
    }

    showRecommendations(recommendations, userData) {
        document.getElementById('findMyFitForm').style.display = 'none';
        document.querySelector('.modal-actions').style.display = 'none';
        document.getElementById('fitResults').style.display = 'block';

        const container = document.getElementById('recommendedClasses');
        
        if (recommendations.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7);">No matching classes found. Please contact us for personalized recommendations!</p>';
            return;
        }

        container.innerHTML = recommendations.map((cls, index) => `
            <div class="recommended-class" style="animation-delay: ${index * 0.1}s">
                <div class="class-rank">#${index + 1} Match</div>
                <div class="class-content">
                    <h4>${cls.class_name}</h4>
                    <p class="class-details">
                        <span>⏱ ${cls.duration} min</span>
                        <span>🔥 ${cls.intensity || cls.difficulty}</span>
                        <span>👤 ${cls.trainer_name || 'TBD'}</span>
                    </p>
                    <p class="class-description">${cls.class_desc || 'Great class option for you!'}</p>
                    <div class="match-reason">
                        <strong>Why this fits:</strong> ${cls.match_reason}
                    </div>
                    <button class="btn-primary quick-book-class" onclick="openQuickBookModal()">
                        Quick Book This Class
                    </button>
                </div>
            </div>
        `).join('');

        this.showNotification('Recommendations ready! Check your email for detailed guidance.', 'success');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#00ff87' : '#ff6b35'};
            color: #0a0a0a;
            border-radius: 12px;
            font-weight: 600;
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
            <span class="notification-message">${message}</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    reset() {
        this.currentStep = 1;
        this.formData = {};
        document.getElementById('findMyFitForm').reset();
        document.getElementById('findMyFitForm').style.display = 'block';
        document.querySelector('.modal-actions').style.display = 'flex';
        document.getElementById('fitResults').style.display = 'none';
        
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.querySelector('.form-step[data-step="1"]').classList.add('active');
        
        document.querySelectorAll('.progress-step').forEach(step => step.classList.remove('active'));
        document.querySelector('.progress-step[data-step="1"]').classList.add('active');
        
        document.getElementById('prevStep').style.display = 'none';
        document.getElementById('nextStep').style.display = 'block';
        document.getElementById('submitFit').style.display = 'none';
    }
}

// Initialize
console.log('🚀 findMyFit.js loaded - initializing now...');
window.findMyFitModal = new FindMyFitModal();
console.log('✅ Global findMyFitModal created:', window.findMyFitModal);
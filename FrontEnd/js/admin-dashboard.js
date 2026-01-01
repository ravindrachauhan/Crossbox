const API_BASE = 'http://localhost:3000/api';

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('crossbox_user') || 'null');
    
    if (!user || user.role !== 'admin') {
        alert('Please login as admin to access this page');
        window.location.href = 'login.html';
        return null;
    }
    
    // Update user display
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = user.name || 'Admin';
    }
    
    return user;
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('crossbox_user');
        window.location.href = 'login.html';
    }
}

// Load Dashboard Statistics
async function loadDashboardStats() {
    try {
        console.log('📊 Loading dashboard stats...');
        
        const response = await fetch(`${API_BASE}/admin/dashboard-stats`);
        const data = await response.json();

        console.log('Stats response:', data);

        if (data.success) {
            const stats = data.stats;
            
            document.getElementById('totalMembers').textContent = stats.members.total;
            document.getElementById('activeMembers').textContent = `${stats.members.active} Active`;
            
            document.getElementById('totalTrainers').textContent = stats.trainers.total;
            document.getElementById('activeTrainers').textContent = `${stats.trainers.active} Active`;
            
            document.getElementById('totalClasses').textContent = stats.classes.total;
            document.getElementById('recentBookings').textContent = stats.bookings.recent;
            
            console.log('✅ Stats loaded successfully');
        } else {
            console.error('Failed to load stats:', data.message);
        }
    } catch (error) {
        console.error('❌ Error loading stats:', error);
    }
}

// Load Members
async function loadMembers() {
    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;"><div class="loading-spinner"></div><p style="color: var(--text-secondary); margin-top: 16px;">Loading members...</p></td></tr>';

    try {
        console.log('👥 Loading members...');
        
        const response = await fetch(`${API_BASE}/admin/members`);
        const data = await response.json();

        console.log('Members response:', data);

        if (data.success) {
            if (data.data.length > 0) {
                tbody.innerHTML = data.data.map(member => `
                    <tr>
                        <td>${member.user_name}</td>
                        <td>${member.email}</td>
                        <td>${member.membership_type || 'N/A'}</td>
                        <td>
                            <span class="status-badge ${member.isActive ? 'status-active' : 'status-inactive'}">
                                <span class="status-dot"></span>
                                ${member.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td>
                            <button class="toggle-btn ${member.isActive ? 'active' : 'inactive'}" 
                                    onclick="toggleUser(${member.user_id}, ${member.isActive})">
                                ${member.isActive ? 'Disable' : 'Enable'}
                            </button>
                        </td>
                    </tr>
                `).join('');
                console.log(`✅ Loaded ${data.data.length} members`);
            } else {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-secondary);">No members found</td></tr>';
            }
        } else {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 40px; color: #ff6b6b;">Error: ${data.message}</td></tr>`;
        }
    } catch (error) {
        console.error('❌ Error loading members:', error);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #ff6b6b;">Error loading members. Please check console.</td></tr>';
    }
}

// Load Trainers
async function loadTrainers() {
    const tbody = document.getElementById('trainersTableBody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;"><div class="loading-spinner"></div><p style="color: var(--text-secondary); margin-top: 16px;">Loading trainers...</p></td></tr>';

    try {
        console.log('💪 Loading trainers...');
        
        const response = await fetch(`${API_BASE}/admin/trainers`);
        const data = await response.json();

        console.log('Trainers response:', data);

        if (data.success) {
            if (data.data.length > 0) {
                tbody.innerHTML = data.data.map(trainer => `
                    <tr>
                        <td>${trainer.trainerName}</td>
                        <td>${trainer.email}</td>
                        <td>${trainer.specialisation || 'General'}</td>
                        <td>
                            <span class="status-badge ${trainer.isActive ? 'status-active' : 'status-inactive'}">
                                <span class="status-dot"></span>
                                ${trainer.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td>
                            <button class="toggle-btn ${trainer.isActive ? 'active' : 'inactive'}" 
                                    onclick="toggleTrainer(${trainer.trainerId}, ${trainer.isActive})">
                                ${trainer.isActive ? 'Disable' : 'Enable'}
                            </button>
                        </td>
                    </tr>
                `).join('');
                console.log(`✅ Loaded ${data.data.length} trainers`);
            } else {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-secondary);">No trainers found</td></tr>';
            }
        } else {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 40px; color: #ff6b6b;">Error: ${data.message}</td></tr>`;
        }
    } catch (error) {
        console.error('❌ Error loading trainers:', error);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #ff6b6b;">Error loading trainers. Please check console.</td></tr>';
    }
}

// Load Classes
async function loadClasses() {
    const tbody = document.getElementById('classesTableBody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;"><div class="loading-spinner"></div><p style="color: var(--text-secondary); margin-top: 16px;">Loading classes...</p></td></tr>';

    try {
        console.log('📚 Loading classes...');
        
        const response = await fetch(`${API_BASE}/admin/classes`);
        const data = await response.json();

        console.log('Classes response:', data);

        if (data.success) {
            if (data.data.length > 0) {
                console.log('First class data:', data.data[0]); // Debug
                
                tbody.innerHTML = data.data.map(cls => `
                    <tr>
                        <td>${cls.class_name || 'N/A'}</td>
                        <td>${cls.trainer_name || 'Not Assigned'}</td>
                        <td>${cls.duration || 0} min</td>
                        <td>
                            <span style="display: inline-block; padding: 4px 8px; background: rgba(255, 107, 53, 0.1); border-radius: 4px; font-size: 0.85rem;">
                                ${cls.difficulty || 'N/A'}
                            </span>
                            <span style="display: inline-block; padding: 4px 8px; background: rgba(255, 149, 0, 0.1); border-radius: 4px; font-size: 0.85rem; margin-left: 4px;">
                                ${cls.intensity || 'N/A'}
                            </span>
                        </td>
                        <td>${cls.enrolled_count || 0}</td>
                    </tr>
                `).join('');
                console.log(`✅ Loaded ${data.data.length} classes`);
            } else {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-secondary);">No classes found</td></tr>';
            }
        } else {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 40px; color: #ff6b6b;">Error: ${data.message}</td></tr>`;
        }
    } catch (error) {
        console.error('❌ Error loading classes:', error);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #ff6b6b;">Error loading classes. Check console for details.</td></tr>';
    }
}

// Load Recent Activity
async function loadRecentActivity() {
    const feed = document.getElementById('activityFeed');
    feed.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="loading-spinner"></div><p style="color: var(--text-secondary); margin-top: 16px;">Loading activity...</p></div>';

    try {
        console.log('📋 Loading recent activity...');
        
        const response = await fetch(`${API_BASE}/admin/recent-activity`);
        const data = await response.json();

        console.log('Activity response:', data);

        if (data.success) {
            if (data.data.length > 0) {
                const icons = {
                    booking: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
                    enrollment: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
                    trial: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
                    visit: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
                };

                const labels = {
                    booking: 'New Booking',
                    enrollment: 'New Enrollment',
                    trial: 'Trial Request',
                    visit: 'Facility Visit'
                };

                feed.innerHTML = data.data.map(activity => `
                    <div class="activity-item">
                        <div class="activity-icon ${activity.type}">
                            ${icons[activity.type]}
                        </div>
                        <div class="activity-content">
                            <div class="activity-title">${labels[activity.type]}</div>
                            <div class="activity-details">${activity.name}${activity.class_name ? ' - ' + activity.class_name : ''}</div>
                            <div class="activity-time">${new Date(activity.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                `).join('');
                console.log(`✅ Loaded ${data.data.length} activities`);
            } else {
                feed.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">No recent activity</div>';
            }
        } else {
            feed.innerHTML = `<div style="text-align: center; padding: 40px; color: #ff6b6b;">Error: ${data.message}</div>`;
        }
    } catch (error) {
        console.error('❌ Error loading activity:', error);
        feed.innerHTML = '<div style="text-align: center; padding: 40px; color: #ff6b6b;">Error loading activity. Please check console.</div>';
    }
}

// Toggle User Status
async function toggleUser(userId, currentStatus) {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'disable' : 'enable'} this user?`)) {
        return;
    }

    try {
        console.log(`🔄 Toggling user ${userId}...`);
        
        const response = await fetch(`${API_BASE}/admin/toggle-user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            loadMembers(); // Reload members table
            loadDashboardStats(); // Update stats
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('❌ Error toggling user:', error);
        alert('Error toggling user status');
    }
}

// Toggle Trainer Status
async function toggleTrainer(trainerId, currentStatus) {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'disable' : 'enable'} this trainer?`)) {
        return;
    }

    try {
        console.log(`🔄 Toggling trainer ${trainerId}...`);
        
        const response = await fetch(`${API_BASE}/admin/toggle-trainer/${trainerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            loadTrainers(); // Reload trainers table
            loadDashboardStats(); // Update stats
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('❌ Error toggling trainer:', error);
        alert('Error toggling trainer status');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard initializing...');
    
    // Check authentication
    const user = checkAuth();
    if (!user) return;

    console.log('✅ User authenticated:', user);

    // Load all data
    loadDashboardStats();
    loadMembers();
    loadTrainers();
    loadClasses();
    loadRecentActivity();

    // Setup search functionality
    const memberSearch = document.getElementById('memberSearch');
    if (memberSearch) {
        memberSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#membersTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    const trainerSearch = document.getElementById('trainerSearch');
    if (trainerSearch) {
        trainerSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#trainersTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    const classSearch = document.getElementById('classSearch');
    if (classSearch) {
        classSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#classesTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    console.log('✅ Dashboard initialized successfully');
});
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Load user data
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    document.getElementById('userName').textContent = userData.fullName || 'John Doe';
    document.getElementById('userEmail').textContent = userData.email || 'john.doe@example.com';
    document.getElementById('welcomeName').textContent = (userData.fullName || 'John').split(' ')[0];

    // Sample password data
    let passwords = [
        {
            id: '1',
            website: 'google.com',
            username: 'john.doe@gmail.com',
            password: 'SecureP@ss123',
            strength: 'Strong',
            lastUpdated: '2024-07-28'
        },
        {
            id: '2',
            website: 'facebook.com',
            username: 'john.doe_fb',
            password: 'fbpassword',
            strength: 'Medium',
            lastUpdated: '2024-07-27'
        },
        {
            id: '3',
            website: 'amazon.com',
            username: 'john.doe',
            password: 'weakpass',
            strength: 'Weak',
            lastUpdated: '2024-07-26'
        },
        {
            id: '4',
            website: 'github.com',
            username: 'johndoe_dev',
            password: 'MyGitHubP@ssw0rd2024',
            strength: 'Strong',
            lastUpdated: '2024-07-28'
        },
        {
            id: '5',
            website: 'linkedin.com',
            username: 'john.doe.li',
            password: 'LinkedinSecure',
            strength: 'Medium',
            lastUpdated: '2024-07-25'
        },
        {
            id: '6',
            website: 'netflix.com',
            username: 'john.doe.stream',
            password: 'netflx123',
            strength: 'Weak',
            lastUpdated: '2024-07-24'
        },
        {
            id: '7',
            website: 'twitter.com',
            username: 'john_doe_x',
            password: 'TweetSafe!',
            strength: 'Strong',
            lastUpdated: '2024-07-28'
        }
    ];

    // Load passwords from localStorage if available
    const savedPasswords = localStorage.getItem('userPasswords');
    if (savedPasswords) {
        passwords = JSON.parse(savedPasswords);
    } else {
        localStorage.setItem('userPasswords', JSON.stringify(passwords));
    }

    let visiblePasswords = {};
    let filteredPasswords = [...passwords];

    // DOM elements
    const passwordsTableBody = document.getElementById('passwordsTableBody');
    const searchInput = document.getElementById('searchInput');
    const addPasswordBtn = document.getElementById('addPasswordBtn');
    const addPasswordModal = document.getElementById('addPasswordModal');
    const addPasswordForm = document.getElementById('addPasswordForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Update statistics
    function updateStats() {
        const total = passwords.length;
        const weak = passwords.filter(p => p.strength === 'Weak').length;
        const medium = passwords.filter(p => p.strength === 'Medium').length;
        const strong = passwords.filter(p => p.strength === 'Strong').length;

        document.getElementById('totalPasswords').textContent = total;
        document.getElementById('weakPasswords').textContent = weak;
        document.getElementById('strongPasswords').textContent = strong;
        document.getElementById('chartTotal').textContent = total;

        // Update percentages
        const strongPercent = total > 0 ? Math.round((strong / total) * 100) : 0;
        const mediumPercent = total > 0 ? Math.round((medium / total) * 100) : 0;
        const weakPercent = total > 0 ? Math.round((weak / total) * 100) : 0;

        document.getElementById('strongPercent').textContent = strongPercent + '%';
        document.getElementById('mediumPercent').textContent = mediumPercent + '%';
        document.getElementById('weakPercent').textContent = weakPercent + '%';

        // Update chart
        updateChart(strongPercent, mediumPercent, weakPercent);
    }

    // Update chart visualization
    function updateChart(strong, medium, weak) {
        const circumference = 2 * Math.PI * 40; // radius = 40
        const strongLength = (strong / 100) * circumference;
        const mediumLength = (medium / 100) * circumference;
        const weakLength = (weak / 100) * circumference;

        const strongCircle = document.getElementById('strongCircle');
        const mediumCircle = document.getElementById('mediumCircle');
        const weakCircle = document.getElementById('weakCircle');

        strongCircle.setAttribute('stroke-dasharray', `${strongLength} ${circumference}`);
        strongCircle.setAttribute('stroke-dashoffset', '0');

        mediumCircle.setAttribute('stroke-dasharray', `${mediumLength} ${circumference}`);
        mediumCircle.setAttribute('stroke-dashoffset', `-${strongLength}`);

        weakCircle.setAttribute('stroke-dasharray', `${weakLength} ${circumference}`);
        weakCircle.setAttribute('stroke-dashoffset', `-${strongLength + mediumLength}`);
    }

    // Get password strength
    function getPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        if (strength >= 4) return 'Strong';
        if (strength >= 2) return 'Medium';
        return 'Weak';
    }

    // Render passwords table
    function renderPasswords() {
        passwordsTableBody.innerHTML = '';
        
        filteredPasswords.forEach(password => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="website-cell">${password.website}</td>
                <td class="username-cell">${password.username}</td>
                <td class="password-cell">
                    <span class="password-text">${visiblePasswords[password.id] ? password.password : '••••••••'}</span>
                    <button class="toggle-visibility" onclick="togglePasswordVisibility('${password.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${visiblePasswords[password.id] ? 
                                '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>' :
                                '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
                            }
                        </svg>
                    </button>
                </td>
                <td>
                    <span class="strength-badge ${password.strength.toLowerCase()}">${password.strength}</span>
                </td>
                <td>${password.lastUpdated}</td>
                <td class="actions-cell">
                    <button class="action-btn" onclick="copyPassword('${password.password}')" title="Copy password">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                    </button>
                    <button class="action-btn" title="Edit password">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="action-btn delete" onclick="deletePassword('${password.id}')" title="Delete password">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                    </button>
                </td>
            `;
            passwordsTableBody.appendChild(row);
        });
    }

    // Global functions for inline event handlers
    window.togglePasswordVisibility = function(id) {
        visiblePasswords[id] = !visiblePasswords[id];
        renderPasswords();
    };

    window.copyPassword = function(password) {
        navigator.clipboard.writeText(password).then(() => {
            // You could add a toast notification here
            console.log('Password copied to clipboard');
        });
    };

    window.deletePassword = function(id) {
        if (confirm('Are you sure you want to delete this password?')) {
            passwords = passwords.filter(p => p.id !== id);
            filteredPasswords = filteredPasswords.filter(p => p.id !== id);
            localStorage.setItem('userPasswords', JSON.stringify(passwords));
            renderPasswords();
            updateStats();
        }
    };

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filteredPasswords = passwords.filter(password =>
            password.website.toLowerCase().includes(searchTerm) ||
            password.username.toLowerCase().includes(searchTerm)
        );
        renderPasswords();
    });

    // Modal functionality
    addPasswordBtn.addEventListener('click', function() {
        addPasswordModal.classList.add('show');
    });

    cancelBtn.addEventListener('click', function() {
        addPasswordModal.classList.remove('show');
        addPasswordForm.reset();
    });

    // Close modal when clicking outside
    addPasswordModal.addEventListener('click', function(e) {
        if (e.target === addPasswordModal) {
            addPasswordModal.classList.remove('show');
            addPasswordForm.reset();
        }
    });

    // Add password form submission
    addPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const website = document.getElementById('website').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('newPassword').value;
        
        if (website && username && password) {
            const newPassword = {
                id: Date.now().toString(),
                website: website,
                username: username,
                password: password,
                strength: getPasswordStrength(password),
                lastUpdated: new Date().toISOString().split('T')[0]
            };
            
            passwords.push(newPassword);
            filteredPasswords = [...passwords];
            localStorage.setItem('userPasswords', JSON.stringify(passwords));
            
            renderPasswords();
            updateStats();
            
            addPasswordModal.classList.remove('show');
            addPasswordForm.reset();
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    });

    // Initialize
    renderPasswords();
    updateStats();
});
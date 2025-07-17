document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthLabel = document.getElementById('strengthLabel');
    const strengthFill = document.getElementById('strengthFill');

    // Toggle password visibility
    function setupPasswordToggle(toggleBtn, passwordField) {
        toggleBtn.addEventListener('click', function() {
            const eyeIcon = toggleBtn.querySelector('.eye-icon');
            const eyeOffIcon = toggleBtn.querySelector('.eye-off-icon');
            
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            eyeIcon.classList.toggle('hidden');
            eyeOffIcon.classList.toggle('hidden');
        });
    }

    setupPasswordToggle(togglePassword, passwordInput);
    setupPasswordToggle(toggleConfirmPassword, confirmPasswordInput);

    // Password strength checker
    function getPasswordStrength(password) {
        if (password.length === 0) return { strength: 0, label: '', color: '' };
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        if (strength <= 2) return { strength: 33, label: 'Weak', color: 'weak' };
        if (strength <= 3) return { strength: 66, label: 'Medium', color: 'medium' };
        return { strength: 100, label: 'Strong', color: 'strong' };
    }

    // Update password strength indicator
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = getPasswordStrength(password);
        
        if (password.length > 0) {
            passwordStrength.classList.add('show');
            strengthLabel.textContent = strength.label;
            strengthLabel.className = `strength-label ${strength.color}`;
            strengthFill.className = `strength-fill ${strength.color}`;
        } else {
            passwordStrength.classList.remove('show');
        }
        
        clearError('password');
    });

    // Form validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        
        errorElement.textContent = message;
        inputElement.classList.add('error');
    }

    function clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        
        errorElement.textContent = '';
        inputElement.classList.remove('error');
    }

    // Clear errors on input
    document.getElementById('fullName').addEventListener('input', function() {
        clearError('fullName');
    });

    document.getElementById('email').addEventListener('input', function() {
        clearError('email');
    });

    document.getElementById('confirmPassword').addEventListener('input', function() {
        clearError('confirmPassword');
    });

    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        let isValid = true;

        // Clear previous errors
        clearError('fullName');
        clearError('email');
        clearError('password');
        clearError('confirmPassword');

        // Validate full name
        if (!fullName) {
            showError('fullName', 'Full name is required');
            isValid = false;
        } else if (fullName.length < 2) {
            showError('fullName', 'Full name must be at least 2 characters');
            isValid = false;
        }

        // Validate email
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 8) {
            showError('password', 'Password must be at least 8 characters');
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            showError('password', 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
            isValid = false;
        }

        // Validate confirm password
        if (!confirmPassword) {
            showError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }

        if (isValid) {
            // Store user data in localStorage (for demo purposes)
            const userData = {
                fullName: fullName,
                email: email,
                signupTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            
            // Show success message
            const signupBtn = document.querySelector('.signup-btn');
            const originalText = signupBtn.textContent;
            signupBtn.textContent = 'Creating Account...';
            signupBtn.disabled = true;
            
            // Simulate signup delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    });

    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }
});
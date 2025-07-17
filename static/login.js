document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.eye-icon');
    const eyeOffIcon = document.querySelector('.eye-off-icon');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        eyeIcon.classList.toggle('hidden');
        eyeOffIcon.classList.toggle('hidden');
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
    document.getElementById('email').addEventListener('input', function() {
        clearError('email');
    });

    document.getElementById('password').addEventListener('input', function() {
        clearError('password');
    });

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        let isValid = true;

        // Clear previous errors
        clearError('email');
        clearError('password');

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
        } else if (password.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            isValid = false;
        }

        if (isValid) {
            // Store user data in localStorage (for demo purposes)
            const userData = {
                email: email,
                fullName: 'John Doe', // Mock data
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            
            // Show success message
            const loginBtn = document.querySelector('.login-btn');
            const originalText = loginBtn.textContent;
            loginBtn.textContent = 'Logging in...';
            loginBtn.disabled = true;
            
            // Simulate login delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    });

    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }
});
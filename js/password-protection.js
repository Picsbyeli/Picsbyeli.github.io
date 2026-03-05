// Password Protection Module
// Protects the website with a password and provides access control

const PasswordProtection = {
  PASSWORD: 'Pic.aso12!',
  SESSION_KEY: 'website_authenticated',
  MAX_ATTEMPTS: 3,
  
  init() {
    // Check if user is already authenticated in this session
    if (!this.isAuthenticated()) {
      this.showPasswordModal();
    }
  },
  
  isAuthenticated() {
    return sessionStorage.getItem(this.SESSION_KEY) === 'true';
  },
  
  setAuthenticated() {
    sessionStorage.setItem(this.SESSION_KEY, 'true');
  },
  
  showPasswordModal() {
    // Create modal HTML
    const modal = document.createElement('div');
    modal.id = 'password-modal';
    modal.className = 'password-modal';
    modal.innerHTML = `
      <div class="password-modal-content">
        <div class="password-modal-header">
          🔒 Website Access
        </div>
        <div class="password-modal-body">
          <p class="password-message">
            This website requires Mr. Valentine's permission to access.
          </p>
          <p class="password-submessage">
            Please enter the password to continue.
          </p>
          <input 
            type="password" 
            id="password-input" 
            class="password-input" 
            placeholder="Enter password"
            autocomplete="off"
          />
          <div id="password-error" class="password-error"></div>
          <button id="password-submit" class="password-submit-btn">
            Unlock Access
          </button>
        </div>
        <div class="password-modal-footer">
          <p class="permission-text">
            👤 Need Mr. Valentine's permission? Ask them for the password.
          </p>
        </div>
      </div>
    `;
    
    document.body.insertBefore(modal, document.body.firstChild);
    
    // Add event listeners
    const passwordInput = document.getElementById('password-input');
    const submitBtn = document.getElementById('password-submit');
    const errorDiv = document.getElementById('password-error');
    
    let attempts = 0;
    
    const handleSubmit = () => {
      const enteredPassword = passwordInput.value;
      
      if (enteredPassword === this.PASSWORD) {
        this.setAuthenticated();
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          modal.remove();
          // Enable page interactions
          document.body.style.pointerEvents = 'auto';
        }, 300);
      } else {
        attempts++;
        const remaining = this.MAX_ATTEMPTS - attempts;
        
        if (remaining > 0) {
          errorDiv.textContent = `❌ Incorrect password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`;
          errorDiv.style.color = '#e74c3c';
        } else {
          errorDiv.textContent = '❌ Too many incorrect attempts. Please refresh the page.';
          errorDiv.style.color = '#c0392b';
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.5';
          submitBtn.style.cursor = 'not-allowed';
          passwordInput.disabled = true;
        }
        
        passwordInput.value = '';
        passwordInput.focus();
      }
    };
    
    submitBtn.addEventListener('click', handleSubmit);
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    });
    
    // Block interaction with page content
    document.body.style.pointerEvents = 'none';
    
    // Focus on password input
    setTimeout(() => {
      passwordInput.focus();
    }, 100);
  }
};

// Initialize password protection when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  PasswordProtection.init();
});

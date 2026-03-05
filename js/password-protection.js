// Password Protection Module
// Protects the website with a password and provides access control
// Tracks device fingerprints to limit attempts per device

const PasswordProtection = {
  PASSWORD: 'Pic.aso12!',
  SESSION_KEY: 'website_authenticated',
  STORAGE_KEY: 'password_attempts',
  MAX_ATTEMPTS_SESSION: 3,
  MAX_ATTEMPTS_DEVICE: 10,
  YOUR_EMAIL: 'mr.valentine@email.com', // Update with your email
  YOUR_PHONE: '(555) 123-4567', // Update with your phone
  
  init() {
    // Check if user is already authenticated in this session
    if (!this.isAuthenticated()) {
      // Check if device is permanently locked
      const deviceId = this.getDeviceId();
      if (this.isDeviceLocked(deviceId)) {
        this.showLockedModal(deviceId);
      } else {
        this.showPasswordModal();
      }
    }
  },
  
  isAuthenticated() {
    return sessionStorage.getItem(this.SESSION_KEY) === 'true';
  },
  
  setAuthenticated() {
    sessionStorage.setItem(this.SESSION_KEY, 'true');
  },
  
  // Generate a simple device fingerprint based on browser/device info
  getDeviceId() {
    const navigator_info = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      screen: `${screen.width}x${screen.height}`,
    };
    
    // Create a simple hash of device info
    const fingerprint = JSON.stringify(navigator_info);
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return 'device_' + Math.abs(hash).toString(16);
  },
  
  // Track attempts for a device
  recordAttempt(deviceId) {
    const attempts = this.getDeviceAttempts(deviceId);
    const newAttempts = {
      count: attempts.count + 1,
      timestamp: Date.now(),
      dates: [...(attempts.dates || []), new Date().toLocaleString()]
    };
    
    const allAttempts = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    allAttempts[deviceId] = newAttempts;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allAttempts));
    
    return newAttempts;
  },
  
  // Get attempt count for a device
  getDeviceAttempts(deviceId) {
    const allAttempts = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    return allAttempts[deviceId] || { count: 0, dates: [] };
  },
  
  // Check if device is locked (exceeded max attempts)
  isDeviceLocked(deviceId) {
    const attempts = this.getDeviceAttempts(deviceId);
    return attempts.count >= this.MAX_ATTEMPTS_DEVICE;
  },
  
  showLockedModal(deviceId) {
    const modal = document.createElement('div');
    modal.id = 'password-modal';
    modal.className = 'password-modal';
    modal.innerHTML = `
      <div class="password-modal-content locked">
        <div class="password-modal-header locked-header">
          🔐 Device Locked
        </div>
        <div class="password-modal-body">
          <p class="password-message locked-message">
            This device has exceeded the maximum number of password attempts.
          </p>
          <div class="device-info-box">
            <p><strong>Device ID:</strong> <code>${deviceId}</code></p>
            <p><strong>Status:</strong> Locked - In-person authorization required</p>
          </div>
          <p class="password-submessage">
            To regain access, you must ask Mr. Valentine in person to unlock your device.
          </p>
          <div class="contact-info-box">
            <p><strong>Contact Mr. Valentine:</strong></p>
            <p>📧 Email: ${this.YOUR_EMAIL}</p>
            <p>📞 Phone: ${this.YOUR_PHONE}</p>
            <p style="font-size: 13px; color: #a0a0a0; margin-top: 10px;">Tell him your Device ID above.</p>
          </div>
        </div>
        <div class="password-modal-footer">
          <p class="permission-text">
            Your device fingerprint has been recorded for security purposes.
          </p>
        </div>
      </div>
    `;
    
    document.body.insertBefore(modal, document.body.firstChild);
    
    // Block all interaction
    document.body.style.pointerEvents = 'none';
  },
  
  showPasswordModal() {
    const deviceId = this.getDeviceId();
    const attempts = this.getDeviceAttempts(deviceId);
    const remaining = this.MAX_ATTEMPTS_DEVICE - attempts.count;
    
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
          <div id="attempts-warning" class="attempts-warning"></div>
          <button id="password-submit" class="password-submit-btn">
            Unlock Access
          </button>
        </div>
        <div class="password-modal-footer">
          <p class="permission-text">
            👤 Need Mr. Valentine's permission? Ask them for the password.
          </p>
          <p class="device-id-text">
            Device ID: <code>${deviceId}</code>
          </p>
        </div>
      </div>
    `;
    
    document.body.insertBefore(modal, document.body.firstChild);
    
    // Add event listeners
    const passwordInput = document.getElementById('password-input');
    const submitBtn = document.getElementById('password-submit');
    const errorDiv = document.getElementById('password-error');
    const warningDiv = document.getElementById('attempts-warning');
    
    let sessionAttempts = 0;
    
    // Show warning if device has many attempts
    if (attempts.count > 5) {
      warningDiv.innerHTML = `
        <div class="warning-icon">⚠️</div>
        <p style="margin: 8px 0;">This device has ${attempts.count} failed attempts.</p>
        <p style="margin: 0; font-size: 13px;">You have ${remaining} attempts remaining before permanent lock.</p>
      `;
      warningDiv.style.display = 'block';
    }
    
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
        sessionAttempts++;
        const deviceAttempts = this.recordAttempt(deviceId);
        const remainingTotal = this.MAX_ATTEMPTS_DEVICE - deviceAttempts.count;
        
        if (remainingTotal <= 0) {
          // Device locked
          errorDiv.textContent = '❌ DEVICE LOCKED - Too many incorrect attempts.';
          errorDiv.style.color = '#c0392b';
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.5';
          submitBtn.style.cursor = 'not-allowed';
          passwordInput.disabled = true;
          
          // Show lock message after delay
          setTimeout(() => {
            warningDiv.innerHTML = `
              <div style="background: #c0392b; padding: 12px; border-radius: 6px; color: white; text-align: center;">
                <p style="margin: 0 0 8px 0; font-weight: bold;">🔐 Device Permanently Locked</p>
                <p style="margin: 0; font-size: 13px;">Ask Mr. Valentine to unlock this device.</p>
              </div>
            `;
            warningDiv.style.display = 'block';
          }, 300);
        } else if (sessionAttempts < this.MAX_ATTEMPTS_SESSION) {
          errorDiv.textContent = `❌ Incorrect password. ${this.MAX_ATTEMPTS_SESSION - sessionAttempts} session attempt${this.MAX_ATTEMPTS_SESSION - sessionAttempts !== 1 ? 's' : ''} remaining. (${remainingTotal} device attempt${remainingTotal !== 1 ? 's' : ''} total)`;
          errorDiv.style.color = '#e74c3c';
        } else {
          errorDiv.textContent = `❌ Session attempts exceeded. Refresh to try again. (${remainingTotal} device attempt${remainingTotal !== 1 ? 's' : ''} remaining)`;
          errorDiv.style.color = '#c0392b';
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.5';
          submitBtn.style.cursor = 'not-allowed';
          passwordInput.disabled = true;
        }
        
        // Update warning
        if (deviceAttempts.count > 5) {
          warningDiv.innerHTML = `
            <div class="warning-icon">⚠️</div>
            <p style="margin: 8px 0;">Failed attempts on this device: ${deviceAttempts.count}/${this.MAX_ATTEMPTS_DEVICE}</p>
            <p style="margin: 0; font-size: 13px;">You have ${remainingTotal} attempt${remainingTotal !== 1 ? 's' : ''} remaining.</p>
          `;
          warningDiv.style.display = 'block';
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

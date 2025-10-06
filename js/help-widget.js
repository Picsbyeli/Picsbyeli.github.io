/**
 * Help Button Widget
 * Provides a floating help button that opens a feedback modal
 */

// Configuration
const HELP_CONFIG = {
    email: 'mrvalentinebuzz@gmail.com',
    defaultGameName: 'E.Vol Games'
};

// Global variable to store the current game name
let currentGameName = HELP_CONFIG.defaultGameName;

/**
 * Initialize the help widget
 * @param {string} gameName - The name of the current game
 */
function initHelpWidget(gameName = null) {
    if (gameName) {
        currentGameName = gameName;
    }
    
    // Create the help button if it doesn't exist
    if (!document.getElementById('helpButton')) {
        createHelpButton();
    }
    
    // Create the help modal if it doesn't exist
    if (!document.getElementById('helpModal')) {
        createHelpModal();
    }
    
    // Add event listeners
    setupEventListeners();
}

/**
 * Create the help button element
 */
function createHelpButton() {
    const helpButton = document.createElement('button');
    helpButton.id = 'helpButton';
    helpButton.className = 'help-button';
    helpButton.innerHTML = '?';
    helpButton.title = 'Help & Feedback';
    helpButton.onclick = openHelpModal;
    
    document.body.appendChild(helpButton);
}

/**
 * Create the help modal element
 */
function createHelpModal() {
    const modalHTML = `
        <div id="helpModal" class="help-modal">
            <div class="modal-content">
                <button class="close-button" onclick="closeHelpModal()">&times;</button>
                <h2>Help & Feedback</h2>
                
                <div id="successMessage" class="success-message">
                    Thank you! Your message has been sent successfully.
                </div>

                <form id="helpForm">
                    <div class="form-group">
                        <label for="helpName">Name (optional)</label>
                        <input type="text" id="helpName" name="name" placeholder="Your name">
                    </div>

                    <div class="form-group">
                        <label for="helpEmail">Email (optional)</label>
                        <input type="email" id="helpEmail" name="email" placeholder="your@email.com">
                    </div>

                    <div class="form-group">
                        <label for="helpType">Type *</label>
                        <select id="helpType" name="type" required>
                            <option value="">Select...</option>
                            <option value="question">Question</option>
                            <option value="bug">Bug Report</option>
                            <option value="feedback">Feedback</option>
                            <option value="suggestion">Suggestion</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="helpMessage">Message *</label>
                        <textarea id="helpMessage" name="message" required placeholder="Describe your question, issue, or feedback..."></textarea>
                    </div>

                    <button type="submit" class="submit-button">Send Message</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Setup event listeners for the help widget
 */
function setupEventListeners() {
    // Form submission
    const helpForm = document.getElementById('helpForm');
    if (helpForm) {
        helpForm.addEventListener('submit', submitHelpForm);
    }
    
    // Modal click outside to close
    const helpModal = document.getElementById('helpModal');
    if (helpModal) {
        helpModal.addEventListener('click', function(e) {
            if (e.target.id === 'helpModal') {
                closeHelpModal();
            }
        });
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeHelpModal();
        }
    });
}

/**
 * Open the help modal
 */
function openHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.style.display = 'block';
        // Focus on the first form field
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }
}

/**
 * Close the help modal
 */
function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Hide success message
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'none';
    }
}

/**
 * Submit the help form
 * @param {Event} e - The form submission event
 */
function submitHelpForm(e) {
    e.preventDefault();
    
    const form = document.getElementById('helpForm');
    const submitBtn = form.querySelector('.submit-button');
    
    // Get form data
    const formData = {
        game: currentGameName,
        name: document.getElementById('helpName').value || 'Anonymous',
        email: document.getElementById('helpEmail').value || 'No email provided',
        type: document.getElementById('helpType').value,
        message: document.getElementById('helpMessage').value,
        timestamp: new Date().toLocaleString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Create mailto link with form data
    const subject = encodeURIComponent(`[${formData.game}] ${formData.type} - ${formData.name}`);
    const body = encodeURIComponent(
        `Game: ${formData.game}\n` +
        `Type: ${formData.type}\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Time: ${formData.timestamp}\n` +
        `URL: ${formData.url}\n\n` +
        `Message:\n${formData.message}\n\n` +
        `---\nUser Agent: ${formData.userAgent}`
    );

    const mailtoLink = `mailto:${HELP_CONFIG.email}?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;

    // Show success message
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
    }
    
    // Reset form
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';

    // Close modal after 2 seconds
    setTimeout(() => {
        closeHelpModal();
    }, 2000);
}

/**
 * Update the game name for the help widget
 * @param {string} gameName - The new game name
 */
function setHelpGameName(gameName) {
    currentGameName = gameName;
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Don't auto-initialize - let each page call initHelpWidget() with their game name
});

// Export functions for global use
window.initHelpWidget = initHelpWidget;
window.openHelpModal = openHelpModal;
window.closeHelpModal = closeHelpModal;
window.setHelpGameName = setHelpGameName;
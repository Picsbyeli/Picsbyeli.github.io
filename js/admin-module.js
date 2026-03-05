// Admin Module for tracking online users
// Only accessible to admin email: elidaslaya@gmail.com

const AdminModule = {
  ADMIN_EMAIL: 'elidaslaya@gmail.com',
  ONLINE_USERS_KEY: 'evol_online_users',
  USER_SESSION_KEY: 'evol_user_session_' + Date.now(),
  HEARTBEAT_INTERVAL: 5000, // 5 seconds
  SESSION_TIMEOUT: 30000, // 30 seconds
  
  init() {
    // Check if current user is admin
    this.checkAdminStatus();
    // Start heartbeat to track user presence
    this.startHeartbeat();
    // Listen for page visibility changes
    this.setupVisibilityListener();
  },
  
  checkAdminStatus() {
    if (window.gameAuth && window.gameAuth.isLoggedIn()) {
      const currentUser = window.gameAuth.getCurrentUser();
      if (currentUser && currentUser.email === this.ADMIN_EMAIL) {
        window.isAdmin = true;
        this.showAdminTab();
        return true;
      }
    }
    window.isAdmin = false;
    return false;
  },
  
  showAdminTab() {
    const adminTab = document.querySelector('[data-tab="admin"]');
    if (adminTab) {
      adminTab.style.display = 'block';
    }
  },
  
  hideAdminTab() {
    const adminTab = document.querySelector('[data-tab="admin"]');
    if (adminTab) {
      adminTab.style.display = 'none';
    }
  },
  
  startHeartbeat() {
    // Send heartbeat every 5 seconds
    setInterval(() => {
      this.updateUserPresence();
    }, this.HEARTBEAT_INTERVAL);
    
    // Initial heartbeat
    this.updateUserPresence();
  },
  
  updateUserPresence() {
    if (window.gameAuth && window.gameAuth.isLoggedIn()) {
      const currentUser = window.gameAuth.getCurrentUser();
      const onlineUsers = this.getOnlineUsers();
      
      const userSession = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || 'Anonymous',
        lastSeen: Date.now(),
        isAdmin: currentUser.email === this.ADMIN_EMAIL
      };
      
      // Update or add user to online list
      const userIndex = onlineUsers.findIndex(u => u.uid === currentUser.uid);
      if (userIndex >= 0) {
        onlineUsers[userIndex] = userSession;
      } else {
        onlineUsers.push(userSession);
      }
      
      // Remove stale users
      const now = Date.now();
      const activeUsers = onlineUsers.filter(u => (now - u.lastSeen) < this.SESSION_TIMEOUT);
      
      this.saveOnlineUsers(activeUsers);
    }
  },
  
  getOnlineUsers() {
    try {
      const stored = localStorage.getItem(this.ONLINE_USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },
  
  saveOnlineUsers(users) {
    try {
      localStorage.setItem(this.ONLINE_USERS_KEY, JSON.stringify(users));
      // Notify admin tab to refresh if open
      if (window.isAdmin) {
        window.dispatchEvent(new Event('onlineUsersUpdated'));
      }
    } catch (error) {
      console.error('Error saving online users:', error);
    }
  },
  
  setupVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page is hidden
        this.removeUserPresence();
      } else {
        // Page is visible again
        this.updateUserPresence();
      }
    });
  },
  
  removeUserPresence() {
    if (window.gameAuth && window.gameAuth.isLoggedIn()) {
      const currentUser = window.gameAuth.getCurrentUser();
      const onlineUsers = this.getOnlineUsers();
      const filtered = onlineUsers.filter(u => u.uid !== currentUser.uid);
      this.saveOnlineUsers(filtered);
    }
  },
  
  renderOnlineUsers() {
    const container = document.getElementById('online-users-list');
    if (!container) return;
    
    const onlineUsers = this.getOnlineUsers();
    const now = Date.now();
    
    // Filter and sort users
    const activeUsers = onlineUsers
      .filter(u => (now - u.lastSeen) < this.SESSION_TIMEOUT)
      .sort((a, b) => b.lastSeen - a.lastSeen);
    
    if (activeUsers.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #8f98a0;">
          <p style="font-size: 48px; margin-bottom: 15px;">👥</p>
          <p>No users currently online</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
        ${activeUsers.map((user, index) => {
          const timeSinceLastSeen = Math.floor((now - user.lastSeen) / 1000);
          const timeLabel = timeSinceLastSeen < 5 ? 'Just now' : timeSinceLastSeen + 's ago';
          const statusBadge = timeSinceLastSeen < 5 ? '🟢 Active' : '🟡 Idle';
          
          return `
            <div style="background: linear-gradient(135deg, #2a475e 0%, #1e2328 100%); border: 1px solid #417a9b; border-radius: 5px; padding: 15px; display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                  <p style="margin: 0 0 5px 0; color: #66c0f4; font-weight: bold; word-break: break-word;">${this.escapeHtml(user.displayName)}</p>
                  <p style="margin: 0; font-size: 12px; color: #8f98a0; word-break: break-all;">${this.escapeHtml(user.email)}</p>
                </div>
                ${user.isAdmin ? '<span style="background: #c0392b; color: white; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: bold;">ADMIN</span>' : ''}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; color: #b8d631;">${statusBadge}</span>
                <span style="font-size: 11px; color: #8f98a0;">${timeLabel}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};

// Helper function to escape HTML
AdminModule.escapeHtml = function(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Initialize admin module when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  AdminModule.init();
  
  // Listen for admin updates
  window.addEventListener('onlineUsersUpdated', () => {
    AdminModule.renderOnlineUsers();
  });
  
  // Listen for auth changes
  window.addEventListener('userAuthenticated', () => {
    AdminModule.checkAdminStatus();
  });
});

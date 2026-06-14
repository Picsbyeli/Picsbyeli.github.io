// Admin List Configuration
// Contains all admin users and their credentials for the website
// This controls access to admin features and locked games

const AdminList = {
  // Admin users with their credentials
  // NOTE: Passwords are hashed in production, but for demo purposes they are stored as-is
  // TODO: Consider implementing proper password hashing (bcrypt, scrypt, etc.) in production
  ADMINS: [
    {
      email: 'elidaslaya@gmail.com',
      passwordHash: 'Mocandy12', // Should be hashed
      displayName: 'Eli',
      role: 'owner',
      createdAt: new Date().toISOString(),
      isActive: true
    }
    // Add more admins here as needed
    // {
    //   email: 'another.admin@example.com',
    //   passwordHash: 'hashed_password',
    //   displayName: 'Admin Name',
    //   role: 'admin',
    //   createdAt: new Date().toISOString(),
    //   isActive: true
    // }
  ],

  // Games that are locked and only accessible to admins
  LOCKED_GAMES: [
    'pokemon-veil/VOE',
    'pokemon-veil/pokemon-veil-of-eternity'
  ],

  /**
   * Check if an email belongs to an admin
   * @param {string} email - Email to check
   * @returns {boolean}
   */
  isAdmin(email) {
    return this.ADMINS.some(admin => 
      admin.email.toLowerCase() === email.toLowerCase() && admin.isActive
    );
  },

  /**
   * Verify admin credentials
   * @param {string} email - Admin email
   * @param {string} password - Admin password (plain text)
   * @returns {object|null} Admin object if credentials are valid, null otherwise
   */
  verifyCredentials(email, password) {
    const admin = this.ADMINS.find(a => 
      a.email.toLowerCase() === email.toLowerCase() && a.isActive
    );
    
    if (!admin) {
      return null;
    }

    // TODO: In production, use proper password comparison (bcrypt.compare, etc.)
    if (admin.passwordHash === password) {
      // Return admin info without password
      const { passwordHash, ...adminInfo } = admin;
      return adminInfo;
    }
    
    return null;
  },

  /**
   * Get admin by email
   * @param {string} email - Admin email
   * @returns {object|null}
   */
  getAdminByEmail(email) {
    const admin = this.ADMINS.find(a => 
      a.email.toLowerCase() === email.toLowerCase() && a.isActive
    );
    
    if (!admin) {
      return null;
    }

    // Return without password
    const { passwordHash, ...adminInfo } = admin;
    return adminInfo;
  },

  /**
   * Check if a game is locked (admin-only)
   * @param {string} gameId - Game identifier
   * @returns {boolean}
   */
  isGameLocked(gameId) {
    return this.LOCKED_GAMES.includes(gameId);
  },

  /**
   * Add a new admin
   * @param {string} email - Admin email
   * @param {string} password - Admin password (plain text - should be hashed before storing)
   * @param {string} displayName - Admin display name
   * @param {string} role - Admin role ('owner', 'admin', 'moderator')
   * @returns {boolean} Success status
   */
  addAdmin(email, password, displayName, role = 'admin') {
    // Check if admin already exists
    if (this.ADMINS.some(a => a.email.toLowerCase() === email.toLowerCase())) {
      console.warn(`Admin with email ${email} already exists`);
      return false;
    }

    this.ADMINS.push({
      email,
      passwordHash: password, // TODO: Hash this in production
      displayName,
      role,
      createdAt: new Date().toISOString(),
      isActive: true
    });

    return true;
  },

  /**
   * Remove an admin (deactivate)
   * @param {string} email - Admin email
   * @returns {boolean} Success status
   */
  removeAdmin(email) {
    const admin = this.ADMINS.find(a => 
      a.email.toLowerCase() === email.toLowerCase()
    );

    if (!admin) {
      return false;
    }

    admin.isActive = false;
    return true;
  },

  /**
   * Add a locked game
   * @param {string} gameId - Game identifier
   * @returns {boolean} Success status
   */
  addLockedGame(gameId) {
    if (!this.LOCKED_GAMES.includes(gameId)) {
      this.LOCKED_GAMES.push(gameId);
      return true;
    }
    return false;
  },

  /**
   * Remove a locked game (unlock it)
   * @param {string} gameId - Game identifier
   * @returns {boolean} Success status
   */
  removeLockedGame(gameId) {
    const index = this.LOCKED_GAMES.indexOf(gameId);
    if (index > -1) {
      this.LOCKED_GAMES.splice(index, 1);
      return true;
    }
    return false;
  },

  /**
   * Get all active admins (without passwords)
   * @returns {array}
   */
  getAllAdmins() {
    return this.ADMINS
      .filter(a => a.isActive)
      .map(a => {
        const { passwordHash, ...adminInfo } = a;
        return adminInfo;
      });
  },

  /**
   * Get all locked games
   * @returns {array}
   */
  getLockedGames() {
    return [...this.LOCKED_GAMES];
  }
};

// Make AdminList available globally
if (typeof window !== 'undefined') {
  window.AdminList = AdminList;
}

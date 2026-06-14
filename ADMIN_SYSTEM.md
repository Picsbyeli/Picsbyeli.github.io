# Admin System Documentation

## Overview
A comprehensive admin management system has been created for the E.Vol Games website. This system centralizes all admin user management, access control, and locked game management in a single configuration file.

## Admin Configuration File
**Location:** `js/admin-list.js`

This file contains all admin users, their credentials, and the list of locked games. The system provides methods for checking admin status, verifying credentials, and managing locked games.

### Current Admin Users
```javascript
{
  email: 'elidaslaya@gmail.com',
  password: 'Mocandy12',
  displayName: 'Eli',
  role: 'owner',
  isActive: true
}
```

## Key Features

### 1. Admin List Management
- **Centralized Admin Database**: All admin users are defined in a single location (`js/admin-list.js`)
- **Add Admin**: `AdminList.addAdmin(email, password, displayName, role)`
- **Remove Admin**: `AdminList.removeAdmin(email)`
- **Verify Credentials**: `AdminList.verifyCredentials(email, password)`
- **Check Admin Status**: `AdminList.isAdmin(email)`

### 2. Locked Games Management
- **Locked Games**: Games that only admins can access
  - `pokemon-veil/VOE`
  - `pokemon-veil/pokemon-veil-of-eternity`
- **Add Locked Game**: `AdminList.addLockedGame(gameId)`
- **Unlock Game**: `AdminList.removeLockedGame(gameId)`
- **Check if Game is Locked**: `AdminList.isGameLocked(gameId)`

### 3. Admin Bypass Features

#### Password Protection Bypass
Admins are automatically granted access to the website without needing to enter the password. The `PasswordProtection` module checks if the logged-in user is an admin and automatically authenticates them.

**File Modified:** `js/password-protection.js`
- `isAdminUser()`: Checks if current user is an admin
- Admin users bypass the password modal on page load
- Admin users don't need password re-authentication

#### Game Access Control
The `steam-hub.js` file has been updated to check the admin list when determining which games to display and which ones are locked.

**File Modified:** `js/steam-hub.js`
- Uses `AdminList.getLockedGames()` instead of hardcoded game IDs
- `isAdmin()` method now uses `AdminList.isAdmin()` for verification

#### Admin Module Integration
The admin tracking module now uses the centralized admin list to identify admins.

**File Modified:** `js/admin-module.js`
- Uses `AdminList.isAdmin()` to check admin status
- Tracks which online users are admins

## Implementation Details

### Modified Files

1. **Created: `js/admin-list.js`**
   - Central admin configuration and management system
   - Methods for admin and locked game management

2. **Modified: `js/admin-module.js`**
   - Updated to use `AdminList.isAdmin()` instead of hardcoded email
   - Updated admin presence tracking

3. **Modified: `js/steam-hub.js`**
   - Uses `AdminList.getLockedGames()` for locked games list
   - Updated `isAdmin()` method to use `AdminList.isAdmin()`

4. **Modified: `js/password-protection.js`**
   - Added `isAdminUser()` method
   - Admins bypass password protection

5. **Modified: HTML Files**
   - Added `<script src="js/admin-list.js"></script>` to:
     - `index.html`
     - `auth.html`
     - `account.html`
     - `dashboard.html`

## Usage Examples

### Check if User is Admin
```javascript
if (window.AdminList.isAdmin('elidaslaya@gmail.com')) {
  console.log('User is admin');
}
```

### Verify Admin Login
```javascript
const admin = window.AdminList.verifyCredentials('elidaslaya@gmail.com', 'Mocandy12');
if (admin) {
  console.log('Login successful:', admin);
} else {
  console.log('Invalid credentials');
}
```

### Add New Admin
```javascript
window.AdminList.addAdmin(
  'newadmin@example.com',
  'password123',
  'New Admin',
  'admin'
);
```

### Manage Locked Games
```javascript
// Check if a game is locked
const isLocked = window.AdminList.isGameLocked('game-id');

// Add a locked game
window.AdminList.addLockedGame('new-game-id');

// Unlock a game
window.AdminList.removeLockedGame('game-id');
```

### Get All Admins
```javascript
const admins = window.AdminList.getAllAdmins();
console.log(admins);
```

## Security Notes

### Current Implementation
- Passwords are currently stored in plain text for demo purposes
- TODO: Implement proper password hashing (bcrypt, scrypt, etc.) in production

### Production Recommendations
1. **Password Hashing**: Use bcrypt or similar for password storage
2. **Server-Side Verification**: Move admin verification to backend
3. **Session Management**: Implement secure session tokens
4. **Audit Logging**: Track all admin actions
5. **Rate Limiting**: Implement login attempt rate limiting
6. **Two-Factor Authentication**: Add 2FA for admin accounts

## Future Enhancements

1. **Admin Roles and Permissions**: Define different permission levels
   - Owner: Full access
   - Admin: Game management access
   - Moderator: View-only access

2. **Admin Dashboard**: Create interface for managing admins and locked games

3. **Audit Trail**: Log all admin actions with timestamps

4. **Admin Activity Monitoring**: Real-time view of admin actions

5. **Temporary Access**: Grant time-limited access to games for non-admins

## File Structure
```
js/
  ├── admin-list.js          (NEW - Admin configuration)
  ├── admin-module.js        (MODIFIED - Uses admin list)
  ├── steam-hub.js           (MODIFIED - Uses admin list)
  ├── password-protection.js (MODIFIED - Admin bypass)
  └── ...
```

## Accessing Locked Games as Admin

When logged in as an admin (elidaslaya@gmail.com):
1. You automatically bypass the password protection
2. All locked games appear in your game library
3. You can play any game without restrictions

## Troubleshooting

### Admin Features Not Working
- Ensure `admin-list.js` is loaded before other scripts
- Check browser console for any JavaScript errors
- Verify user is logged in with correct email

### Password Protection Still Showing
- Clear browser cache and localStorage
- Ensure you're logged in with an admin account
- Check that `AdminList` is defined in console: `console.log(window.AdminList)`

## Contact
For questions about the admin system, contact: elidaslaya@gmail.com

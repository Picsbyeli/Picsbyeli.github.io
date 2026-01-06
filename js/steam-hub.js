// Steam-like Game Hub JavaScript
class GameHub {
    constructor() {
        this.games = [];
        this.favorites = this.loadFavorites();
        this.recentlyPlayed = this.loadRecentlyPlayed();
        this.currentView = 'grid';
        this.currentSort = 'name';
        this.searchTerm = '';
        
        this.initializeGames();
        this.setupEventListeners();
        this.renderGames();
        this.updateSidebar();
        
        // Load and apply user settings (background, displayName, etc.)
        this.loadAndApplyUserSettings();
    }

    // Load user settings from Firebase/localStorage and apply them
    async loadAndApplyUserSettings() {
        // First, try to apply from localStorage for immediate display
        this.applyLocalSettings();
        
        // Then wait for Firebase auth and sync with cloud settings
        if (typeof window.gameAuth !== 'undefined') {
            try {
                await window.gameAuth.waitForAuthInit();
                if (window.gameAuth.isLoggedIn()) {
                    const settings = window.gameAuth.getUserSettings();
                    this.applySettings(settings);
                    // Sync localStorage with Firebase settings
                    this.syncLocalStorage(settings);
                }
            } catch (error) {
                console.log('Firebase auth not available, using localStorage settings');
            }
        }
    }

    // Apply settings from localStorage immediately
    applyLocalSettings() {
        const settings = {
            customBackground: localStorage.getItem('gameHub_customBackground') || null,
            backgroundTheme: localStorage.getItem('gameHub_backgroundTheme') || 'default',
            displayName: localStorage.getItem('gameHub_displayName') || ''
        };
        this.applySettings(settings);
    }

    // Apply settings to the page
    applySettings(settings) {
        // Apply background
        if (settings.customBackground) {
            this.applyCustomBackground(settings.customBackground);
        } else if (settings.backgroundTheme && settings.backgroundTheme !== 'default') {
            this.applyBackgroundTheme(settings.backgroundTheme);
        }
        
        // Apply display name if there's a display element
        if (settings.displayName) {
            this.updateDisplayName(settings.displayName);
        }
    }

    // Sync localStorage with Firebase settings
    syncLocalStorage(settings) {
        if (settings.customBackground) {
            localStorage.setItem('gameHub_customBackground', settings.customBackground);
        }
        if (settings.backgroundTheme) {
            localStorage.setItem('gameHub_backgroundTheme', settings.backgroundTheme);
        }
        if (settings.displayName) {
            localStorage.setItem('gameHub_displayName', settings.displayName);
        }
    }

    // Apply custom background image
    applyCustomBackground(backgroundData) {
        const container = document.querySelector('.steam-container');
        if (container) {
            container.style.backgroundImage = `url('${backgroundData}')`;
            container.style.backgroundSize = 'cover';
            container.style.backgroundPosition = 'center';
            container.style.backgroundRepeat = 'no-repeat';
            container.style.backgroundAttachment = 'fixed';
        }
    }

    // Apply preset background theme
    applyBackgroundTheme(theme) {
        const container = document.querySelector('.steam-container');
        if (!container) return;

        const themes = {
            'default': 'linear-gradient(135deg, #1b2838 0%, #171a21 50%, #1b2838 100%)',
            'ocean': 'linear-gradient(135deg, #0077b6 0%, #023e8a 50%, #03045e 100%)',
            'sunset': 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)',
            'forest': 'linear-gradient(135deg, #2d5a27 0%, #1e3932 50%, #2d5a27 100%)',
            'dark': 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
            'purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
            'fire': 'linear-gradient(135deg, #ff4e00 0%, #ec9f05 50%, #ff4e00 100%)'
        };

        container.style.backgroundImage = 'none';
        container.style.background = themes[theme] || themes['default'];
    }

    // Update display name in UI
    updateDisplayName(displayName) {
        // Update sidebar or header if display name element exists
        const displayNameElements = document.querySelectorAll('.user-display-name, #user-display-name');
        displayNameElements.forEach(el => {
            el.textContent = displayName;
        });
    }

    // Save custom background
    async saveCustomBackground(backgroundData) {
        // Save to localStorage immediately
        localStorage.setItem('gameHub_customBackground', backgroundData || '');
        localStorage.setItem('gameHub_backgroundTheme', 'custom');
        
        // Apply immediately
        if (backgroundData) {
            this.applyCustomBackground(backgroundData);
        }
        
        // Save to Firebase if logged in
        if (typeof window.gameAuth !== 'undefined' && window.gameAuth.isLoggedIn()) {
            return await window.gameAuth.saveCustomBackground(backgroundData);
        }
        
        return { success: true };
    }

    // Save background theme
    async saveBackgroundTheme(theme) {
        // Save to localStorage immediately
        localStorage.setItem('gameHub_backgroundTheme', theme || 'default');
        localStorage.removeItem('gameHub_customBackground');
        
        // Apply immediately
        this.applyBackgroundTheme(theme);
        
        // Save to Firebase if logged in
        if (typeof window.gameAuth !== 'undefined' && window.gameAuth.isLoggedIn()) {
            return await window.gameAuth.saveBackgroundTheme(theme);
        }
        
        return { success: true };
    }

    // Save display name
    async saveDisplayName(displayName) {
        // Save to localStorage immediately
        localStorage.setItem('gameHub_displayName', displayName || '');
        
        // Update UI immediately
        this.updateDisplayName(displayName);
        
        // Save to Firebase if logged in
        if (typeof window.gameAuth !== 'undefined' && window.gameAuth.isLoggedIn()) {
            return await window.gameAuth.saveDisplayName(displayName);
        }
        
        return { success: true };
    }

    // Restore to default settings
    async restoreToDefault() {
        // Clear localStorage
        localStorage.removeItem('gameHub_customBackground');
        localStorage.removeItem('gameHub_backgroundTheme');
        localStorage.removeItem('gameHub_displayName');
        
        // Apply default theme
        this.applyBackgroundTheme('default');
        
        // Restore in Firebase if logged in
        if (typeof window.gameAuth !== 'undefined' && window.gameAuth.isLoggedIn()) {
            return await window.gameAuth.restoreToDefault();
        }
        
        return { success: true };
    }

    initializeGames() {
        // Extract games from the hidden games data section
        const gamesDataDiv = document.getElementById('games-data');
        const gameCards = gamesDataDiv ? gamesDataDiv.querySelectorAll('.game-card') : [];
        
        this.games = Array.from(gameCards).map((card, index) => {
            const img = card.querySelector('img');
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('p').textContent;
            const href = card.getAttribute('href');
            
            return {
                id: this.generateGameId(href),
                title: title,
                description: description,
                href: href,
                image: img ? img.src : null,
                emoji: this.extractEmoji(title),
                dateAdded: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Simulate dates
            };
        });
    }

    generateGameId(href) {
        return href.replace('games/', '').replace('.html', '');
    }

    extractEmoji(title) {
        const match = title.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u);
        return match ? match[0] : '🎮';
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('game-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.renderGames();
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.renderGames();
            });
        }

        // View toggle
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentView = e.target.dataset.view;
                this.updateViewButtons();
                this.renderGames();
            });
        });

        // Navigation
        const navItems = document.querySelectorAll('.steam-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Don't prevent default for external links (like leaderboard.html)
                if (item.getAttribute('href') && item.getAttribute('href') !== '#') {
                    return; // Allow normal navigation
                }
                
                // Only prevent default and handle internally for section navigation
                if (e.target.dataset.section) {
                    e.preventDefault();
                    this.handleNavigation(e.target.dataset.section);
                }
            });
        });
    }

    handleNavigation(section) {
        // Update active nav item
        document.querySelectorAll('.steam-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        const contentTitle = document.querySelector('.content-title');
        switch (section) {
            case 'library':
                contentTitle.textContent = 'Library';
                this.renderGames();
                break;
            case 'favorites':
                contentTitle.textContent = 'Favorites';
                this.renderFavorites();
                break;
            case 'recent':
                contentTitle.textContent = 'Recently Played';
                this.renderRecentlyPlayed();
                break;
            default:
                contentTitle.textContent = 'Library';
                this.renderGames();
        }
    }

    updateViewButtons() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${this.currentView}"]`).classList.add('active');
    }

    toggleFavorite(gameId) {
        const index = this.favorites.indexOf(gameId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(gameId);
        }
        this.saveFavorites();
        this.updateSidebar();
        this.renderGames();
        
        // Update achievements for favorites count
        if (window.achievementsManager) {
            window.achievementsManager.updateFavorites(this.favorites.length);
        }
        
        // Animate the button
        const btn = document.querySelector(`[data-game-id="${gameId}"] .favorite-btn`);
        if (btn) {
            btn.classList.add('animate');
            setTimeout(() => btn.classList.remove('animate'), 300);
        }
    }

    playGame(gameId, gameHref) {
        // Add to recently played
        const existingIndex = this.recentlyPlayed.findIndex(item => item.id === gameId);
        if (existingIndex > -1) {
            this.recentlyPlayed.splice(existingIndex, 1);
        }
        
        this.recentlyPlayed.unshift({
            id: gameId,
            timestamp: new Date()
        });
        
        // Keep only last 10 recently played
        this.recentlyPlayed = this.recentlyPlayed.slice(0, 10);
        this.saveRecentlyPlayed();
        this.updateSidebar();
        
        // Record game played for achievements
        if (window.achievementsManager) {
            window.achievementsManager.recordGamePlayed(gameId);
        }
        
        // Navigate to game
        window.location.href = gameHref;
    }

    filterAndSortGames(games = this.games) {
        let filtered = games;

        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(game => 
                game.title.toLowerCase().includes(this.searchTerm) ||
                game.description.toLowerCase().includes(this.searchTerm)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'name':
                    return a.title.localeCompare(b.title);
                case 'recent':
                    return b.dateAdded - a.dateAdded;
                default:
                    return 0;
            }
        });

        return filtered;
    }

    renderGames() {
        const filteredGames = this.filterAndSortGames();
        
        if (this.currentView === 'grid') {
            this.renderGridView(filteredGames);
        } else {
            this.renderListView(filteredGames);
        }
    }

    renderGridView(games) {
        const container = document.querySelector('.games-grid');
        const listContainer = document.querySelector('.games-list');
        
        container.style.display = 'grid';
        listContainer.style.display = 'none';
        
        if (games.length === 0) {
            container.innerHTML = this.getEmptyState();
            return;
        }

        container.innerHTML = games.map(game => `
            <div class="steam-game-card" data-game-id="${game.id}">
                <div class="game-image">
                    ${game.image ? `<img src="${game.image}" alt="${game.title}" onerror="this.parentElement.innerHTML='${game.emoji}'">` : game.emoji}
                </div>
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="game-actions">
                        <button class="favorite-btn ${this.favorites.includes(game.id) ? 'favorited' : ''}" 
                                onclick="gameHub.toggleFavorite('${game.id}')" 
                                title="${this.favorites.includes(game.id) ? 'Remove from favorites' : 'Add to favorites'}">
                            ${this.favorites.includes(game.id) ? '★' : '☆'}
                        </button>
                        <button class="play-btn" onclick="gameHub.playGame('${game.id}', '${game.href}')">
                            Play
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderListView(games) {
        const container = document.querySelector('.games-grid');
        const listContainer = document.querySelector('.games-list');
        
        container.style.display = 'none';
        listContainer.style.display = 'block';
        
        if (games.length === 0) {
            listContainer.innerHTML = this.getEmptyState();
            return;
        }

        listContainer.innerHTML = games.map(game => `
            <div class="steam-game-list-item" data-game-id="${game.id}">
                <div class="list-game-icon">${game.emoji}</div>
                <div class="list-game-info">
                    <h4 class="list-game-title">${game.title}</h4>
                    <p class="list-game-description">${game.description}</p>
                </div>
                <div class="game-actions">
                    <button class="favorite-btn ${this.favorites.includes(game.id) ? 'favorited' : ''}" 
                            onclick="gameHub.toggleFavorite('${game.id}')" 
                            title="${this.favorites.includes(game.id) ? 'Remove from favorites' : 'Add to favorites'}">
                        ${this.favorites.includes(game.id) ? '★' : '☆'}
                    </button>
                    <button class="play-btn" onclick="gameHub.playGame('${game.id}', '${game.href}')">
                        Play
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderFavorites() {
        const favoriteGames = this.games.filter(game => this.favorites.includes(game.id));
        
        if (this.currentView === 'grid') {
            this.renderGridView(favoriteGames);
        } else {
            this.renderListView(favoriteGames);
        }
    }

    renderRecentlyPlayed() {
        const recentGames = this.recentlyPlayed
            .map(recent => this.games.find(game => game.id === recent.id))
            .filter(game => game); // Remove any null/undefined games
        
        if (this.currentView === 'grid') {
            this.renderGridView(recentGames);
        } else {
            this.renderListView(recentGames);
        }
    }

    updateSidebar() {
        this.updateSidebarFavorites();
        this.updateSidebarRecent();
    }

    updateSidebarFavorites() {
        const container = document.querySelector('.sidebar-favorites');
        if (!container) return;

        const favoriteGames = this.games.filter(game => this.favorites.includes(game.id)).slice(0, 5);
        
        if (favoriteGames.length === 0) {
            container.innerHTML = '<p class="sidebar-empty-text">No favorites yet</p>';
            return;
        }

        container.innerHTML = favoriteGames.map(game => `
            <a href="${game.href}" class="sidebar-game-item">
                <div class="sidebar-game-icon">${game.emoji}</div>
                <div class="sidebar-game-name">${game.title.replace(/[^\w\s]/gi, '').trim()}</div>
            </a>
        `).join('');
    }

    updateSidebarRecent() {
        const container = document.querySelector('.sidebar-recent');
        if (!container) return;

        const recentGames = this.recentlyPlayed
            .map(recent => this.games.find(game => game.id === recent.id))
            .filter(game => game)
            .slice(0, 5);
        
        if (recentGames.length === 0) {
            container.innerHTML = '<p class="sidebar-empty-text">No recent games</p>';
            return;
        }

        container.innerHTML = recentGames.map(game => `
            <a href="${game.href}" class="sidebar-game-item">
                <div class="sidebar-game-icon">${game.emoji}</div>
                <div class="sidebar-game-name">${game.title.replace(/[^\w\s]/gi, '').trim()}</div>
            </a>
        `).join('');
    }

    getEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">🎮</div>
                <h3>No games found</h3>
                <p>Try adjusting your search or browse all games</p>
            </div>
        `;
    }

    // Local storage methods
    loadFavorites() {
        const stored = localStorage.getItem('gameHub_favorites');
        return stored ? JSON.parse(stored) : [];
    }

    saveFavorites() {
        localStorage.setItem('gameHub_favorites', JSON.stringify(this.favorites));
    }

    loadRecentlyPlayed() {
        const stored = localStorage.getItem('gameHub_recentlyPlayed');
        return stored ? JSON.parse(stored) : [];
    }

    saveRecentlyPlayed() {
        localStorage.setItem('gameHub_recentlyPlayed', JSON.stringify(this.recentlyPlayed));
    }
}

// Authentication handling
function handleAccountClick() {
    // Check if user is logged in by checking for authentication token or user data
    const isLoggedIn = checkUserAuthStatus();
    
    if (isLoggedIn) {
        // User is logged in, go to account dashboard
        window.location.href = 'account.html';
    } else {
        // User is not logged in, go to login/register page
        window.location.href = 'auth.html';
    }
}

function checkUserAuthStatus() {
    // Check multiple sources for authentication status
    
    // 1. Check if Firebase auth is available and user is logged in
    if (window.gameAuth && typeof window.gameAuth.isLoggedIn === 'function') {
        return window.gameAuth.isLoggedIn();
    }
    
    // 2. Check localStorage for auth tokens or user data
    const authToken = localStorage.getItem('authToken') || localStorage.getItem('user_token');
    const userData = localStorage.getItem('userData') || localStorage.getItem('currentUser');
    
    if (authToken || userData) {
        try {
            // Verify the token/data is valid JSON and not expired
            if (userData) {
                const user = JSON.parse(userData);
                return user && user.email; // Basic check for valid user data
            }
            return !!authToken;
        } catch (e) {
            return false;
        }
    }
    
    // 3. Check sessionStorage
    const sessionAuth = sessionStorage.getItem('isLoggedIn') || sessionStorage.getItem('authToken');
    if (sessionAuth) {
        return sessionAuth === 'true' || sessionAuth.length > 0;
    }
    
    // 4. Default to not logged in
    return false;
}

// Initialize Firebase auth if available
function initializeFirebaseAuth() {
    // This will be called when the page loads to set up Firebase auth
    if (typeof window.gameAuth !== 'undefined') {
        // Firebase auth is available, set up auth state listener
        console.log('Firebase auth detected');
    } else {
        // Import Firebase auth if not already loaded
        loadFirebaseAuth();
    }
}

function loadFirebaseAuth() {
    // Dynamically load Firebase auth if needed
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
        import { GameAuth } from './js/firebase-auth.js';
        
        const firebaseConfig = {
            apiKey: "AIzaSyDn2cL3G7YIU5F9pYcwWp3vd6rT8GHfVlE",
            authDomain: "profile-9e9f9.firebaseapp.com",
            projectId: "profile-9e9f9",
            storageBucket: "profile-9e9f9.appspot.com",
            messagingSenderId: "412374234567",
            appId: "1:412374234567:web:8a9b5c6d7e8f9g0h1i2j3k4l"
        };
        
        try {
            const app = initializeApp(firebaseConfig);
            window.gameAuth = new GameAuth(app);
            console.log('Firebase auth initialized');
        } catch (error) {
            console.log('Firebase auth not available:', error);
        }
    `;
    document.head.appendChild(script);
}

// Initialize when DOM is loaded
let gameHub;
let dailyChallengeCalendar;

document.addEventListener('DOMContentLoaded', () => {
    gameHub = new GameHub();
    initializeFirebaseAuth();
    dailyChallengeCalendar = new DailyChallengeCalendar();
});

// Daily Challenge Calendar System
class DailyChallengeCalendar {
    constructor() {
        this.currentDate = new Date();
        this.viewingDate = new Date();
        this.challengeData = this.loadChallengeData();
        this.games = [];
        
        // Wait for games to be initialized
        setTimeout(() => {
            if (gameHub && gameHub.games) {
                this.games = gameHub.games;
            }
            this.init();
        }, 100);
    }

    init() {
        this.renderCalendar();
        this.renderTodaysChallenge();
        this.updateStats();
    }

    loadChallengeData() {
        const stored = localStorage.getItem('dailyChallengeData');
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            completedDays: {},  // { 'YYYY-MM-DD': { gameId, completed, points } }
            streak: 0,
            bestStreak: 0,
            totalPoints: 0,
            totalCompleted: 0,
            lastCompletedDate: null
        };
    }

    saveChallengeData() {
        localStorage.setItem('dailyChallengeData', JSON.stringify(this.challengeData));
        
        // Also save to Firebase if logged in
        if (typeof window.gameAuth !== 'undefined' && window.gameAuth.isLoggedIn()) {
            window.gameAuth.updateUserProfile({
                'dailyChallengeData': this.challengeData
            }).catch(err => console.log('Could not sync challenge data:', err));
        }
    }

    getDailyChallenge(dateStr) {
        // Generate a consistent daily challenge based on the date
        if (this.games.length === 0) return null;
        
        // Use date string to generate a seed for random selection
        const seed = dateStr.split('-').reduce((a, b) => parseInt(a) + parseInt(b), 0);
        const gameIndex = seed % this.games.length;
        return this.games[gameIndex];
    }

    renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        const title = document.getElementById('calendar-month-title');
        
        if (!grid || !title) return;

        const year = this.viewingDate.getFullYear();
        const month = this.viewingDate.getMonth();
        
        title.textContent = this.viewingDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const todayStr = this.getDateString(today);

        let html = '';
        
        // Day headers
        ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });

        // Empty cells before month starts
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const isFuture = new Date(dateStr) > today;
            const isCompleted = this.challengeData.completedDays[dateStr]?.completed;

            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isCompleted) classes += ' completed';
            if (isFuture) classes += ' future';

            html += `<div class="${classes}" data-date="${dateStr}" title="${isCompleted ? 'Completed!' : ''}">${day}</div>`;
        }

        grid.innerHTML = html;
    }

    renderTodaysChallenge() {
        const todayStr = this.getDateString(new Date());
        const challenge = this.getDailyChallenge(todayStr);
        const isCompleted = this.challengeData.completedDays[todayStr]?.completed;

        const iconEl = document.getElementById('challenge-game-icon');
        const nameEl = document.getElementById('challenge-game-name');
        const descEl = document.getElementById('challenge-description');
        const btnEl = document.getElementById('play-challenge-btn');
        const cardEl = document.getElementById('daily-challenge-card');

        if (!challenge || !iconEl) return;

        iconEl.textContent = challenge.emoji || '🎮';
        nameEl.textContent = challenge.title.replace(/[^\w\s]/gi, '').trim();
        descEl.textContent = isCompleted 
            ? '✅ Challenge completed! Come back tomorrow for a new challenge.'
            : `Play ${challenge.title.replace(/[^\w\s]/gi, '').trim()} to complete today's challenge!`;
        
        if (isCompleted) {
            btnEl.textContent = 'Completed ✓';
            btnEl.disabled = true;
            cardEl.classList.add('completed');
        } else {
            btnEl.textContent = 'Play Now';
            btnEl.disabled = false;
            cardEl.classList.remove('completed');
        }

        // Store current challenge for play button
        this.currentChallenge = challenge;
    }

    playDailyChallenge() {
        if (!this.currentChallenge) return;
        
        const todayStr = this.getDateString(new Date());
        
        // Mark as completed before navigating
        this.completeChallenge(todayStr, this.currentChallenge.id);
        
        // Navigate to game
        window.location.href = this.currentChallenge.href;
    }

    completeChallenge(dateStr, gameId) {
        const points = 100; // Base points for completing a challenge
        
        this.challengeData.completedDays[dateStr] = {
            gameId: gameId,
            completed: true,
            points: points,
            completedAt: new Date().toISOString()
        };

        // Update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = this.getDateString(yesterday);

        if (this.challengeData.lastCompletedDate === yesterdayStr) {
            this.challengeData.streak++;
        } else if (this.challengeData.lastCompletedDate !== dateStr) {
            this.challengeData.streak = 1;
        }

        this.challengeData.lastCompletedDate = dateStr;
        this.challengeData.totalPoints += points;
        this.challengeData.totalCompleted++;

        if (this.challengeData.streak > this.challengeData.bestStreak) {
            this.challengeData.bestStreak = this.challengeData.streak;
        }

        this.saveChallengeData();
        this.updateStats();
        this.renderCalendar();
        this.renderTodaysChallenge();
        
        // Sync achievements with updated challenge data
        if (window.achievementsManager) {
            window.achievementsManager.syncWithGameData();
        }
    }

    updateStats() {
        const streakEl = document.getElementById('streak-count');
        const completedEl = document.getElementById('challenges-completed');
        const pointsEl = document.getElementById('total-points');
        const bestStreakEl = document.getElementById('best-streak');

        if (streakEl) streakEl.textContent = this.challengeData.streak;
        if (completedEl) completedEl.textContent = this.challengeData.totalCompleted;
        if (pointsEl) pointsEl.textContent = this.challengeData.totalPoints;
        if (bestStreakEl) bestStreakEl.textContent = this.challengeData.bestStreak;
    }

    navigate(direction) {
        this.viewingDate.setMonth(this.viewingDate.getMonth() + direction);
        this.renderCalendar();
    }

    getDateString(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
}

// Global functions for calendar navigation
function navigateCalendar(direction) {
    if (dailyChallengeCalendar) {
        dailyChallengeCalendar.navigate(direction);
    }
}

function playDailyChallenge() {
    if (dailyChallengeCalendar) {
        dailyChallengeCalendar.playDailyChallenge();
    }
}

// ============================================
// ACHIEVEMENTS SYSTEM
// ============================================
class AchievementsManager {
    constructor() {
        this.achievements = this.defineAchievements();
        this.userData = this.loadUserData();
        this.showAllAchievements = false;
        
        this.init();
    }

    defineAchievements() {
        return [
            // Getting Started
            {
                id: 'first_game',
                name: 'First Steps',
                description: 'Play your first game',
                icon: '🎮',
                requirement: 1,
                type: 'games_played',
                reward: 10,
                rarity: 'common'
            },
            {
                id: 'five_games',
                name: 'Getting Warmed Up',
                description: 'Play 5 different games',
                icon: '🕹️',
                requirement: 5,
                type: 'unique_games',
                reward: 25,
                rarity: 'common'
            },
            {
                id: 'ten_games',
                name: 'Game Explorer',
                description: 'Play 10 different games',
                icon: '🗺️',
                requirement: 10,
                type: 'unique_games',
                reward: 50,
                rarity: 'rare'
            },
            {
                id: 'all_games',
                name: 'Completionist',
                description: 'Play every game at least once',
                icon: '👑',
                requirement: 45,
                type: 'unique_games',
                reward: 500,
                rarity: 'legendary'
            },

            // Daily Challenges
            {
                id: 'first_challenge',
                name: 'Challenge Accepted',
                description: 'Complete your first daily challenge',
                icon: '✅',
                requirement: 1,
                type: 'challenges_completed',
                reward: 15,
                rarity: 'common'
            },
            {
                id: 'five_challenges',
                name: 'Challenger',
                description: 'Complete 5 daily challenges',
                icon: '🎯',
                requirement: 5,
                type: 'challenges_completed',
                reward: 50,
                rarity: 'common'
            },
            {
                id: 'twenty_five_challenges',
                name: 'Challenge Master',
                description: 'Complete 25 daily challenges',
                icon: '🏅',
                requirement: 25,
                type: 'challenges_completed',
                reward: 150,
                rarity: 'rare'
            },
            {
                id: 'hundred_challenges',
                name: 'Challenge Legend',
                description: 'Complete 100 daily challenges',
                icon: '🌟',
                requirement: 100,
                type: 'challenges_completed',
                reward: 500,
                rarity: 'legendary'
            },

            // Streaks
            {
                id: 'three_day_streak',
                name: 'On a Roll',
                description: 'Maintain a 3-day streak',
                icon: '🔥',
                requirement: 3,
                type: 'best_streak',
                reward: 30,
                rarity: 'common'
            },
            {
                id: 'week_streak',
                name: 'Dedicated Player',
                description: 'Maintain a 7-day streak',
                icon: '📅',
                requirement: 7,
                type: 'best_streak',
                reward: 100,
                rarity: 'rare'
            },
            {
                id: 'two_week_streak',
                name: 'Committed Gamer',
                description: 'Maintain a 14-day streak',
                icon: '💪',
                requirement: 14,
                type: 'best_streak',
                reward: 250,
                rarity: 'epic'
            },
            {
                id: 'month_streak',
                name: 'Unstoppable',
                description: 'Maintain a 30-day streak',
                icon: '⚡',
                requirement: 30,
                type: 'best_streak',
                reward: 1000,
                rarity: 'legendary'
            },

            // Points
            {
                id: 'hundred_points',
                name: 'Point Collector',
                description: 'Earn 100 total points',
                icon: '💰',
                requirement: 100,
                type: 'total_points',
                reward: 20,
                rarity: 'common'
            },
            {
                id: 'five_hundred_points',
                name: 'Point Hoarder',
                description: 'Earn 500 total points',
                icon: '💎',
                requirement: 500,
                type: 'total_points',
                reward: 75,
                rarity: 'rare'
            },
            {
                id: 'thousand_points',
                name: 'Point Master',
                description: 'Earn 1,000 total points',
                icon: '🏆',
                requirement: 1000,
                type: 'total_points',
                reward: 200,
                rarity: 'epic'
            },
            {
                id: 'five_thousand_points',
                name: 'Point Tycoon',
                description: 'Earn 5,000 total points',
                icon: '💵',
                requirement: 5000,
                type: 'total_points',
                reward: 750,
                rarity: 'legendary'
            },

            // Favorites
            {
                id: 'first_favorite',
                name: 'Favorite Found',
                description: 'Add your first game to favorites',
                icon: '⭐',
                requirement: 1,
                type: 'favorites',
                reward: 10,
                rarity: 'common'
            },
            {
                id: 'five_favorites',
                name: 'Curator',
                description: 'Add 5 games to favorites',
                icon: '📚',
                requirement: 5,
                type: 'favorites',
                reward: 30,
                rarity: 'common'
            },
            {
                id: 'ten_favorites',
                name: 'Game Collector',
                description: 'Add 10 games to favorites',
                icon: '🎁',
                requirement: 10,
                type: 'favorites',
                reward: 75,
                rarity: 'rare'
            },

            // Special Achievements
            {
                id: 'night_owl',
                name: 'Night Owl',
                description: 'Play a game after midnight',
                icon: '🦉',
                requirement: 1,
                type: 'night_play',
                reward: 50,
                rarity: 'rare'
            }
        ];
    }

    loadUserData() {
        const saved = localStorage.getItem('gameHub_achievements');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            gamesPlayed: 0,
            uniqueGamesPlayed: [],
            challengesCompleted: 0,
            bestStreak: 0,
            totalPoints: 0,
            favorites: 0,
            nightPlay: false,
            unlockedAchievements: [],
            achievementPoints: 0
        };
    }

    saveUserData() {
        localStorage.setItem('gameHub_achievements', JSON.stringify(this.userData));
    }

    init() {
        this.syncWithGameData();
        this.renderAchievements();
        this.updateProgress();
    }

    syncWithGameData() {
        // Sync with daily challenge data
        const challengeData = localStorage.getItem('dailyChallengeData');
        if (challengeData) {
            const data = JSON.parse(challengeData);
            this.userData.challengesCompleted = data.totalCompleted || 0;
            this.userData.bestStreak = data.bestStreak || 0;
            this.userData.totalPoints = data.totalPoints || 0;
        }

        // Sync with favorites
        const favorites = JSON.parse(localStorage.getItem('steamHubFavorites') || '[]');
        this.userData.favorites = favorites.length;

        // Sync with recently played
        const recentlyPlayed = JSON.parse(localStorage.getItem('steamHubRecentlyPlayed') || '[]');
        this.userData.uniqueGamesPlayed = [...new Set([...this.userData.uniqueGamesPlayed, ...recentlyPlayed])];
        this.userData.gamesPlayed = this.userData.uniqueGamesPlayed.length;

        // Check for night owl
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5) {
            this.userData.nightPlay = true;
        }

        this.saveUserData();
        this.checkAchievements();
    }

    checkAchievements() {
        let newUnlocks = [];

        for (const achievement of this.achievements) {
            if (this.userData.unlockedAchievements.includes(achievement.id)) {
                continue;
            }

            let progress = 0;
            let unlocked = false;

            switch (achievement.type) {
                case 'games_played':
                    progress = this.userData.gamesPlayed;
                    break;
                case 'unique_games':
                    progress = this.userData.uniqueGamesPlayed.length;
                    break;
                case 'challenges_completed':
                    progress = this.userData.challengesCompleted;
                    break;
                case 'best_streak':
                    progress = this.userData.bestStreak;
                    break;
                case 'total_points':
                    progress = this.userData.totalPoints;
                    break;
                case 'favorites':
                    progress = this.userData.favorites;
                    break;
                case 'night_play':
                    progress = this.userData.nightPlay ? 1 : 0;
                    break;
            }

            if (progress >= achievement.requirement) {
                unlocked = true;
                this.unlockAchievement(achievement);
                newUnlocks.push(achievement);
            }
        }

        if (newUnlocks.length > 0) {
            this.renderAchievements();
            this.updateProgress();
        }

        return newUnlocks;
    }

    unlockAchievement(achievement) {
        if (this.userData.unlockedAchievements.includes(achievement.id)) {
            return;
        }

        this.userData.unlockedAchievements.push(achievement.id);
        this.userData.achievementPoints += achievement.reward;
        this.saveUserData();

        // Show notification
        this.showUnlockNotification(achievement);
    }

    showUnlockNotification(achievement) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.achievement-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `
            <div class="toast-icon">${achievement.icon}</div>
            <div class="toast-content">
                <h4>🏆 Achievement Unlocked!</h4>
                <p>${achievement.name}</p>
            </div>
        `;

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    getProgress(achievement) {
        let current = 0;

        switch (achievement.type) {
            case 'games_played':
                current = this.userData.gamesPlayed;
                break;
            case 'unique_games':
                current = this.userData.uniqueGamesPlayed.length;
                break;
            case 'challenges_completed':
                current = this.userData.challengesCompleted;
                break;
            case 'best_streak':
                current = this.userData.bestStreak;
                break;
            case 'total_points':
                current = this.userData.totalPoints;
                break;
            case 'favorites':
                current = this.userData.favorites;
                break;
            case 'night_play':
                current = this.userData.nightPlay ? 1 : 0;
                break;
        }

        return {
            current,
            required: achievement.requirement,
            percentage: Math.min(100, (current / achievement.requirement) * 100)
        };
    }

    renderAchievements() {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;

        // Sort achievements: unlocked first, then by progress percentage
        const sortedAchievements = [...this.achievements].sort((a, b) => {
            const aUnlocked = this.userData.unlockedAchievements.includes(a.id);
            const bUnlocked = this.userData.unlockedAchievements.includes(b.id);
            
            if (aUnlocked && !bUnlocked) return -1;
            if (!aUnlocked && bUnlocked) return 1;
            
            const aProgress = this.getProgress(a).percentage;
            const bProgress = this.getProgress(b).percentage;
            return bProgress - aProgress;
        });

        // Show limited or all based on toggle
        const displayAchievements = this.showAllAchievements 
            ? sortedAchievements 
            : sortedAchievements.slice(0, 6);

        grid.innerHTML = displayAchievements.map(achievement => {
            const isUnlocked = this.userData.unlockedAchievements.includes(achievement.id);
            const progress = this.getProgress(achievement);

            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <h4 class="achievement-name">${achievement.name}</h4>
                        <p class="achievement-description">${achievement.description}</p>
                        ${!isUnlocked ? `
                            <div class="achievement-progress-bar">
                                <div class="achievement-progress-fill" style="width: ${progress.percentage}%"></div>
                            </div>
                        ` : `
                            <span class="achievement-unlocked-date">✓ Unlocked</span>
                        `}
                    </div>
                    <span class="achievement-reward">+${achievement.reward}</span>
                    <span class="achievement-rarity ${achievement.rarity}">${achievement.rarity}</span>
                </div>
            `;
        }).join('');
    }

    updateProgress() {
        const progressEl = document.getElementById('achievements-progress');
        if (progressEl) {
            const total = this.achievements.length;
            const unlocked = this.userData.unlockedAchievements.length;
            progressEl.textContent = `${unlocked}/${total} Unlocked`;
        }
    }

    toggleShowAll() {
        this.showAllAchievements = !this.showAllAchievements;
        
        const grid = document.getElementById('achievements-grid');
        const textEl = document.getElementById('toggle-achievements-text');
        
        if (grid) {
            grid.classList.toggle('expanded', this.showAllAchievements);
        }
        
        if (textEl) {
            textEl.textContent = this.showAllAchievements 
                ? 'Show Less' 
                : 'View All Achievements';
        }
        
        this.renderAchievements();
    }

    // Called when a game is played
    recordGamePlayed(gameId) {
        if (!this.userData.uniqueGamesPlayed.includes(gameId)) {
            this.userData.uniqueGamesPlayed.push(gameId);
        }
        this.userData.gamesPlayed++;

        // Check for night owl
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5) {
            this.userData.nightPlay = true;
        }

        this.saveUserData();
        this.checkAchievements();
    }

    // Called when favorites change
    updateFavorites(count) {
        this.userData.favorites = count;
        this.saveUserData();
        this.checkAchievements();
    }
}

// Initialize achievements manager
let achievementsManager;
document.addEventListener('DOMContentLoaded', () => {
    achievementsManager = new AchievementsManager();
});

// Global function to toggle achievements view
function toggleAllAchievements() {
    if (achievementsManager) {
        achievementsManager.toggleShowAll();
    }
}

// Export for global access
window.achievementsManager = achievementsManager;
window.toggleAllAchievements = toggleAllAchievements;

// Export for global access
window.navigateCalendar = navigateCalendar;
window.playDailyChallenge = playDailyChallenge;
// Export for global access
window.gameHub = gameHub;
window.handleAccountClick = handleAccountClick;
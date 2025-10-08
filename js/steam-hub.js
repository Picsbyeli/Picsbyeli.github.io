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
                e.preventDefault();
                this.handleNavigation(e.target.dataset.section);
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

// Initialize when DOM is loaded
let gameHub;
document.addEventListener('DOMContentLoaded', () => {
    gameHub = new GameHub();
});

// Export for global access
window.gameHub = gameHub;
class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.currentTrack = null;
        this.playlist = [];
        this.currentPlaylistIndex = 0;
        this.isPlaying = false;
        this.volume = 0.7;
        this.shuffle = false;
        this.repeat = 'none'; // 'none', 'one', 'all'
        this.userPlaylists = {};
        
        // Music library - in a real app, this would come from an API
        this.musicLibrary = [
            {
                id: 1,
                title: "Chill Vibes",
                artist: "Lo-Fi Beats",
                duration: "3:24",
                genre: "Chill",
                url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                cover: "🎵"
            },
            {
                id: 2,
                title: "Gaming Focus",
                artist: "Electronic Dreams",
                duration: "4:12",
                genre: "Electronic",
                url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                cover: "🎮"
            },
            {
                id: 3,
                title: "Retro Arcade",
                artist: "8-Bit Heroes",
                duration: "2:56",
                genre: "Chiptune",
                url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                cover: "👾"
            },
            {
                id: 4,
                title: "Puzzle Solver",
                artist: "Mind Games",
                duration: "3:48",
                genre: "Ambient",
                url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                cover: "🧩"
            },
            {
                id: 5,
                title: "Victory March",
                artist: "Epic Orchestral",
                duration: "5:23",
                genre: "Orchestral",
                url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                cover: "🏆"
            },
            {
                id: 6,
                title: "Synthwave Drive",
                artist: "Neon Lights",
                duration: "4:05",
                genre: "Synthwave",
                url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                cover: "🌃"
            },
            {
                id: 7,
                title: "Forest Sounds",
                artist: "Nature Ambience",
                duration: "6:00",
                genre: "Nature",
                url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                cover: "🌲"
            },
            {
                id: 8,
                title: "Space Journey",
                artist: "Cosmic Sounds",
                duration: "7:15",
                genre: "Ambient",
                url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                cover: "🚀"
            }
        ];
        
        this.currentActiveTab = 'library';
        this.searchQuery = '';
        this.filteredMusic = [...this.musicLibrary];
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupAudioEvents();
        this.createWidget();
        this.setupGlobalKeyBindings();
        
        // Load saved playlist and position
        this.loadPlaylistState();
    }
    
    loadSettings() {
        const settings = localStorage.getItem('musicPlayer_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            this.volume = parsed.volume || 0.7;
            this.shuffle = parsed.shuffle || false;
            this.repeat = parsed.repeat || 'none';
        }
        
        const playlists = localStorage.getItem('musicPlayer_playlists');
        if (playlists) {
            this.userPlaylists = JSON.parse(playlists);
        }
    }
    
    saveSettings() {
        localStorage.setItem('musicPlayer_settings', JSON.stringify({
            volume: this.volume,
            shuffle: this.shuffle,
            repeat: this.repeat
        }));
        localStorage.setItem('musicPlayer_playlists', JSON.stringify(this.userPlaylists));
    }
    
    loadPlaylistState() {
        const state = localStorage.getItem('musicPlayer_state');
        if (state) {
            const parsed = JSON.parse(state);
            this.playlist = parsed.playlist || [];
            this.currentPlaylistIndex = parsed.currentPlaylistIndex || 0;
            this.currentTrack = parsed.currentTrack || null;
            
            if (this.currentTrack) {
                this.audio.src = this.currentTrack.url;
                this.audio.currentTime = parsed.currentTime || 0;
                this.updateCurrentTrackDisplay();
            }
        }
    }
    
    savePlaylistState() {
        localStorage.setItem('musicPlayer_state', JSON.stringify({
            playlist: this.playlist,
            currentPlaylistIndex: this.currentPlaylistIndex,
            currentTrack: this.currentTrack,
            currentTime: this.audio.currentTime
        }));
    }
    
    setupAudioEvents() {
        this.audio.volume = this.volume;
        
        this.audio.addEventListener('loadstart', () => {
            this.updatePlayerControls();
        });
        
        this.audio.addEventListener('canplay', () => {
            this.updatePlayerControls();
        });
        
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayerControls();
            this.updateMusicButton();
        });
        
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayerControls();
            this.updateMusicButton();
        });
        
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgressBar();
            this.savePlaylistState();
        });
        
        this.audio.addEventListener('ended', () => {
            this.handleTrackEnd();
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.nextTrack();
        });
    }
    
    createWidget() {
        // Create widget HTML
        const widget = document.createElement('div');
        widget.className = 'music-player-widget';
        widget.innerHTML = `
            <button class="music-player-button" id="musicPlayerBtn" title="Music Player">
                🎵
            </button>
            <div class="music-player-panel" id="musicPlayerPanel">
                <div class="music-player-header">
                    <h3 class="music-player-title">🎵 Music Player</h3>
                    <button class="music-player-close" id="closeMusicPlayer">×</button>
                </div>
                <div class="music-player-content">
                    <div class="current-track" id="currentTrack">
                        <div class="current-track-title">No track selected</div>
                        <div class="current-track-artist">Choose a song to start playing</div>
                    </div>
                    
                    <div class="player-controls">
                        <button class="control-btn" id="prevBtn" title="Previous">⏮</button>
                        <button class="control-btn play-pause" id="playPauseBtn" title="Play/Pause">▶</button>
                        <button class="control-btn" id="nextBtn" title="Next">⏭</button>
                        <button class="control-btn" id="shuffleBtn" title="Shuffle">🔀</button>
                        <button class="control-btn" id="repeatBtn" title="Repeat">🔁</button>
                    </div>
                    
                    <div class="progress-container">
                        <div class="progress-bar" id="progressBar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                        <div class="time-display">
                            <span id="currentTime">0:00</span>
                            <span id="totalTime">0:00</span>
                        </div>
                    </div>
                    
                    <div class="volume-control">
                        <span>🔊</span>
                        <input type="range" class="volume-slider" id="volumeSlider" min="0" max="100" value="70">
                        <span id="volumeDisplay">70%</span>
                    </div>
                    
                    <div class="search-section">
                        <input type="text" class="search-input" id="musicSearch" placeholder="Search music...">
                    </div>
                    
                    <div class="music-tabs">
                        <button class="music-tab active" data-tab="library">Library</button>
                        <button class="music-tab" data-tab="playlists">Playlists</button>
                        <button class="music-tab" data-tab="queue">Queue</button>
                    </div>
                    
                    <div class="tab-content" id="libraryTab">
                        <div class="music-list" id="musicList"></div>
                    </div>
                    
                    <div class="tab-content" id="playlistsTab" style="display: none;">
                        <div class="playlist-actions">
                            <button class="playlist-btn" id="createPlaylistBtn">+ New Playlist</button>
                            <button class="playlist-btn" id="clearQueueBtn">Clear Queue</button>
                        </div>
                        <div class="music-list" id="playlistsList"></div>
                    </div>
                    
                    <div class="tab-content" id="queueTab" style="display: none;">
                        <div class="music-list" id="queueList"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        this.setupEventListeners();
        this.renderMusicList();
        this.updatePlayerControls();
    }
    
    setupEventListeners() {
        // Main button toggle
        document.getElementById('musicPlayerBtn').addEventListener('click', () => {
            this.togglePanel();
        });
        
        // Close panel
        document.getElementById('closeMusicPlayer').addEventListener('click', () => {
            this.hidePanel();
        });
        
        // Player controls
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousTrack();
        });
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextTrack();
        });
        
        document.getElementById('shuffleBtn').addEventListener('click', () => {
            this.toggleShuffle();
        });
        
        document.getElementById('repeatBtn').addEventListener('click', () => {
            this.toggleRepeat();
        });
        
        // Progress bar
        document.getElementById('progressBar').addEventListener('click', (e) => {
            this.seekTo(e);
        });
        
        // Volume control
        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });
        
        // Search
        document.getElementById('musicSearch').addEventListener('input', (e) => {
            this.searchMusic(e.target.value);
        });
        
        // Tabs
        document.querySelectorAll('.music-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });
        
        // Playlist actions
        document.getElementById('createPlaylistBtn').addEventListener('click', () => {
            this.createPlaylist();
        });
        
        document.getElementById('clearQueueBtn').addEventListener('click', () => {
            this.clearQueue();
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.music-player-widget')) {
                this.hidePanel();
            }
        });
    }
    
    setupGlobalKeyBindings() {
        document.addEventListener('keydown', (e) => {
            // Only trigger if not typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (e.code === 'Space' && e.ctrlKey) {
                e.preventDefault();
                this.togglePlayPause();
            } else if (e.code === 'ArrowRight' && e.ctrlKey) {
                e.preventDefault();
                this.nextTrack();
            } else if (e.code === 'ArrowLeft' && e.ctrlKey) {
                e.preventDefault();
                this.previousTrack();
            }
        });
    }
    
    togglePanel() {
        const panel = document.getElementById('musicPlayerPanel');
        if (panel.classList.contains('show')) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }
    
    showPanel() {
        const panel = document.getElementById('musicPlayerPanel');
        panel.classList.add('show');
        this.renderCurrentTab();
    }
    
    hidePanel() {
        const panel = document.getElementById('musicPlayerPanel');
        panel.classList.remove('show');
    }
    
    togglePlayPause() {
        if (!this.currentTrack) {
            // If no track selected, play first track in library
            if (this.filteredMusic.length > 0) {
                this.playTrack(this.filteredMusic[0]);
            }
            return;
        }
        
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
    }
    
    playTrack(track) {
        this.currentTrack = track;
        this.audio.src = track.url;
        this.audio.load();
        this.audio.play();
        
        // Add to queue if not already there
        if (!this.playlist.find(t => t.id === track.id)) {
            this.playlist.push(track);
            this.currentPlaylistIndex = this.playlist.length - 1;
        } else {
            this.currentPlaylistIndex = this.playlist.findIndex(t => t.id === track.id);
        }
        
        this.updateCurrentTrackDisplay();
        this.savePlaylistState();
    }
    
    nextTrack() {
        if (this.playlist.length === 0) return;
        
        if (this.shuffle) {
            this.currentPlaylistIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentPlaylistIndex = (this.currentPlaylistIndex + 1) % this.playlist.length;
        }
        
        this.playTrack(this.playlist[this.currentPlaylistIndex]);
    }
    
    previousTrack() {
        if (this.playlist.length === 0) return;
        
        if (this.shuffle) {
            this.currentPlaylistIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentPlaylistIndex = this.currentPlaylistIndex === 0 
                ? this.playlist.length - 1 
                : this.currentPlaylistIndex - 1;
        }
        
        this.playTrack(this.playlist[this.currentPlaylistIndex]);
    }
    
    handleTrackEnd() {
        if (this.repeat === 'one') {
            this.audio.currentTime = 0;
            this.audio.play();
        } else if (this.repeat === 'all' || this.currentPlaylistIndex < this.playlist.length - 1) {
            this.nextTrack();
        } else {
            this.isPlaying = false;
            this.updatePlayerControls();
            this.updateMusicButton();
        }
    }
    
    toggleShuffle() {
        this.shuffle = !this.shuffle;
        this.updatePlayerControls();
        this.saveSettings();
    }
    
    toggleRepeat() {
        const modes = ['none', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeat);
        this.repeat = modes[(currentIndex + 1) % modes.length];
        this.updatePlayerControls();
        this.saveSettings();
    }
    
    setVolume(volume) {
        this.volume = volume;
        this.audio.volume = volume;
        document.getElementById('volumeDisplay').textContent = Math.round(volume * 100) + '%';
        this.saveSettings();
    }
    
    seekTo(event) {
        if (!this.currentTrack) return;
        
        const progressBar = document.getElementById('progressBar');
        const rect = progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        const seekTime = percent * this.audio.duration;
        
        if (!isNaN(seekTime)) {
            this.audio.currentTime = seekTime;
        }
    }
    
    searchMusic(query) {
        this.searchQuery = query.toLowerCase();
        this.filteredMusic = this.musicLibrary.filter(track => 
            track.title.toLowerCase().includes(this.searchQuery) ||
            track.artist.toLowerCase().includes(this.searchQuery) ||
            track.genre.toLowerCase().includes(this.searchQuery)
        );
        this.renderMusicList();
    }
    
    switchTab(tabName) {
        this.currentActiveTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.music-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(tabName + 'Tab').style.display = 'block';
        
        this.renderCurrentTab();
    }
    
    renderCurrentTab() {
        switch (this.currentActiveTab) {
            case 'library':
                this.renderMusicList();
                break;
            case 'playlists':
                this.renderPlaylists();
                break;
            case 'queue':
                this.renderQueue();
                break;
        }
    }
    
    renderMusicList() {
        const container = document.getElementById('musicList');
        
        if (this.filteredMusic.length === 0) {
            container.innerHTML = `
                <div class="no-music">
                    <div class="no-music-icon">🎵</div>
                    <p>No music found</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.filteredMusic.map(track => `
            <div class="music-item ${this.currentTrack?.id === track.id ? 'playing' : ''}" data-track-id="${track.id}">
                <div class="music-item-icon">${track.cover}</div>
                <div class="music-item-info">
                    <div class="music-item-title">${track.title}</div>
                    <div class="music-item-artist">${track.artist}</div>
                </div>
                <div class="music-item-duration">${track.duration}</div>
            </div>
        `).join('');
        
        // Add click listeners
        container.querySelectorAll('.music-item').forEach(item => {
            item.addEventListener('click', () => {
                const trackId = parseInt(item.dataset.trackId);
                const track = this.musicLibrary.find(t => t.id === trackId);
                this.playTrack(track);
                this.renderMusicList(); // Re-render to update playing state
            });
        });
    }
    
    renderPlaylists() {
        const container = document.getElementById('playlistsList');
        
        if (Object.keys(this.userPlaylists).length === 0) {
            container.innerHTML = `
                <div class="no-music">
                    <div class="no-music-icon">📋</div>
                    <p>No playlists created</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = Object.entries(this.userPlaylists).map(([name, tracks]) => `
            <div class="music-item" data-playlist="${name}">
                <div class="music-item-icon">📋</div>
                <div class="music-item-info">
                    <div class="music-item-title">${name}</div>
                    <div class="music-item-artist">${tracks.length} tracks</div>
                </div>
            </div>
        `).join('');
        
        // Add click listeners for playlists
        container.querySelectorAll('.music-item').forEach(item => {
            item.addEventListener('click', () => {
                const playlistName = item.dataset.playlist;
                this.loadPlaylist(playlistName);
            });
        });
    }
    
    renderQueue() {
        const container = document.getElementById('queueList');
        
        if (this.playlist.length === 0) {
            container.innerHTML = `
                <div class="no-music">
                    <div class="no-music-icon">⏸️</div>
                    <p>Queue is empty</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.playlist.map((track, index) => `
            <div class="music-item ${this.currentPlaylistIndex === index ? 'playing' : ''}" data-queue-index="${index}">
                <div class="music-item-icon">${track.cover}</div>
                <div class="music-item-info">
                    <div class="music-item-title">${track.title}</div>
                    <div class="music-item-artist">${track.artist}</div>
                </div>
                <div class="music-item-duration">${track.duration}</div>
            </div>
        `).join('');
        
        // Add click listeners for queue items
        container.querySelectorAll('.music-item').forEach(item => {
            item.addEventListener('click', () => {
                const queueIndex = parseInt(item.dataset.queueIndex);
                this.currentPlaylistIndex = queueIndex;
                this.playTrack(this.playlist[queueIndex]);
                this.renderQueue(); // Re-render to update playing state
            });
        });
    }
    
    createPlaylist() {
        const name = prompt('Enter playlist name:');
        if (name && name.trim()) {
            this.userPlaylists[name.trim()] = [];
            this.saveSettings();
            this.renderPlaylists();
        }
    }
    
    loadPlaylist(name) {
        const tracks = this.userPlaylists[name];
        if (tracks && tracks.length > 0) {
            this.playlist = [...tracks];
            this.currentPlaylistIndex = 0;
            this.playTrack(this.playlist[0]);
            this.switchTab('queue');
        }
    }
    
    clearQueue() {
        if (confirm('Clear the current queue?')) {
            this.playlist = [];
            this.currentPlaylistIndex = 0;
            this.savePlaylistState();
            this.renderQueue();
        }
    }
    
    updateCurrentTrackDisplay() {
        const container = document.getElementById('currentTrack');
        if (this.currentTrack) {
            container.innerHTML = `
                <div class="current-track-title">${this.currentTrack.title}</div>
                <div class="current-track-artist">${this.currentTrack.artist}</div>
            `;
        } else {
            container.innerHTML = `
                <div class="current-track-title">No track selected</div>
                <div class="current-track-artist">Choose a song to start playing</div>
            `;
        }
    }
    
    updatePlayerControls() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const shuffleBtn = document.getElementById('shuffleBtn');
        const repeatBtn = document.getElementById('repeatBtn');
        
        if (playPauseBtn) {
            playPauseBtn.textContent = this.isPlaying ? '⏸' : '▶';
        }
        
        if (shuffleBtn) {
            shuffleBtn.style.opacity = this.shuffle ? '1' : '0.5';
        }
        
        if (repeatBtn) {
            const repeatIcons = { none: '🔁', all: '🔂', one: '🔂' };
            repeatBtn.textContent = repeatIcons[this.repeat];
            repeatBtn.style.opacity = this.repeat !== 'none' ? '1' : '0.5';
        }
    }
    
    updateProgressBar() {
        if (!this.currentTrack || !this.audio.duration) return;
        
        const progressFill = document.getElementById('progressFill');
        const currentTimeEl = document.getElementById('currentTime');
        const totalTimeEl = document.getElementById('totalTime');
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        if (currentTimeEl) {
            currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
        
        if (totalTimeEl) {
            totalTimeEl.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    updateMusicButton() {
        const button = document.getElementById('musicPlayerBtn');
        if (button) {
            button.classList.toggle('playing', this.isPlaying);
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize music player when DOM is loaded
function initMusicPlayer() {
    if (typeof window.musicPlayer === 'undefined') {
        window.musicPlayer = new MusicPlayer();
    }
}

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusicPlayer);
} else {
    initMusicPlayer();
}
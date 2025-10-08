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
        
        // YouTube API configuration
        this.youtubeApiKey = "AIzaSyDn2cL3G7YIU5F9pYcwWp3vd6rT8GHfVlE";
        this.youtubeSearchResults = [];
        this.isYouTubeAPILoaded = false;
        
        // Music library - enhanced with YouTube integration capability
        this.musicLibrary = [
            {
                id: 1,
                title: "Chill Lofi Gaming",
                artist: "Lofi Hip Hop",
                duration: "3:24",
                genre: "Chill",
                type: "youtube",
                videoId: "jfKfPfyJRdk", // lofi hip hop radio
                cover: "🎵"
            },
            {
                id: 2,
                title: "Gaming Focus Mix",
                artist: "Electronic Beats",
                duration: "4:12",
                genre: "Electronic",
                type: "youtube",
                videoId: "4xDzrJKXOOY", // electronic gaming music
                cover: "🎮"
            },
            {
                id: 3,
                title: "8-Bit Arcade",
                artist: "Chiptune Heroes",
                duration: "2:56",
                genre: "Chiptune",
                type: "youtube",
                videoId: "UE6jKOUwojU", // 8-bit music mix
                cover: "👾"
            },
            {
                id: 4,
                title: "Ambient Study",
                artist: "Peaceful Sounds",
                duration: "3:48",
                genre: "Ambient",
                type: "youtube",
                videoId: "DWcJFNfaw9c", // ambient study music
                cover: "🧩"
            },
            {
                id: 5,
                title: "Epic Gaming",
                artist: "Orchestral Power",
                duration: "5:23",
                genre: "Orchestral",
                type: "youtube",
                videoId: "iqAWgtxtTnI", // epic orchestral gaming
                cover: "🏆"
            },
            {
                id: 6,
                title: "Synthwave Drive",
                artist: "Retro Wave",
                duration: "4:05",
                genre: "Synthwave",
                type: "youtube",
                videoId: "MV_3Dpw-BRY", // synthwave mix
                cover: "🌃"
            },
            {
                id: 7,
                title: "Nature Sounds",
                artist: "Ambient World",
                duration: "6:00",
                genre: "Nature",
                type: "youtube",
                videoId: "eKFTSSKCzWA", // nature sounds
                cover: "🌲"
            },
            {
                id: 8,
                title: "Space Ambient",
                artist: "Cosmic Vibes",
                duration: "7:15",
                genre: "Ambient",
                type: "youtube",
                videoId: "1-RodASLNtE", // space ambient
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
        
        // Initialize YouTube API
        this.initYouTubeAPI();
    }
    
    // Initialize YouTube API
    initYouTubeAPI() {
        // Load YouTube IFrame API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            // YouTube API ready callback
            window.onYouTubeIframeAPIReady = () => {
                this.isYouTubeAPILoaded = true;
                console.log('YouTube API loaded successfully');
            };
        }
    }
    
    // Search YouTube for music
    async searchYouTube(query, maxResults = 10) {
        if (!query.trim()) return [];
        
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?` +
                `part=snippet&type=video&videoCategoryId=10&` +
                `q=${encodeURIComponent(query + ' music')}&` +
                `maxResults=${maxResults}&` +
                `key=${this.youtubeApiKey}`
            );
            
            if (!response.ok) {
                throw new Error('YouTube API request failed');
            }
            
            const data = await response.json();
            
            return data.items.map(item => ({
                id: `yt_${item.id.videoId}`,
                title: item.snippet.title,
                artist: item.snippet.channelTitle,
                duration: "Unknown", // YouTube API v3 doesn't provide duration in search
                genre: "YouTube",
                type: "youtube",
                videoId: item.id.videoId,
                cover: "▶️",
                thumbnail: item.snippet.thumbnails.default.url
            }));
        } catch (error) {
            console.error('YouTube search error:', error);
            return [];
        }
    }
    
    // Get YouTube video audio URL (simplified approach)
    async getYouTubeAudioUrl(videoId) {
        // Note: Direct YouTube audio extraction requires server-side implementation
        // For now, we'll use a placeholder approach
        
        // In a production environment, you would need:
        // 1. A backend service to extract audio URLs using youtube-dl or similar
        // 2. Or use YouTube's embedded player (which we'll implement as fallback)
        
        // For demo purposes, we'll use a YouTube to MP3 API service
        // This is a simplified example - in production use proper YouTube API compliance
        
        try {
            // Placeholder: In real implementation, use your backend service
            // const response = await fetch(`/api/youtube-audio/${videoId}`);
            // const data = await response.json();
            // return data.audioUrl;
            
            // For now, return a placeholder URL and handle YouTube videos differently
            return `https://www.youtube.com/watch?v=${videoId}`;
        } catch (error) {
            console.error('Error getting YouTube audio URL:', error);
            return null;
        }
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
                        <input type="text" class="search-input" id="musicSearch" placeholder="Search music or YouTube...">
                        <div class="search-info">
                            <small>🔍 Search local library and YouTube</small>
                        </div>
                    </div>
                    
                    <div class="music-tabs">
                        <button class="music-tab active" data-tab="library">Library</button>
                        <button class="music-tab" data-tab="youtube">YouTube</button>
                        <button class="music-tab" data-tab="playlists">Playlists</button>
                        <button class="music-tab" data-tab="queue">Queue</button>
                    </div>
                    
                    <div class="tab-content" id="libraryTab">
                        <div class="music-list" id="musicList"></div>
                    </div>
                    
                    <div class="tab-content" id="youtubeTab" style="display: none;">
                        <div class="youtube-search-info">
                            <p>🎵 Search for music on YouTube</p>
                            <small>Use the search bar above to find YouTube music videos</small>
                        </div>
                        <div class="music-list" id="youtubeList"></div>
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
        
        // Handle YouTube player
        if (this.currentTrack.type === 'youtube' && this.youtubePlayer) {
            if (this.isPlaying) {
                this.youtubePlayer.pauseVideo();
            } else {
                this.youtubePlayer.playVideo();
            }
        } else {
            // Handle regular audio
            if (this.isPlaying) {
                this.audio.pause();
            } else {
                this.audio.play();
            }
        }
    }
    
    async playTrack(track) {
        this.currentTrack = track;
        
        // Handle YouTube tracks differently
        if (track.type === 'youtube' && track.videoId) {
            await this.playYouTubeTrack(track);
        } else if (track.url) {
            // Regular audio file
            this.audio.src = track.url;
            this.audio.load();
            this.audio.play();
        } else {
            console.error('No playable source for track:', track);
            return;
        }
        
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
    
    async playYouTubeTrack(track) {
        // For YouTube tracks, we'll embed a hidden YouTube player
        // This maintains compliance with YouTube's Terms of Service
        
        if (!this.youtubePlayer) {
            this.createYouTubePlayer();
        }
        
        if (this.youtubePlayer && this.youtubePlayer.loadVideoById) {
            this.youtubePlayer.loadVideoById(track.videoId);
            this.isPlaying = true;
            this.updatePlayerControls();
            this.updateMusicButton();
        } else {
            // Fallback: open YouTube link in new tab (not ideal for continuous play)
            console.log('Opening YouTube video:', `https://www.youtube.com/watch?v=${track.videoId}`);
            // window.open(`https://www.youtube.com/watch?v=${track.videoId}`, '_blank');
        }
    }
    
    createYouTubePlayer() {
        // Create hidden YouTube player container
        if (document.getElementById('youtube-player-container')) {
            return;
        }
        
        const container = document.createElement('div');
        container.id = 'youtube-player-container';
        container.style.cssText = 'position: fixed; top: -200px; left: -200px; width: 150px; height: 150px; pointer-events: none; opacity: 0.01;';
        document.body.appendChild(container);
        
        const playerDiv = document.createElement('div');
        playerDiv.id = 'youtube-player';
        container.appendChild(playerDiv);
        
        if (window.YT && window.YT.Player) {
            this.youtubePlayer = new window.YT.Player('youtube-player', {
                height: '150',
                width: '150',
                videoId: '',
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0
                },
                events: {
                    onReady: (event) => {
                        console.log('YouTube player ready');
                    },
                    onStateChange: (event) => {
                        this.onYouTubeStateChange(event);
                    }
                }
            });
        }
    }
    
    onYouTubeStateChange(event) {
        // YouTube player state constants
        const states = {
            UNSTARTED: -1,
            ENDED: 0,
            PLAYING: 1,
            PAUSED: 2,
            BUFFERING: 3,
            CUED: 5
        };
        
        switch (event.data) {
            case states.PLAYING:
                this.isPlaying = true;
                this.updatePlayerControls();
                this.updateMusicButton();
                break;
            case states.PAUSED:
                this.isPlaying = false;
                this.updatePlayerControls();
                this.updateMusicButton();
                break;
            case states.ENDED:
                this.handleTrackEnd();
                break;
        }
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
    
    async searchMusic(query) {
        this.searchQuery = query.toLowerCase();
        
        // Search local library
        this.filteredMusic = this.musicLibrary.filter(track => 
            track.title.toLowerCase().includes(this.searchQuery) ||
            track.artist.toLowerCase().includes(this.searchQuery) ||
            track.genre.toLowerCase().includes(this.searchQuery)
        );
        
        // If search query is not empty, also search YouTube
        if (query.trim()) {
            try {
                const youtubeResults = await this.searchYouTube(query, 5);
                this.youtubeSearchResults = youtubeResults;
                
                // Add YouTube results to filtered music
                this.filteredMusic = [...this.filteredMusic, ...youtubeResults];
            } catch (error) {
                console.error('YouTube search failed:', error);
            }
        } else {
            this.youtubeSearchResults = [];
        }
        
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
            case 'youtube':
                this.renderYouTubeResults();
                break;
            case 'playlists':
                this.renderPlaylists();
                break;
            case 'queue':
                this.renderQueue();
                break;
        }
    }
    
    renderYouTubeResults() {
        const container = document.getElementById('youtubeList');
        
        if (this.youtubeSearchResults.length === 0) {
            container.innerHTML = `
                <div class="no-music">
                    <div class="no-music-icon">🔍</div>
                    <p>Search for music on YouTube</p>
                    <small>Enter a search term to find YouTube music videos</small>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.youtubeSearchResults.map(track => `
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
                const trackId = item.dataset.trackId;
                const track = this.youtubeSearchResults.find(t => t.id === trackId);
                this.playTrack(track);
                this.renderYouTubeResults(); // Re-render to update playing state
            });
        });
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
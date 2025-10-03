// Enhanced Music Player with Advanced Features
class MusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.isMinimized = false;
    this.isPlaying = false;
    this.currentTrack = null;
    this.currentIndex = 0;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 1;
    this.isMuted = false;
    this.activeTab = 'player';
    this.searchQuery = '';
    this.searchResults = [];
    this.isSearching = false;
    this.playlists = {};
    this.currentPlaylist = null;
    this.linkInput = '';
    this.currentEmbed = null;
    
    // API Configuration
    this.SPOTIFY_CLIENT_ID = "836517f7831341f3a342af90f5c1390e";
    this.SPOTIFY_CLIENT_SECRET = "07f314daeaad4525bbad0cbe3901487a";
    this.YOUTUBE_API_KEY = "AIzaSyAtTsnqvnVajLBFyP69xqcD2EJC7h9nV1Q";
    
    this.init();
  }

  init() {
    this.loadPlaylists();
    this.checkAuthCallback();
    this.setupEventListeners();
    this.setupAudioEventListeners();
    this.updateDisplay();
  }

  loadPlaylists() {
    const saved = localStorage.getItem('playlists');
    this.playlists = saved ? JSON.parse(saved) : {};
    
    if (Object.keys(this.playlists).length === 0) {
      this.playlists['My Playlist'] = [];
    }
    
    this.currentPlaylist = Object.keys(this.playlists)[0];
    this.savePlaylists();
  }

  savePlaylists() {
    if (Object.keys(this.playlists).length > 0) {
      localStorage.setItem('playlists', JSON.stringify(this.playlists));
    }
  }

  checkAuthCallback() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    if (params.get('access_token')) {
      localStorage.setItem('spotify_token', params.get('access_token'));
      window.location.hash = '';
      this.showNotification('Spotify login successful! You can now search Spotify tracks.');
    }
  }

  setupEventListeners() {
    // Minimize/maximize
    const minimizeBtn = document.getElementById('minimize-btn');
    const expandBtn = document.getElementById('expand-btn');
    const minimizedView = document.getElementById('minimized-view');
    
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        this.toggleMinimize();
      });
    }
    
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        this.toggleMinimize();
      });
    }
    
    if (minimizedView) {
      minimizedView.addEventListener('click', (e) => {
        // Don't expand if clicking on control buttons
        if (!e.target.closest('button')) {
          this.toggleMinimize();
        }
      });
    }

    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.setActiveTab(e.target.dataset.view);
      });
    });

    // Player controls
    document.getElementById('play-pause-btn')?.addEventListener('click', () => {
      this.handlePlayPause();
    });
    
    document.getElementById('prev-btn')?.addEventListener('click', () => {
      this.handlePrevious();
    });
    
    document.getElementById('next-btn')?.addEventListener('click', () => {
      this.handleNext();
    });

    // Minimized controls
    document.getElementById('minimized-play-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handlePlayPause();
    });
    
    document.getElementById('minimized-prev-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handlePrevious();
    });
    
    document.getElementById('minimized-next-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleNext();
    });

    // Volume control
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        this.setVolume(e.target.value / 100);
      });
    }

    // Progress control
    const progressSlider = document.getElementById('progress-slider');
    if (progressSlider) {
      progressSlider.addEventListener('input', (e) => {
        this.handleSeek(e);
      });
    }

    // Search functionality
    document.getElementById('search-btn')?.addEventListener('click', () => {
      this.searchMusic();
    });
    
    document.getElementById('search-input')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchMusic();
    });

    // Playlist management
    document.getElementById('create-playlist-btn')?.addEventListener('click', () => {
      this.createPlaylist();
    });

    const playlistSelector = document.getElementById('playlist-selector');
    if (playlistSelector) {
      playlistSelector.addEventListener('change', (e) => {
        this.currentPlaylist = e.target.value;
        this.currentIndex = 0;
        this.updateDisplay();
      });
    }

    // File upload
    const fileInput = document.getElementById('audio-upload');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        this.handleFileUpload(e);
      });
    }

    // Link input
    const linkInput = document.getElementById('link-input');
    if (linkInput) {
      linkInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.addLink();
      });
    }
  }

  setupAudioEventListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.handleTimeUpdate();
    });
    
    this.audio.addEventListener('ended', () => {
      this.handleTrackEnd();
    });
    
    this.audio.addEventListener('loadedmetadata', () => {
      this.handleTimeUpdate();
    });
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  cleanupEmbed() {
    this.currentEmbed = null;
    const embedContainer = document.getElementById('embed-container');
    if (embedContainer) {
      embedContainer.innerHTML = '';
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }
  }

  playTrack(index = this.currentIndex) {
    if (!this.currentPlaylist || !this.playlists[this.currentPlaylist] || this.playlists[this.currentPlaylist].length === 0) {
      return;
    }

    const track = this.playlists[this.currentPlaylist][index];
    this.currentTrack = track;
    this.currentIndex = index;
    this.cleanupEmbed();

    if (track.type === 'local') {
      if (this.audio) {
        this.audio.src = track.url;
        this.audio.play().catch(e => console.log('Audio play failed:', e));
        this.isPlaying = true;
      }
    } else {
      // Handle embeds for streaming services
      this.currentEmbed = track;
      this.isPlaying = true;
      this.displayEmbed(track);
    }
    
    this.updateDisplay();
  }

  displayEmbed(track) {
    const embedContainer = document.getElementById('embed-container') || this.createEmbedContainer();
    let embedHtml = '';
    
    if (track.type === 'youtube') {
      const vidId = track.url.split('v=')[1]?.split('&')[0] || track.url.split('/').pop();
      embedHtml = `<iframe width="100%" height="80" src="https://www.youtube.com/embed/${vidId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" title="YouTube player"></iframe>`;
    } else if (track.type === 'spotify') {
      const spotifyId = track.url.split('spotify.com/')[1];
      embedHtml = `<iframe src="https://open.spotify.com/embed/${spotifyId}" width="100%" height="80" frameborder="0" allow="autoplay; encrypted-media" title="Spotify player"></iframe>`;
    } else if (track.type === 'apple') {
      embedHtml = `<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="80" style="width: 100%; overflow: hidden; background: transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="${track.url}" title="Apple Music player"></iframe>`;
    }
    
    embedContainer.innerHTML = embedHtml;
  }

  createEmbedContainer() {
    const container = document.createElement('div');
    container.id = 'embed-container';
    container.className = 'embed-container';
    const playerView = document.getElementById('player-view');
    if (playerView) {
      playerView.appendChild(container);
    }
    return container;
  }

  handlePlayPause() {
    if (this.currentEmbed) {
      // Embeds handle their own playback
      return;
    }

    if (!this.currentTrack && this.currentPlaylist && this.playlists[this.currentPlaylist]?.length > 0) {
      this.playTrack(0);
      return;
    }
    
    if (this.audio) {
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        this.audio.play().catch(e => console.log('Audio play failed:', e));
      }
      this.isPlaying = !this.isPlaying;
      this.updateDisplay();
    }
  }

  handlePrevious() {
    if (!this.currentPlaylist || !this.playlists[this.currentPlaylist]) return;
    const list = this.playlists[this.currentPlaylist];
    if (list.length === 0) return;
    const newIndex = (this.currentIndex - 1 + list.length) % list.length;
    this.playTrack(newIndex);
  }

  handleNext() {
    if (!this.currentPlaylist || !this.playlists[this.currentPlaylist]) return;
    const list = this.playlists[this.currentPlaylist];
    if (list.length === 0) return;
    const newIndex = (this.currentIndex + 1) % list.length;
    this.playTrack(newIndex);
  }

  handleSeek(e) {
    if (this.audio && this.duration) {
      const seekTime = (e.target.value / 100) * this.duration;
      this.audio.currentTime = seekTime;
      this.currentTime = seekTime;
    }
  }

  handleTimeUpdate() {
    if (this.audio) {
      this.currentTime = this.audio.currentTime;
      this.duration = this.audio.duration;
      this.updateProgressDisplay();
    }
  }

  updateProgressDisplay() {
    const progressSlider = document.getElementById('progress-slider');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const progressSection = document.getElementById('progress-section');
    
    if (this.currentTrack && !this.currentEmbed) {
      // Show progress for local files only
      if (progressSection) progressSection.style.display = 'block';
      
      if (progressSlider && this.duration) {
        progressSlider.value = (this.currentTime / this.duration) * 100;
      }
      
      if (currentTimeDisplay) {
        currentTimeDisplay.textContent = this.formatTime(this.currentTime);
      }
      
      if (totalTimeDisplay) {
        totalTimeDisplay.textContent = this.formatTime(this.duration);
      }
    } else {
      // Hide progress for streams
      if (progressSection) progressSection.style.display = 'none';
    }
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    const player = document.getElementById('music-player');
    const playerContent = document.getElementById('player-content');
    const minimizedView = document.getElementById('minimized-view');
    const musicHeader = document.querySelector('.music-header');
    
    if (this.isMinimized) {
      player.classList.add('minimized');
      if (playerContent) playerContent.style.display = 'none';
      if (musicHeader) musicHeader.style.display = 'none';
      if (minimizedView) minimizedView.classList.remove('hidden');
    } else {
      player.classList.remove('minimized');
      if (playerContent) playerContent.style.display = 'block';
      if (musicHeader) musicHeader.style.display = 'flex';
      if (minimizedView) minimizedView.classList.add('hidden');
    }
    
    this.updateDisplay();
  }

  handleTrackEnd() {
    this.handleNext();
  }

  setVolume(volume) {
    this.volume = volume;
    this.isMuted = false;
    if (this.audio) {
      this.audio.volume = volume;
    }
    this.updateVolumeDisplay();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    this.updateVolumeDisplay();
  }

  async searchMusic() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    this.searchQuery = searchInput.value.trim();
    if (!this.searchQuery) return;

    this.isSearching = true;
    this.searchResults = [];
    this.updateSearchDisplay();

    let results = [];

    // Spotify Search
    try {
      const spotifyToken = localStorage.getItem('spotify_token');
      if (spotifyToken) {
        const res = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(this.searchQuery)}&type=track&limit=5`,
          { headers: { Authorization: `Bearer ${spotifyToken}` } }
        );
        if (res.ok) {
          const data = await res.json();
          results.push(...data.tracks.items.map(t => ({
            name: `${t.name} - ${t.artists[0].name}`,
            url: t.external_urls.spotify,
            type: 'spotify',
            platform: '🎵 Spotify'
          })));
        }
      }
    } catch (err) {
      console.warn('Spotify search failed:', err);
    }

    // YouTube Search
    try {
      const ytRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(this.searchQuery + ' music')}&key=${this.YOUTUBE_API_KEY}`
      );
      if (ytRes.ok) {
        const ytData = await ytRes.json();
        results.push(...ytData.items.map(v => ({
          name: v.snippet.title.replace(/[^\w\s-]/g, '').substring(0, 50),
          url: `https://www.youtube.com/watch?v=${v.id.videoId}`,
          type: 'youtube',
          platform: '📺 YouTube'
        })));
      }
    } catch (err) {
      console.warn('YouTube search failed:', err);
    }

    // Demo results if no API results
    if (results.length === 0) {
      results = [
        { name: `"${this.searchQuery}" - Sample Track 1`, url: '#', type: 'demo', platform: '🎵 Demo' },
        { name: `"${this.searchQuery}" - Sample Track 2`, url: '#', type: 'demo', platform: '📺 Demo' },
        { name: `"${this.searchQuery}" - Sample Track 3`, url: '#', type: 'demo', platform: '🎵 Demo' }
      ];
    }

    this.searchResults = results;
    this.isSearching = false;
    this.updateSearchDisplay();
  }

  addSearchResult(result) {
    if (result.url === '#') {
      this.showNotification('This is a demo result. Add your API keys to enable real search!');
      return;
    }
    this.addToPlaylist(result.url, result.type, result.name);
    this.searchResults = [];
    this.searchQuery = '';
    this.updateSearchDisplay();
  }

  handleFileUpload(e) {
    if (!this.currentPlaylist) {
      this.showNotification('Please select a playlist first!');
      return;
    }

    const files = Array.from(e.target.files);
    const newTracks = files.map(file => ({
      name: file.name,
      type: 'local',
      url: URL.createObjectURL(file)
    }));

    this.playlists[this.currentPlaylist] = [...(this.playlists[this.currentPlaylist] || []), ...newTracks];
    this.savePlaylists();

    const newIndex = (this.playlists[this.currentPlaylist]?.length || 0) - newTracks.length;
    setTimeout(() => this.playTrack(newIndex), 100);
    this.updateDisplay();
  }

  addToPlaylist(url, type, name) {
    if (!this.currentPlaylist) {
      this.showNotification('Please select a playlist first!');
      return;
    }

    const newTrack = { name, type, url };
    this.playlists[this.currentPlaylist] = [...(this.playlists[this.currentPlaylist] || []), newTrack];
    this.savePlaylists();

    const newIndex = (this.playlists[this.currentPlaylist]?.length || 0) - 1;
    setTimeout(() => this.playTrack(newIndex), 100);
    this.updateDisplay();
  }

  createPlaylist() {
    const name = prompt('Enter playlist name:');
    if (!name || this.playlists[name]) {
      if (this.playlists[name]) this.showNotification('Playlist name already exists!');
      return;
    }

    this.playlists[name] = [];
    this.currentPlaylist = name;
    this.savePlaylists();
    this.updateDisplay();
  }

  removeFromPlaylist(trackIndex) {
    if (!this.currentPlaylist) return;
    
    this.playlists[this.currentPlaylist] = this.playlists[this.currentPlaylist].filter((_, i) => i !== trackIndex);
    this.savePlaylists();

    if (this.currentIndex === trackIndex) {
      this.cleanupEmbed();
      this.currentTrack = null;
      this.isPlaying = false;
    } else if (this.currentIndex > trackIndex) {
      this.currentIndex = this.currentIndex - 1;
    }
    
    this.updateDisplay();
  }

  loginSpotify() {
    const redirectUri = encodeURIComponent(window.location.origin);
    const scope = encodeURIComponent('user-read-private user-read-email playlist-read-private');
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${this.SPOTIFY_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
  }

  addLink() {
    const linkInput = document.getElementById('link-input');
    if (!linkInput) return;
    
    if (!this.currentPlaylist) {
      this.showNotification('Please select a playlist first!');
      return;
    }

    const url = linkInput.value.trim();
    if (!url) return;

    let type = 'link';
    let name = url;
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      type = 'youtube';
      name = 'YouTube Video';
    } else if (url.includes('spotify.com')) {
      type = 'spotify';
      name = 'Spotify Track';
    } else if (url.includes('music.apple.com')) {
      type = 'apple';
      name = 'Apple Music Track';
    }

    this.addToPlaylist(url, type, name);
    linkInput.value = '';
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === tab);
    });
    
    // Update views
    document.querySelectorAll('.view').forEach(v => {
      v.classList.toggle('active', v.id === `${tab}-view`);
    });
    
    this.updateDisplay();
  }

  updateDisplay() {
    this.updateCurrentSongDisplay();
    this.updatePlayButtonDisplay();
    this.updateQueueDisplay();
    this.updatePlaylistDisplay();
    this.updateProgressDisplay();
    this.updateVolumeDisplay();
    this.updateMinimizedDisplay();
    this.updatePlaylistSelector();
  }

  updateCurrentSongDisplay() {
    const songTitle = document.querySelector('.song-title');
    const songArtist = document.querySelector('.song-artist');
    
    if (songTitle && songArtist) {
      if (this.currentTrack) {
        songTitle.textContent = this.currentTrack.name;
        songArtist.textContent = this.currentPlaylist || 'Unknown Playlist';
      } else {
        songTitle.textContent = 'No song playing';
        songArtist.textContent = 'Search for music to get started';
      }
    }
  }

  updateMinimizedDisplay() {
    const minimizedTitle = document.querySelector('.minimized-title');
    const minimizedArtist = document.querySelector('.minimized-artist');
    const minimizedPlayBtn = document.getElementById('minimized-play-btn');
    
    if (minimizedTitle && minimizedArtist) {
      if (this.currentTrack) {
        minimizedTitle.textContent = this.currentTrack.name;
        minimizedArtist.textContent = this.currentPlaylist || 'Unknown Playlist';
      } else {
        minimizedTitle.textContent = 'No song playing';
        minimizedArtist.textContent = 'Music Player';
      }
    }
    
    if (minimizedPlayBtn) {
      minimizedPlayBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
    }
  }

  updatePlayButtonDisplay() {
    const playBtn = document.getElementById('play-pause-btn');
    if (playBtn) {
      playBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
    }
  }

  updatePlaylistSelector() {
    const selector = document.getElementById('playlist-selector');
    if (!selector) return;
    
    selector.innerHTML = '<option value="">Select Playlist</option>';
    Object.keys(this.playlists).forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      option.selected = name === this.currentPlaylist;
      selector.appendChild(option);
    });
  }

  updateQueueDisplay() {
    const queueList = document.getElementById('queue-list');
    const queueCount = document.getElementById('queue-count');
    
    if (!queueList || !queueCount) return;
    
    const playlist = this.playlists[this.currentPlaylist] || [];
    queueCount.textContent = playlist.length;
    
    if (playlist.length === 0) {
      queueList.innerHTML = '<div class="empty-queue">No songs in queue</div>';
      return;
    }
    
    queueList.innerHTML = playlist.map((track, index) => `
      <div class="queue-item ${index === this.currentIndex ? 'current' : ''}" data-index="${index}">
        <div class="track-info">
          <div class="track-name">${track.name}</div>
          <div class="track-type">${track.type}</div>
        </div>
        <div class="queue-item-controls">
          <button class="queue-control-btn play-track-btn" title="Play">▶</button>
          <button class="queue-control-btn remove-track-btn" title="Remove">×</button>
        </div>
      </div>
    `).join('');
    
    // Add click handlers to queue items
    queueList.querySelectorAll('.queue-item').forEach((item, index) => {
      const playBtn = item.querySelector('.play-track-btn');
      const removeBtn = item.querySelector('.remove-track-btn');
      
      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.playTrack(index);
        });
      }
      
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.removeFromPlaylist(index);
        });
      }
      
      // Click on item to play
      item.addEventListener('click', () => {
        this.playTrack(index);
      });
    });
  }

  updatePlaylistDisplay() {
    const playlistsList = document.getElementById('playlists-list');
    if (!playlistsList) return;
    
    playlistsList.innerHTML = Object.keys(this.playlists).map(name => `
      <div class="playlist-item ${name === this.currentPlaylist ? 'active' : ''}" data-playlist="${name}">
        <span class="playlist-name">${name}</span>
        <span class="track-count">${this.playlists[name].length} tracks</span>
      </div>
    `).join('');
    
    // Add click handlers to playlist items
    playlistsList.querySelectorAll('.playlist-item').forEach(item => {
      item.addEventListener('click', () => {
        this.currentPlaylist = item.dataset.playlist;
        this.currentIndex = 0;
        this.updateDisplay();
      });
    });
  }

  updateSearchDisplay() {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    if (this.isSearching) {
      searchResults.innerHTML = '<div class="searching">🔍 Searching...</div>';
      return;
    }
    
    if (this.searchResults.length === 0) {
      searchResults.innerHTML = '<div class="no-results">No results found</div>';
      return;
    }
    
    searchResults.innerHTML = this.searchResults.map((result, index) => `
      <div class="search-result-item" data-index="${index}">
        <div class="result-info">
          <div class="platform">${result.platform}</div>
          <div class="track-name">${result.name}</div>
        </div>
        <button class="add-btn" onclick="musicPlayer.addSearchResult(musicPlayer.searchResults[${index}])">Add</button>
      </div>
    `).join('');
  }

  updateProgressDisplay() {
    // This would update progress bars, time displays, etc.
    // Implementation depends on your HTML structure
  }

  updateVolumeDisplay() {
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
      volumeSlider.value = this.isMuted ? 0 : this.volume * 100;
    }
  }

  showNotification(message) {
    // Simple notification - you might want to enhance this
    alert(message);
  }
}

// Initialize the music player
let musicPlayer;
document.addEventListener('DOMContentLoaded', () => {
  musicPlayer = new MusicPlayer();
});

// Legacy function support for existing HTML
function togglePlay() {
  musicPlayer?.handlePlayPause();
}

function nextTrack() {
  musicPlayer?.handleNext();
}

function prevTrack() {
  musicPlayer?.handlePrevious();
}

function searchMusic() {
  musicPlayer?.searchMusic();
}

function createPlaylist() {
  musicPlayer?.createPlaylist();
}

function loginSpotify() {
  musicPlayer?.loginSpotify();
}

function addLink() {
  musicPlayer?.addLink();
}

// Platform selector function
function selectPlatform(platform) {
  document.querySelectorAll('.platform-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`${platform}-btn`)?.classList.add('active');
}
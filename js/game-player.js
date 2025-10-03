// Universal Game Music Player
class GameMusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.volume = 0.3;
        this.currentTrack = null;
        this.isMinimized = true;
        this.tracks = [
            { name: "Chill Vibes", url: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav" },
            { name: "Game Theme", url: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav" },
            { name: "Relaxing", url: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav" }
        ];
        this.init();
    }

    init() {
        this.createPlayerHTML();
        this.setupEventListeners();
        this.audio.volume = this.volume;
        this.audio.loop = true;
    }

    createPlayerHTML() {
        const playerHTML = `
            <div id="game-music-player" class="game-music-player ${this.isMinimized ? 'minimized' : ''}">
                <div class="music-header" onclick="gameMusicPlayer.toggleMinimize()">
                    <div class="header-info">
                        <span class="music-icon">🎵</span>
                        <span class="player-title">Music Player</span>
                    </div>
                    <div class="header-controls">
                        <button class="minimize-btn">${this.isMinimized ? '+' : '−'}</button>
                    </div>
                </div>
                
                <div class="music-content">
                    <div class="current-track">
                        <div class="track-avatar">🎵</div>
                        <div class="track-info">
                            <div class="track-name">No music playing</div>
                            <div class="track-artist">Select a track below</div>
                        </div>
                    </div>
                    
                    <div class="player-controls">
                        <button class="control-btn" onclick="gameMusicPlayer.previousTrack()">⏮</button>
                        <button class="play-btn" onclick="gameMusicPlayer.togglePlay()">▶️</button>
                        <button class="control-btn" onclick="gameMusicPlayer.nextTrack()">⏭</button>
                    </div>
                    
                    <div class="volume-section">
                        <div class="volume-control">
                            <span class="volume-icon">🔊</span>
                            <input type="range" class="volume-slider" min="0" max="100" value="30" 
                                   onchange="gameMusicPlayer.setVolume(this.value)">
                            <span class="volume-value">30%</span>
                        </div>
                    </div>
                    
                    <div class="playlist-section">
                        <div class="playlist-header">Now Playing</div>
                        <div class="track-list">
                            <div class="track-item" onclick="gameMusicPlayer.playTrack(0)">
                                <div class="track-emoji">🎵</div>
                                <div class="track-details">
                                    <div class="track-title">Chill Vibes</div>
                                    <div class="track-duration">Ambient • Looping</div>
                                </div>
                                <div class="track-status"></div>
                            </div>
                            <div class="track-item" onclick="gameMusicPlayer.playTrack(1)">
                                <div class="track-emoji">🎮</div>
                                <div class="track-details">
                                    <div class="track-title">Game Theme</div>
                                    <div class="track-duration">Electronic • Looping</div>
                                </div>
                                <div class="track-status"></div>
                            </div>
                            <div class="track-item" onclick="gameMusicPlayer.playTrack(2)">
                                <div class="track-emoji">😌</div>
                                <div class="track-details">
                                    <div class="track-title">Relaxing</div>
                                    <div class="track-duration">Peaceful • Looping</div>
                                </div>
                                <div class="track-status"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .game-music-player {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    width: 350px;
                    background: #2a2d3a;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    z-index: 1000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    border: 1px solid #404555;
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                
                .game-music-player.minimized {
                    width: 200px;
                }
                
                .game-music-player.minimized .music-content {
                    display: none;
                }
                
                .music-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    cursor: pointer;
                    user-select: none;
                    border-radius: 20px 20px 0 0;
                }
                
                .header-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .music-icon {
                    font-size: 1.4rem;
                }
                
                .player-title {
                    font-weight: 600;
                    font-size: 1rem;
                }
                
                .minimize-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 6px;
                    transition: all 0.2s;
                    font-weight: bold;
                }
                
                .minimize-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: scale(1.1);
                }
                
                .music-content {
                    padding: 20px;
                    color: white;
                }
                
                .current-track {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                    padding: 15px;
                    background: #363950;
                    border-radius: 12px;
                }
                
                .track-avatar {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }
                
                .track-info {
                    flex: 1;
                }
                
                .track-name {
                    font-weight: 600;
                    font-size: 1rem;
                    margin-bottom: 4px;
                }
                
                .track-artist {
                    font-size: 0.85rem;
                    color: #a0a3bd;
                }
                
                .player-controls {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .control-btn, .play-btn {
                    background: #404555;
                    border: none;
                    color: white;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                
                .play-btn {
                    width: 54px;
                    height: 54px;
                    font-size: 1.3rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                
                .control-btn:hover {
                    background: #4a4f67;
                    transform: scale(1.1);
                }
                
                .play-btn:hover {
                    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                    transform: scale(1.1);
                }
                
                .volume-section {
                    margin-bottom: 20px;
                }
                
                .volume-control {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 15px;
                    background: #363950;
                    border-radius: 10px;
                }
                
                .volume-icon {
                    font-size: 1.1rem;
                    color: #a0a3bd;
                }
                
                .volume-slider {
                    flex: 1;
                    height: 4px;
                    border-radius: 2px;
                    background: #4a4f67;
                    outline: none;
                    -webkit-appearance: none;
                }
                
                .volume-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #667eea;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .volume-slider::-webkit-slider-thumb:hover {
                    background: #764ba2;
                    transform: scale(1.2);
                }
                
                .volume-value {
                    font-size: 0.85rem;
                    color: #a0a3bd;
                    min-width: 35px;
                    text-align: right;
                }
                
                .playlist-section {
                    border-top: 1px solid #404555;
                    padding-top: 16px;
                }
                
                .playlist-header {
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: #a0a3bd;
                    margin-bottom: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .track-list {
                    max-height: 180px;
                    overflow-y: auto;
                    scrollbar-width: thin;
                    scrollbar-color: #667eea #363950;
                }
                
                .track-list::-webkit-scrollbar {
                    width: 6px;
                }
                
                .track-list::-webkit-scrollbar-track {
                    background: #363950;
                    border-radius: 3px;
                }
                
                .track-list::-webkit-scrollbar-thumb {
                    background: #667eea;
                    border-radius: 3px;
                }
                
                .track-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 4px;
                }
                
                .track-item:hover {
                    background: #404555;
                }
                
                .track-item.active {
                    background: rgba(102, 126, 234, 0.2);
                    border: 1px solid rgba(102, 126, 234, 0.3);
                }
                
                .track-emoji {
                    width: 36px;
                    height: 36px;
                    background: #404555;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }
                
                .track-item.active .track-emoji {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                
                .track-details {
                    flex: 1;
                }
                
                .track-title {
                    font-weight: 500;
                    font-size: 0.9rem;
                    margin-bottom: 2px;
                }
                
                .track-item.active .track-title {
                    color: #667eea;
                }
                
                .track-duration {
                    font-size: 0.8rem;
                    color: #a0a3bd;
                }
                
                .track-status {
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .track-item.active .track-status::before {
                    content: '🎵';
                    font-size: 0.8rem;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                @media (max-width: 768px) {
                    .game-music-player {
                        width: 300px;
                        bottom: 10px;
                        left: 10px;
                    }
                    
                    .game-music-player.minimized {
                        width: 180px;
                    }
                    
                    .music-content {
                        padding: 16px;
                    }
                    
                    .current-track {
                        padding: 12px;
                    }
                    
                    .track-avatar {
                        width: 40px;
                        height: 40px;
                        font-size: 1.2rem;
                    }
                    
                    .control-btn, .play-btn {
                        width: 40px;
                        height: 40px;
                        font-size: 1rem;
                    }
                    
                    .play-btn {
                        width: 48px;
                        height: 48px;
                        font-size: 1.2rem;
                    }
                }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', playerHTML);
    }

    setupEventListeners() {
        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });

        this.audio.addEventListener('loadstart', () => {
            this.updateTrackDisplay();
        });

        this.audio.addEventListener('error', () => {
            console.log('Error loading audio, trying next track...');
            this.nextTrack();
        });
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        const player = document.getElementById('game-music-player');
        const minimizeBtn = player.querySelector('.minimize-btn');
        
        if (this.isMinimized) {
            player.classList.add('minimized');
            minimizeBtn.textContent = '+';
        } else {
            player.classList.remove('minimized');
            minimizeBtn.textContent = '−';
        }
    }

    setVolume(value) {
        this.volume = value / 100;
        this.audio.volume = this.volume;
        
        // Update volume display
        const volumeValue = document.querySelector('.volume-value');
        if (volumeValue) {
            volumeValue.textContent = value + '%';
        }
        
        if (this.audioContext) {
            const gainNodes = this.audioContext.destination;
            // Update volume for generated tones
        }
    }

    updateTrackDisplay() {
        const trackNameEl = document.querySelector('.track-name');
        const trackArtistEl = document.querySelector('.track-artist');
        
        if (this.currentTrack !== null) {
            trackNameEl.textContent = this.tracks[this.currentTrack].name;
            trackArtistEl.textContent = 'Now Playing';
        } else {
            trackNameEl.textContent = 'No music playing';
            trackArtistEl.textContent = 'Select a track below';
        }
    }

    updateActiveTrack() {
        document.querySelectorAll('.track-item').forEach((item, index) => {
            if (index === this.currentTrack) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    togglePlay() {
        const playBtn = document.querySelector('.play-btn');
        
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            playBtn.textContent = '▶️';
        } else {
            if (!this.currentTrack) {
                this.playTrack(0);
            } else {
                this.audio.play().catch(e => console.log('Playback failed:', e));
                this.isPlaying = true;
                playBtn.textContent = '⏸️';
            }
        }
    }

    playTrack(index) {
        if (index >= 0 && index < this.tracks.length) {
            this.currentTrack = index;
            this.audio.src = this.tracks[index].url;
            this.audio.load();
            
            // Instead of actual audio files, we'll use Web Audio API to generate simple tones
            this.playGeneratedTone(index);
            
            this.updateTrackDisplay();
            this.updateActiveTrack();
        }
    }

    playGeneratedTone(trackIndex) {
        // Create a simple background tone using Web Audio API
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Different tones for different tracks
            const frequencies = [220, 330, 440]; // A3, E4, A4
            oscillator.frequency.setValueAtTime(frequencies[trackIndex] || 220, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime); // Very quiet
            
            oscillator.start();
            
            // Stop after 2 seconds and loop
            setTimeout(() => {
                if (this.isPlaying && this.currentTrack === trackIndex) {
                    this.playGeneratedTone(trackIndex);
                }
            }, 2000);
            
            this.isPlaying = true;
            document.querySelector('.play-btn').textContent = '⏸️';
            
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    previousTrack() {
        const newIndex = this.currentTrack > 0 ? this.currentTrack - 1 : this.tracks.length - 1;
        this.playTrack(newIndex);
    }

    nextTrack() {
        const newIndex = this.currentTrack < this.tracks.length - 1 ? this.currentTrack + 1 : 0;
        this.playTrack(newIndex);
    }
}

// Initialize the music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gameMusicPlayer = new GameMusicPlayer();
});

// Add to leaderboard function
function addToLeaderboard(game, playerName, score, gameData = {}) {
    try {
        // Try to open parent window's leaderboard function
        if (window.parent && window.parent.addToLeaderboard) {
            window.parent.addToLeaderboard(game, playerName, score, gameData);
        } else {
            // Store locally and sync later
            const scores = JSON.parse(localStorage.getItem('gameScores') || '{}');
            if (!scores[game]) scores[game] = [];
            
            scores[game].push({
                player: playerName,
                score: score,
                date: new Date().toISOString(),
                ...gameData
            });
            
            // Keep only top 10
            scores[game].sort((a, b) => b.score - a.score);
            scores[game] = scores[game].slice(0, 10);
            
            localStorage.setItem('gameScores', JSON.stringify(scores));
            
            // Show notification
            showScoreNotification(game, playerName, score);
        }
    } catch (e) {
        console.log('Could not save to leaderboard:', e);
    }
}

function showScoreNotification(game, playerName, score) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">🏆 Score Recorded!</div>
        <div>${playerName}: ${score.toLocaleString()} in ${game}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}
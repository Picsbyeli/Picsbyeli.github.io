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
            <!-- Music Player Toggle Button -->
            <div id="music-toggle" class="music-toggle" onclick="gameMusicPlayer.togglePlayer()">
                <div class="toggle-icon">🎵</div>
                <div class="toggle-text">Music</div>
            </div>

            <!-- Music Player Popup -->
            <div id="music-popup" class="music-popup hidden">
                <div class="popup-overlay" onclick="gameMusicPlayer.closePlayer()"></div>
                <div class="popup-content">
                    <div class="popup-header">
                        <h3>🎵 Game Music Player</h3>
                        <button class="close-btn" onclick="gameMusicPlayer.closePlayer()">×</button>
                    </div>
                    
                    <div class="player-section">
                        <div class="now-playing">
                            <div class="track-cover">🎵</div>
                            <div class="track-info">
                                <div class="track-title">No track selected</div>
                                <div class="track-artist">Choose a track below</div>
                            </div>
                            <div class="play-status"></div>
                        </div>
                        
                        <div class="player-controls">
                            <button class="control-btn" onclick="gameMusicPlayer.previousTrack()">⏮️</button>
                            <button class="play-btn" onclick="gameMusicPlayer.togglePlay()">
                                <span class="play-icon">▶️</span>
                            </button>
                            <button class="control-btn" onclick="gameMusicPlayer.nextTrack()">⏭️</button>
                        </div>
                        
                        <div class="volume-section">
                            <span class="volume-label">🔊</span>
                            <input type="range" class="volume-slider" min="0" max="100" value="30" 
                                   onchange="gameMusicPlayer.setVolume(this.value)">
                            <span class="volume-display">30%</span>
                        </div>
                    </div>
                    
                    <div class="tracks-section">
                        <h4>Available Tracks</h4>
                        <div class="tracks-grid">
                            <div class="track-card" onclick="gameMusicPlayer.playTrack(0)">
                                <div class="track-emoji">🎵</div>
                                <div class="track-name">Chill Vibes</div>
                                <div class="track-genre">Ambient</div>
                            </div>
                            <div class="track-card" onclick="gameMusicPlayer.playTrack(1)">
                                <div class="track-emoji">🎮</div>
                                <div class="track-name">Game Theme</div>
                                <div class="track-genre">Electronic</div>
                            </div>
                            <div class="track-card" onclick="gameMusicPlayer.playTrack(2)">
                                <div class="track-emoji">😌</div>
                                <div class="track-name">Relaxing</div>
                                <div class="track-genre">Peaceful</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .music-toggle {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                    z-index: 1001;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    user-select: none;
                }
                
                .music-toggle:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }
                
                .toggle-icon {
                    font-size: 1.2rem;
                    animation: bounce 2s infinite;
                }
                
                .toggle-text {
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-3px); }
                    60% { transform: translateY(-2px); }
                }
                
                .music-popup {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                .music-popup.hidden {
                    opacity: 0;
                    pointer-events: none;
                }
                
                .popup-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                }
                
                .popup-content {
                    background: #1a1a2e;
                    border-radius: 20px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    border: 1px solid #2d2d44;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: white;
                }
                
                .popup-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 25px;
                    border-bottom: 1px solid #2d2d44;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 20px 20px 0 0;
                }
                
                .popup-header h3 {
                    margin: 0;
                    font-size: 1.3rem;
                    font-weight: 600;
                }
                
                .close-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                
                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }
                
                .player-section {
                    padding: 25px;
                    border-bottom: 1px solid #2d2d44;
                }
                
                .now-playing {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 25px;
                    padding: 15px;
                    background: #252541;
                    border-radius: 12px;
                }
                
                .track-cover {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                }
                
                .track-info {
                    flex: 1;
                }
                
                .track-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                
                .track-artist {
                    font-size: 0.9rem;
                    color: #a0a3bd;
                }
                
                .play-status {
                    font-size: 1.5rem;
                }
                
                .player-controls {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 25px;
                }
                
                .control-btn, .play-btn {
                    background: #2d2d44;
                    border: none;
                    color: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    font-size: 1.2rem;
                }
                
                .play-btn {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-size: 1.4rem;
                }
                
                .control-btn:hover {
                    background: #404062;
                    transform: scale(1.1);
                }
                
                .play-btn:hover {
                    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                    transform: scale(1.1);
                }
                
                .volume-section {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    background: #252541;
                    border-radius: 10px;
                }
                
                .volume-label {
                    font-size: 1.2rem;
                    color: #a0a3bd;
                }
                
                .volume-slider {
                    flex: 1;
                    height: 6px;
                    background: #404062;
                    border-radius: 3px;
                    outline: none;
                    -webkit-appearance: none;
                }
                
                .volume-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    background: #667eea;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .volume-slider::-webkit-slider-thumb:hover {
                    background: #764ba2;
                    transform: scale(1.2);
                }
                
                .volume-display {
                    font-size: 0.9rem;
                    color: #a0a3bd;
                    min-width: 40px;
                    text-align: right;
                }
                
                .tracks-section {
                    padding: 25px;
                }
                
                .tracks-section h4 {
                    margin: 0 0 20px 0;
                    font-size: 1.1rem;
                    color: #a0a3bd;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .tracks-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 15px;
                }
                
                .track-card {
                    background: #252541;
                    border-radius: 12px;
                    padding: 20px 15px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }
                
                .track-card:hover {
                    background: #2d2d50;
                    border-color: #667eea;
                    transform: translateY(-2px);
                }
                
                .track-card.active {
                    background: rgba(102, 126, 234, 0.2);
                    border-color: #667eea;
                }
                
                .track-emoji {
                    font-size: 2rem;
                    margin-bottom: 10px;
                }
                
                .track-name {
                    font-size: 0.95rem;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                
                .track-genre {
                    font-size: 0.8rem;
                    color: #a0a3bd;
                }
                
                @media (max-width: 768px) {
                    .music-toggle {
                        top: 15px;
                        right: 15px;
                        padding: 10px 16px;
                    }
                    
                    .popup-content {
                        width: 95%;
                        margin: 10px;
                    }
                    
                    .popup-header {
                        padding: 15px 20px;
                    }
                    
                    .player-section, .tracks-section {
                        padding: 20px;
                    }
                    
                    .tracks-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .control-btn, .play-btn {
                        width: 45px;
                        height: 45px;
                    }
                    
                    .play-btn {
                        width: 55px;
                        height: 55px;
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

    togglePlayer() {
        const popup = document.getElementById('music-popup');
        if (popup) {
            popup.classList.toggle('hidden');
        }
    }

    closePlayer() {
        const popup = document.getElementById('music-popup');
        if (popup) {
            popup.classList.add('hidden');
        }
    }

    toggleMinimize() {
        // Legacy method - now just toggles player
        this.togglePlayer();
    }

    setVolume(value) {
        this.volume = value / 100;
        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
        
        const volumeDisplay = document.querySelector('.volume-display');
        if (volumeDisplay) {
            volumeDisplay.textContent = `${value}%`;
        }
    }

    updatePlayerDisplay() {
        const currentTrack = this.tracks[this.currentTrack];
        
        // Update now playing section
        const trackTitle = document.querySelector('.track-title');
        const trackArtist = document.querySelector('.track-artist');
        const playStatus = document.querySelector('.play-status');
        
        if (trackTitle && trackArtist && playStatus) {
            if (currentTrack) {
                trackTitle.textContent = currentTrack.name;
                trackArtist.textContent = currentTrack.genre;
                playStatus.textContent = this.isPlaying ? '🎵' : '⏸️';
            } else {
                trackTitle.textContent = 'No track selected';
                trackArtist.textContent = 'Choose a track below';
                playStatus.textContent = '';
            }
        }
        
        // Update play button
        const playBtn = document.querySelector('.play-btn .play-icon');
        if (playBtn) {
            playBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
        }
        
        // Update track cards
        const trackCards = document.querySelectorAll('.track-card');
        trackCards.forEach((card, index) => {
            card.classList.toggle('active', index === this.currentTrack);
        });
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
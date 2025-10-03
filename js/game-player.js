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
                        <span class="player-title">Music</span>
                    </div>
                    <div class="header-controls">
                        <button class="minimize-btn">−</button>
                    </div>
                </div>
                
                <div class="music-content">
                    <div class="current-track">
                        <div class="track-info">
                            <div class="track-name">No music playing</div>
                        </div>
                    </div>
                    
                    <div class="player-controls">
                        <button class="control-btn" onclick="gameMusicPlayer.previousTrack()">⏮</button>
                        <button class="play-btn" onclick="gameMusicPlayer.togglePlay()">▶️</button>
                        <button class="control-btn" onclick="gameMusicPlayer.nextTrack()">⏭</button>
                    </div>
                    
                    <div class="volume-control">
                        <span class="volume-icon">🔊</span>
                        <input type="range" class="volume-slider" min="0" max="100" value="30" 
                               onchange="gameMusicPlayer.setVolume(this.value)">
                    </div>
                    
                    <div class="track-list">
                        <div class="track-item" onclick="gameMusicPlayer.playTrack(0)">🎵 Chill Vibes</div>
                        <div class="track-item" onclick="gameMusicPlayer.playTrack(1)">🎮 Game Theme</div>
                        <div class="track-item" onclick="gameMusicPlayer.playTrack(2)">😌 Relaxing</div>
                    </div>
                </div>
            </div>
            
            <style>
                .game-music-player {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 300px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    z-index: 1000;
                    font-family: Arial, sans-serif;
                    border: 2px solid #667eea;
                    transition: all 0.3s ease;
                }
                
                .game-music-player.minimized .music-content {
                    display: none;
                }
                
                .music-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 15px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 13px 13px 0 0;
                    cursor: pointer;
                    user-select: none;
                }
                
                .header-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .music-icon {
                    font-size: 1.2rem;
                }
                
                .player-title {
                    font-weight: bold;
                    font-size: 0.9rem;
                }
                
                .minimize-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 2px 6px;
                    border-radius: 3px;
                    transition: background 0.2s;
                }
                
                .minimize-btn:hover {
                    background: rgba(255,255,255,0.2);
                }
                
                .music-content {
                    padding: 15px;
                }
                
                .current-track {
                    text-align: center;
                    margin-bottom: 15px;
                }
                
                .track-name {
                    font-weight: bold;
                    color: #333;
                    font-size: 0.9rem;
                }
                
                .player-controls {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                
                .control-btn, .play-btn {
                    background: #667eea;
                    border: none;
                    color: white;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                
                .play-btn {
                    width: 45px;
                    height: 45px;
                    font-size: 1.2rem;
                }
                
                .control-btn:hover, .play-btn:hover {
                    background: #764ba2;
                    transform: scale(1.1);
                }
                
                .volume-control {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                
                .volume-icon {
                    font-size: 1rem;
                }
                
                .volume-slider {
                    flex: 1;
                    height: 6px;
                    border-radius: 3px;
                    background: #e1e5e9;
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
                }
                
                .track-list {
                    max-height: 120px;
                    overflow-y: auto;
                }
                
                .track-item {
                    padding: 8px 12px;
                    background: #f8f9fa;
                    margin: 5px 0;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }
                
                .track-item:hover {
                    background: #e1e5e9;
                    border-color: #667eea;
                }
                
                .track-item.active {
                    background: #667eea;
                    color: white;
                }
                
                @media (max-width: 768px) {
                    .game-music-player {
                        width: 250px;
                        bottom: 10px;
                        right: 10px;
                    }
                    
                    .music-content {
                        padding: 12px;
                    }
                    
                    .control-btn, .play-btn {
                        width: 30px;
                        height: 30px;
                        font-size: 0.9rem;
                    }
                    
                    .play-btn {
                        width: 40px;
                        height: 40px;
                        font-size: 1.1rem;
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

    setVolume(value) {
        this.volume = value / 100;
        this.audio.volume = this.volume;
        
        if (this.audioContext) {
            const gainNodes = this.audioContext.destination;
            // Update volume for generated tones
        }
    }

    updateTrackDisplay() {
        const trackNameEl = document.querySelector('.track-name');
        if (this.currentTrack !== null) {
            trackNameEl.textContent = this.tracks[this.currentTrack].name;
        } else {
            trackNameEl.textContent = 'No music playing';
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
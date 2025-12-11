// ==================== AUDIO MODULE ====================
// Handles background music, sound effects, and audio settings

// Audio context for advanced sound effects
let audioContext = null;

// Music tracks
const MUSIC_TRACKS = {
  mainMenu: 'assets/audio/main_menu.mp3',
  village: 'assets/audio/village_theme.mp3',
  sunnyFields: 'assets/audio/sunny_fields.mp3',
  battle: 'assets/audio/battle_theme.mp3',
  boss: 'assets/audio/boss_theme.mp3',
  shop: 'assets/audio/shop_theme.mp3',
  guild: 'assets/audio/guild_theme.mp3',
  storySad: 'assets/audio/sad_story.mp3',
  crimsonForest: 'assets/audio/crimson_forest.mp3',
  crystalCaves: 'assets/audio/crystal_caves.mp3',
  volcano: 'assets/audio/volcano.mp3',
  mountains: 'assets/audio/mountains.mp3',
  forgottenCity: 'assets/audio/forgotten_city.mp3',
  victory: 'assets/audio/victory.mp3',
  gameOver: 'assets/audio/game_over.mp3'
};

// Current music state
let currentMusic = null;
let currentMusicName = '';
let musicVolume = 0.5;
let sfxVolume = 0.7;
let isMuted = false;

// Initialize audio system
export function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Resume audio context on user interaction
  document.addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }, { once: true });
}

// Play background music
export function playMusic(trackName, fadeIn = true) {
  if (trackName === currentMusicName && currentMusic && !currentMusic.paused) {
    return; // Already playing
  }
  
  const trackPath = MUSIC_TRACKS[trackName];
  if (!trackPath) {
    console.warn(`Music track not found: ${trackName}`);
    return;
  }
  
  // Fade out current music
  if (currentMusic) {
    if (fadeIn) {
      fadeOutMusic(currentMusic, 500);
    } else {
      currentMusic.pause();
      currentMusic.currentTime = 0;
    }
  }
  
  // Create new audio element
  currentMusic = new Audio(trackPath);
  currentMusic.loop = true;
  currentMusic.volume = fadeIn ? 0 : (isMuted ? 0 : musicVolume);
  currentMusicName = trackName;
  
  currentMusic.play().catch(e => {
    console.log('Music autoplay blocked, waiting for user interaction');
  });
  
  if (fadeIn) {
    fadeInMusic(currentMusic, 1000);
  }
}

// Fade in music
function fadeInMusic(audio, duration) {
  const targetVolume = isMuted ? 0 : musicVolume;
  const step = targetVolume / (duration / 50);
  
  const fade = setInterval(() => {
    if (audio.volume < targetVolume - step) {
      audio.volume = Math.min(audio.volume + step, targetVolume);
    } else {
      audio.volume = targetVolume;
      clearInterval(fade);
    }
  }, 50);
}

// Fade out music
function fadeOutMusic(audio, duration) {
  const step = audio.volume / (duration / 50);
  
  const fade = setInterval(() => {
    if (audio.volume > step) {
      audio.volume -= step;
    } else {
      audio.pause();
      audio.currentTime = 0;
      clearInterval(fade);
    }
  }, 50);
}

// Stop current music
export function stopMusic(fade = true) {
  if (currentMusic) {
    if (fade) {
      fadeOutMusic(currentMusic, 500);
    } else {
      currentMusic.pause();
      currentMusic.currentTime = 0;
    }
    currentMusicName = '';
  }
}

// Pause music
export function pauseMusic() {
  if (currentMusic) {
    currentMusic.pause();
  }
}

// Resume music
export function resumeMusic() {
  if (currentMusic) {
    currentMusic.play();
  }
}

// ==================== SOUND EFFECTS ====================
// Using Web Audio API for dynamic sound effects

export function playSFX(sfxName) {
  if (isMuted) return;
  if (!audioContext) initAudio();
  
  const now = audioContext.currentTime;
  
  switch(sfxName) {
    case 'shoot':
      playShootSound();
      break;
    case 'hit':
      playHitSound();
      break;
    case 'kill':
      playKillSound();
      break;
    case 'ability':
      playAbilitySound();
      break;
    case 'levelUp':
      playLevelUpSound();
      break;
    case 'bossDefeat':
      playBossDefeatSound();
      break;
    case 'playerDefeat':
      playPlayerDefeatSound();
      break;
    case 'potion':
      playPotionSound();
      break;
    case 'dialogueOpen':
      playDialogueOpenSound();
      break;
    case 'dialogueAdvance':
      playDialogueAdvanceSound();
      break;
    case 'dialogueClose':
      playDialogueCloseSound();
      break;
    case 'spiritVoice':
      playSpiritVoiceSound();
      break;
    case 'wave':
      playWaveSound();
      break;
    case 'coin':
      playCoinSound();
      break;
    case 'error':
      playErrorSound();
      break;
    case 'success':
      playSuccessSound();
      break;
    default:
      // Try to play as audio file
      playAudioFile(`assets/audio/sfx/${sfxName}.mp3`);
  }
}

// Play audio file directly
function playAudioFile(path) {
  const audio = new Audio(path);
  audio.volume = sfxVolume;
  audio.play().catch(() => {});
}

// Generate shoot sound
function playShootSound() {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(800, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
  
  gain.gain.setValueAtTime(sfxVolume * 0.3, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.1);
}

// Generate hit sound
function playHitSound() {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
  
  gain.gain.setValueAtTime(sfxVolume * 0.4, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.1);
}

// Generate kill sound
function playKillSound() {
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  
  notes.forEach((freq, i) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.05);
    
    gain.gain.setValueAtTime(sfxVolume * 0.3, audioContext.currentTime + i * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3 + i * 0.05);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start(audioContext.currentTime + i * 0.05);
    osc.stop(audioContext.currentTime + 0.3 + i * 0.05);
  });
}

// Generate ability sound
function playAbilitySound() {
  const osc1 = audioContext.createOscillator();
  const osc2 = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc1.type = 'sine';
  osc2.type = 'triangle';
  
  osc1.frequency.setValueAtTime(400, audioContext.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
  
  osc2.frequency.setValueAtTime(200, audioContext.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
  
  gain.gain.setValueAtTime(sfxVolume * 0.4, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioContext.destination);
  
  osc1.start();
  osc2.start();
  osc1.stop(audioContext.currentTime + 0.3);
  osc2.stop(audioContext.currentTime + 0.3);
}

// Generate level up sound
function playLevelUpSound() {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  
  notes.forEach((freq, i) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
    
    gain.gain.setValueAtTime(sfxVolume * 0.4, audioContext.currentTime + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5 + i * 0.1);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start(audioContext.currentTime + i * 0.1);
    osc.stop(audioContext.currentTime + 0.5 + i * 0.1);
  });
}

// Generate boss defeat fanfare
function playBossDefeatSound() {
  const melody = [
    { freq: 392, time: 0 },     // G4
    { freq: 440, time: 0.15 },  // A4
    { freq: 494, time: 0.3 },   // B4
    { freq: 523, time: 0.45 },  // C5
    { freq: 587, time: 0.6 },   // D5
    { freq: 659, time: 0.75 },  // E5
    { freq: 784, time: 0.9 }    // G5
  ];
  
  melody.forEach(note => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, audioContext.currentTime + note.time);
    
    gain.gain.setValueAtTime(sfxVolume * 0.5, audioContext.currentTime + note.time);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.time + 0.3);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start(audioContext.currentTime + note.time);
    osc.stop(audioContext.currentTime + note.time + 0.3);
  });
}

// Generate player defeat sound
function playPlayerDefeatSound() {
  const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4
  
  notes.forEach((freq, i) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.2);
    
    gain.gain.setValueAtTime(sfxVolume * 0.3, audioContext.currentTime + i * 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5 + i * 0.2);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start(audioContext.currentTime + i * 0.2);
    osc.stop(audioContext.currentTime + 0.5 + i * 0.2);
  });
}

// Generate potion sound
function playPotionSound() {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
  osc.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
  
  gain.gain.setValueAtTime(sfxVolume * 0.3, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.3);
}

// Generate dialogue sounds
function playDialogueOpenSound() {
  playTone(400, 0.1, 'sine');
}

function playDialogueAdvanceSound() {
  playTone(600, 0.05, 'sine');
}

function playDialogueCloseSound() {
  playTone(300, 0.1, 'sine');
}

function playSpiritVoiceSound() {
  const osc1 = audioContext.createOscillator();
  const osc2 = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc1.type = 'sine';
  osc2.type = 'sine';
  
  osc1.frequency.setValueAtTime(800, audioContext.currentTime);
  osc2.frequency.setValueAtTime(803, audioContext.currentTime); // Slight detune for ethereal effect
  
  gain.gain.setValueAtTime(sfxVolume * 0.2, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioContext.destination);
  
  osc1.start();
  osc2.start();
  osc1.stop(audioContext.currentTime + 0.5);
  osc2.stop(audioContext.currentTime + 0.5);
}

function playWaveSound() {
  const notes = [392, 523, 659]; // G4, C5, E5
  
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'triangle'), i * 100);
  });
}

function playCoinSound() {
  playTone(1047, 0.05, 'square');
  setTimeout(() => playTone(1319, 0.05, 'square'), 50);
}

function playErrorSound() {
  playTone(200, 0.1, 'sawtooth');
  setTimeout(() => playTone(150, 0.15, 'sawtooth'), 100);
}

function playSuccessSound() {
  playTone(523, 0.1, 'sine');
  setTimeout(() => playTone(659, 0.1, 'sine'), 100);
  setTimeout(() => playTone(784, 0.15, 'sine'), 200);
}

// Helper function to play a simple tone
function playTone(frequency, duration, type = 'sine') {
  if (!audioContext) return;
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioContext.currentTime);
  
  gain.gain.setValueAtTime(sfxVolume * 0.3, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.start();
  osc.stop(audioContext.currentTime + duration);
}

// ==================== VOLUME CONTROLS ====================

export function setMusicVolume(volume) {
  musicVolume = Math.max(0, Math.min(1, volume));
  if (currentMusic && !isMuted) {
    currentMusic.volume = musicVolume;
  }
}

export function setSFXVolume(volume) {
  sfxVolume = Math.max(0, Math.min(1, volume));
}

export function toggleMute() {
  isMuted = !isMuted;
  if (currentMusic) {
    currentMusic.volume = isMuted ? 0 : musicVolume;
  }
  return isMuted;
}

export function getMusicVolume() {
  return musicVolume;
}

export function getSFXVolume() {
  return sfxVolume;
}

export function isMusicMuted() {
  return isMuted;
}

// ==================== AUDIO FILES INFO ====================
/*
RECOMMENDED AUDIO FILES FOR YOUR GAME:

1. BACKGROUND MUSIC (10-15 tracks recommended):
   - main_menu.mp3      - Title screen, mysterious/epic
   - village_theme.mp3  - Peaceful, warm, welcoming
   - sunny_fields.mp3   - Light, adventurous
   - battle_theme.mp3   - Intense, action-packed
   - boss_theme.mp3     - Epic, dramatic, intimidating
   - shop_theme.mp3     - Relaxed, mercantile feel
   - guild_theme.mp3    - Heroic, adventurous
   - sad_story.mp3      - Emotional, melancholic (for inner voice moments)
   - crimson_forest.mp3 - Dark, ominous
   - crystal_caves.mp3  - Mysterious, echoing
   - volcano.mp3        - Intense, fiery
   - mountains.mp3      - Majestic, cold
   - forgotten_city.mp3 - Haunting, ancient
   - victory.mp3        - Triumphant fanfare (short, 5-10 sec)
   - game_over.mp3      - Somber (short, 5-10 sec)

2. SOUND EFFECTS (generated by Web Audio API, but you can add custom):
   - assets/audio/sfx/sword_swing.mp3
   - assets/audio/sfx/arrow_fire.mp3
   - assets/audio/sfx/knife_throw.mp3
   - assets/audio/sfx/shield_block.mp3
   - assets/audio/sfx/explosion.mp3
   - assets/audio/sfx/heal.mp3
   - assets/audio/sfx/buff.mp3

HOW TO ADD YOUR OWN AUDIO FILES:
1. Create folder: assets/audio/
2. Put your MP3 files there
3. Update MUSIC_TRACKS object above with your file paths
4. Call playMusic('trackName') to play

EXAMPLE:
   MUSIC_TRACKS.myCustomTrack = 'assets/audio/my_song.mp3';
   playMusic('myCustomTrack');
*/

// ======== MUSIC PLAYER FUNCTIONALITY ========

let musicPlayer = {
  isPlaying: false,
  currentSong: null,
  queue: [],
  playlists: [{ id: 1, name: 'My Playlist', songs: [] }],
  searchResults: [],
  activeView: 'player',
  volume: 50,
  isMinimized: false,
  position: { x: 20, y: 20 },
  isDragging: false,
  dragOffset: { x: 0, y: 0 },
  youtubePlayer: null
};

// Initialize YouTube API
function initializeYouTubeAPI() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = () => {
    musicPlayer.youtubePlayer = new window.YT.Player('youtube-player', {
      height: '0',
      width: '0',
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  };
}

function onPlayerReady(event) {
  event.target.setVolume(musicPlayer.volume);
}

function onPlayerStateChange(event) {
  if (event.data === window.YT.PlayerState.ENDED) {
    handleNext();
  }
}

// Search YouTube
async function searchYouTube() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) return;

  // Create mock results for demo
  const mockResults = Array.from({ length: 8 }, (_, i) => ({
    id: `vid-${Date.now()}-${i}`,
    videoId: `dQw4w9WgXcQ`, // Demo video ID
    title: `${query} - Result ${i + 1}`,
    artist: `Artist ${i + 1}`,
    thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg`,
    duration: '3:45'
  }));

  musicPlayer.searchResults = mockResults;
  displaySearchResults();
}

function displaySearchResults() {
  const container = document.getElementById('search-results');
  container.innerHTML = '';

  musicPlayer.searchResults.forEach(song => {
    const songElement = document.createElement('div');
    songElement.className = 'search-result-item';
    songElement.innerHTML = `
      <img src="${song.thumbnail}" alt="${song.title}" class="result-thumbnail">
      <div class="result-info">
        <div class="result-title">${song.title}</div>
        <div class="result-artist">${song.artist}</div>
      </div>
      <div class="result-actions">
        <button onclick="playSong(${JSON.stringify(song).replace(/"/g, '&quot;')})" class="result-play-btn">▶️</button>
        <button onclick="addToQueue(${JSON.stringify(song).replace(/"/g, '&quot;')})" class="result-add-btn">➕</button>
      </div>
    `;
    container.appendChild(songElement);
  });
}

function playSong(song) {
  musicPlayer.currentSong = song;
  if (musicPlayer.youtubePlayer && musicPlayer.youtubePlayer.loadVideoById) {
    musicPlayer.youtubePlayer.loadVideoById(song.videoId);
    musicPlayer.isPlaying = true;
    updatePlayerDisplay();
  }
}

function togglePlay() {
  if (!musicPlayer.youtubePlayer || !musicPlayer.currentSong) return;
  
  if (musicPlayer.isPlaying) {
    musicPlayer.youtubePlayer.pauseVideo();
  } else {
    musicPlayer.youtubePlayer.playVideo();
  }
  musicPlayer.isPlaying = !musicPlayer.isPlaying;
  updatePlayerDisplay();
}

function handleNext() {
  if (musicPlayer.queue.length > 0) {
    const nextSong = musicPlayer.queue[0];
    musicPlayer.queue = musicPlayer.queue.slice(1);
    playSong(nextSong);
    updateQueueDisplay();
  }
}

function handlePrevious() {
  if (musicPlayer.youtubePlayer) {
    musicPlayer.youtubePlayer.seekTo(0);
  }
}

function addToQueue(song) {
  musicPlayer.queue.push(song);
  if (!musicPlayer.currentSong) {
    playSong(song);
  }
  updateQueueDisplay();
}

function updatePlayerDisplay() {
  const playPauseBtn = document.getElementById('play-pause-btn');
  const minimizedPlayBtn = document.getElementById('minimized-play-btn');
  
  if (musicPlayer.currentSong) {
    // Update main player
    document.querySelector('.song-title').textContent = musicPlayer.currentSong.title;
    document.querySelector('.song-artist').textContent = musicPlayer.currentSong.artist;
    
    // Update minimized view
    document.querySelector('.minimized-title').textContent = musicPlayer.currentSong.title;
    document.querySelector('.minimized-artist').textContent = musicPlayer.currentSong.artist;
  }

  const playIcon = musicPlayer.isPlaying ? '⏸️' : '▶️';
  if (playPauseBtn) playPauseBtn.textContent = playIcon;
  if (minimizedPlayBtn) minimizedPlayBtn.textContent = playIcon;
}

function updateQueueDisplay() {
  document.getElementById('queue-count').textContent = musicPlayer.queue.length;
  const queueList = document.getElementById('queue-list');
  queueList.innerHTML = '';

  musicPlayer.queue.slice(0, 5).forEach((song, index) => {
    const queueItem = document.createElement('div');
    queueItem.className = 'queue-item';
    queueItem.innerHTML = `
      <span class="queue-icon">🎵</span>
      <div class="queue-info">
        <div class="queue-title">${song.title}</div>
        <div class="queue-artist">${song.artist}</div>
      </div>
    `;
    queueList.appendChild(queueItem);
  });
}

function handleVolumeChange(event) {
  musicPlayer.volume = parseInt(event.target.value);
  if (musicPlayer.youtubePlayer) {
    musicPlayer.youtubePlayer.setVolume(musicPlayer.volume);
  }
}

function switchView(viewName) {
  // Update nav tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

  // Update views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById(`${viewName}-view`).classList.add('active');

  musicPlayer.activeView = viewName;
}

function toggleMinimize() {
  musicPlayer.isMinimized = !musicPlayer.isMinimized;
  
  const playerContent = document.getElementById('player-content');
  const minimizedView = document.getElementById('minimized-view');
  const minimizeBtn = document.getElementById('minimize-btn');
  
  if (musicPlayer.isMinimized) {
    playerContent.classList.add('hidden');
    minimizedView.classList.remove('hidden');
    minimizeBtn.textContent = '🔼';
  } else {
    playerContent.classList.remove('hidden');
    minimizedView.classList.add('hidden');
    minimizeBtn.textContent = '🔽';
  }
}

function createPlaylist() {
  const name = prompt('Enter playlist name:');
  if (name) {
    musicPlayer.playlists.push({ 
      id: Date.now(), 
      name, 
      songs: [] 
    });
    updatePlaylistsDisplay();
  }
}

function updatePlaylistsDisplay() {
  const container = document.getElementById('playlists-list');
  container.innerHTML = '';

  musicPlayer.playlists.forEach(playlist => {
    const playlistElement = document.createElement('div');
    playlistElement.className = 'playlist-item';
    playlistElement.innerHTML = `
      <div class="playlist-header">
        <span class="playlist-icon">🎵</span>
        <div class="playlist-info">
          <div class="playlist-name">${playlist.name}</div>
          <div class="playlist-count">${playlist.songs.length} songs</div>
        </div>
      </div>
    `;
    container.appendChild(playlistElement);
  });
}

// Dragging functionality
function initializeDragging() {
  const musicPlayerEl = document.getElementById('music-player');
  const dragHandle = document.querySelector('.drag-handle');
  
  if (!dragHandle) return;

  dragHandle.addEventListener('mousedown', (e) => {
    musicPlayer.isDragging = true;
    musicPlayer.dragOffset = {
      x: e.clientX - musicPlayer.position.x,
      y: e.clientY - musicPlayer.position.y
    };
  });

  document.addEventListener('mousemove', (e) => {
    if (musicPlayer.isDragging) {
      musicPlayer.position = {
        x: e.clientX - musicPlayer.dragOffset.x,
        y: e.clientY - musicPlayer.dragOffset.y
      };
      musicPlayerEl.style.left = `${musicPlayer.position.x}px`;
      musicPlayerEl.style.top = `${musicPlayer.position.y}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    musicPlayer.isDragging = false;
  });
}

// ======== GAME FUNCTIONALITY ========

// Helper function to safely add event listeners
function safeAddListener(id, event, handler) {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener(event, handler);
  } else {
    console.warn(`Element with id '${id}' not found`);
  }
}

// ---------- simple view switcher (no SPA routing) ----------
const views = {
  home: document.getElementById('view-home'),
  imposter: document.getElementById('view-imposter'),
  chess: document.getElementById('view-chess'),
  connect4: document.getElementById('view-connect4'),
};

function show(view) {
  Object.values(views).forEach(v => v && v.classList.remove('active'));
  const targetView = views[view] || views.home;
  if (targetView) targetView.classList.add('active');
}

// Guest user support
let user = null;

function initGuestMode() {
  user = {
    uid: "guest-" + Math.random().toString(36).slice(2),
    displayName: "Guest Player"
  };
  localStorage.setItem("guestUser", JSON.stringify(user));
  console.log("[Guest Mode] Playing as:", user.displayName);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize guest mode
  initGuestMode();

  // Set up view switcher buttons
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => show(btn.dataset.view));
  });

  // Set footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize music player
  initializeYouTubeAPI();
  initializeDragging();

  // Music player event listeners
  document.getElementById('minimize-btn')?.addEventListener('click', toggleMinimize);
  document.getElementById('play-pause-btn')?.addEventListener('click', togglePlay);
  document.getElementById('minimized-play-btn')?.addEventListener('click', togglePlay);
  document.getElementById('prev-btn')?.addEventListener('click', handlePrevious);
  document.getElementById('next-btn')?.addEventListener('click', handleNext);
  document.getElementById('search-btn')?.addEventListener('click', searchYouTube);
  document.getElementById('volume-slider')?.addEventListener('input', handleVolumeChange);
  document.getElementById('create-playlist-btn')?.addEventListener('click', createPlaylist);

  // Search on Enter key
  document.getElementById('search-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchYouTube();
  });

  // Navigation tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchView(tab.dataset.view);
    });
  });

  // Initialize displays
  updatePlayerDisplay();
  updateQueueDisplay();
  updatePlaylistsDisplay();
});

// ======== LEGACY AUDIO FUNCTIONS (for compatibility) ========

// Keep some legacy functions for any existing references
function togglePlay() {
  // This is handled by the new music player
  return;
}

function nextTrack() {
  handleNext();
}

function prevTrack() {
  handlePrevious();
}

function searchMusic() {
  // Switch to search view and focus input
  switchView('search');
  document.getElementById('search-input')?.focus();
}

function createPlaylist() {
  // Switch to playlists view
  switchView('playlists');
  const name = prompt('Enter playlist name:');
  if (name) {
    musicPlayer.playlists.push({ 
      id: Date.now(), 
      name, 
      songs: [] 
    });
    updatePlaylistsDisplay();
  }
}

function addLink() {
  alert('Link adding functionality coming soon!');
}

function loginSpotify() {
  alert('Spotify integration coming soon!');
}

function loginYouTube() {
  alert('YouTube integration coming soon!');
}

// ---------- music ----------
const musicToggle = document.getElementById('musicToggle');
const musicPanel = document.getElementById('musicPanel');
const musicInput = document.getElementById('musicInput');
const addTrackBtn = document.getElementById('addTrack');
const clearTracksBtn = document.getElementById('clearTracks');
const musicList = document.getElementById('musicList');
const LS_KEY = 'evol-playlist';

// Add null checks for music elements
if (musicToggle && musicPanel) {
  musicToggle.addEventListener('click', () => musicPanel.classList.toggle('hidden'));
}
if (addTrackBtn) {
  addTrackBtn.addEventListener('click', addTrack);
}
if (clearTracksBtn) {
  clearTracksBtn.addEventListener('click', () => {
    localStorage.removeItem(LS_KEY);
    renderPlaylist([]);
  });
}
function loadPlaylist(){ try{ return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }catch{ return [] } }
function savePlaylist(list){ localStorage.setItem(LS_KEY, JSON.stringify(list)); }
function addTrack(){
  const url = musicInput.value.trim();
  if(!url) return;
  const list = loadPlaylist();
  list.push(url);
  savePlaylist(list);
  musicInput.value = '';
  renderPlaylist(list);
}
function renderPlaylist(list){
  musicList.innerHTML = '';
  list.forEach(url => {
    const isYouTube = /youtube\.com|youtu\.be/.test(url);
    const isSpotify = /open\.spotify\.com/.test(url);
    const isApple = /music\.apple\.com/.test(url);
    const isMp3 = /\.mp3($|\?)/.test(url);
    const wrap = document.createElement('div');

    if (isYouTube) {
      // expect full embed or share link; we attempt to build embed if plain watch URL
      const vid = url.match(/v=([^&]+)/)?.[1] || url.match(/youtu\.be\/([^?]+)/)?.[1];
      const src = vid ? `https://www.youtube.com/embed/${vid}` : url;
      wrap.innerHTML = `<iframe width="100%" height="80" src="${src}" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    } else if (isSpotify) {
      // if it's a track/playlist/album URL, convert to embed
      const path = new URL(url).pathname.replace(/^\/+/, '');
      wrap.innerHTML = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/${path}" height="80" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"></iframe>`;
    } else if (isApple) {
      wrap.innerHTML = `<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="80" style="width:100%; overflow:hidden; background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="${url.replace('/us/','/embed/us/')}"></iframe>`;
    } else if (isMp3) {
      wrap.innerHTML = `<audio controls src="${url}"></audio>`;
    } else {
      wrap.textContent = `Unsupported link: ${url}`;
    }
    musicList.appendChild(wrap);
  });
}
renderPlaylist(loadPlaylist());

// ---------- socket connection ----------
const socket = io("http://165.227.124.255:3000", { transports: ['websocket'] }); // TODO: replace with your domain if you add one
socket.on('connect', () => console.log('[E.Vol] Connected to server:', socket.id));

// ---------- IMPOSTER ----------
const impLobbyIdEl = document.getElementById('impLobbyId');
const impPlayersEl = document.getElementById('impPlayers');
const impCluesEl = document.getElementById('impClues');
const impVoteBtns = document.getElementById('impVoteBtns');
const impResultsEl = document.getElementById('impResults');
const impPhaseEl = document.getElementById('impPhase');
const impWordWrap = document.getElementById('impWord');
const impWordText = document.getElementById('impWordText');

let IMP_LOBBY = null;
let IMP_PLAYERS = [];
let IMP_WORD = null;

safeAddListener('impCreate', 'click', () => {
  const lobbyId = randomCode();
  IMP_LOBBY = lobbyId;
  impLobbyIdEl.textContent = lobbyId;
  socket.emit('joinLobby', lobbyId);
  impPhaseEl.textContent = 'Phase: waiting';
  // host picks a secret word (locally)
  const words = ["Pizza","Dog","Car","Computer","Football","Banana","School","Ocean","Camera","Guitar"];
  IMP_WORD = words[Math.floor(Math.random()*words.length)];
  impWordWrap.classList.remove('hidden');
  impWordText.textContent = IMP_WORD;
});

safeAddListener('impJoin', 'click', () => {
  const id = document.getElementById('impJoinInput').value.trim().toUpperCase();
  if(!id) return;
  IMP_LOBBY = id;
  impLobbyIdEl.textContent = id;
  socket.emit('joinLobby', id);
  impPhaseEl.textContent = 'Phase: waiting';
  // joiners do NOT see the word (host shares clues only)
});

safeAddListener('impBotEasy', 'click', () => quickBotImposter('easy'));
safeAddListener('impBotMedium', 'click', () => quickBotImposter('medium'));

function quickBotImposter(level){
  // simple bot: sends 3 vague clues and votes randomly
  show('imposter');
  const lobbyId = randomCode();
  IMP_LOBBY = lobbyId;
  impLobbyIdEl.textContent = lobbyId;
  socket.emit('joinLobby', lobbyId);
  const words = ["Pizza","Dog","Car","Computer","Football","Banana"];
  IMP_WORD = words[Math.floor(Math.random()*words.length)];
  impWordWrap.classList.remove('hidden');
  impWordText.textContent = IMP_WORD;
  impPhaseEl.textContent = 'Phase: clue';
  const botClues = {
    easy: ["Thing","Common","Everyday"],
    medium: ["Object","Familiar","Used often"],
  }[level];
  // render bot clues
  impCluesEl.innerHTML = '';
  botClues.forEach((c,i)=>{
    const li = document.createElement('li');
    li.textContent = `Bot${i+1}: ${c}`;
    impCluesEl.appendChild(li);
  });
  // fake vote buttons
  impVoteBtns.innerHTML = '';
  ['Bot1','Bot2','Bot3','You'].forEach(name=>{
    const b = document.createElement('button');
    b.textContent = name;
    b.onclick = ()=> {
      impResultsEl.innerHTML = `<li>You voted for ${name}</li>`;
      impPhaseEl.textContent = 'Phase: results';
    };
    impVoteBtns.appendChild(b);
  });
}

safeAddListener('impClueBtn', 'click', () => {
  if(!IMP_LOBBY) return alert('Create or join a lobby first.');
  const clue = document.getElementById('impClue').value.trim();
  if(!clue) return;
  socket.emit('sendMessage', { lobbyId: IMP_LOBBY, msg: JSON.stringify({ type:'imposter:clue', text: clue }) });
  document.getElementById('impClue').value = '';
});

socket.on('message', (payload) => {
  // minimal demo bus
  try{
    const m = JSON.parse(payload.split(': ').slice(1).join(': ')); // parses after "<id>: <json>"
    if(m.type === 'imposter:clue'){
      const li = document.createElement('li');
      li.textContent = `Player: ${m.text}`;
      impCluesEl.appendChild(li);
      impPhaseEl.textContent = 'Phase: vote';
    }
  }catch{
    // plain text lobby join message
    if(payload.includes('joined lobby')){
      const li = document.createElement('li');
      li.textContent = payload;
      document.getElementById('impPlayers').appendChild(li);
    }
  }
});

// ---------- CHESS (text-move demo) ----------
const chessLobbyId = document.getElementById('chessLobbyId');
safeAddListener('chessCreate', 'click', () => {
  const id = randomCode();
  if (chessLobbyId) chessLobbyId.textContent = id;
  socket.emit('joinLobby', id);
});
safeAddListener('chessJoin', 'click', () => {
  const id = document.getElementById('chessJoinInput')?.value.trim().toUpperCase();
  if(!id) return;
  if (chessLobbyId) chessLobbyId.textContent = id;
  socket.emit('joinLobby', id);
});
safeAddListener('chessBotEasy', 'click', () => {
  if (chessLobbyId) chessLobbyId.textContent = 'BOT-EASY';
  addChessMove('Bot plays e7->e5');
});
safeAddListener('chessBotMedium', 'click', () => {
  if (chessLobbyId) chessLobbyId.textContent = 'BOT-MED';
  addChessMove('Bot plays d7->d5');
});
safeAddListener('chessMoveBtn', 'click', () => {
  const id = chessLobbyId?.textContent;
  if(!id || id === '—') return alert('Create or join a lobby first.');
  const mv = document.getElementById('chessMove')?.value.trim();
  if(!mv) return;
  socket.emit('sendMessage', { lobbyId: id, msg: JSON.stringify({ type:'chess:move', text: mv }) });
  addChessMove('You: ' + mv);
  const moveEl = document.getElementById('chessMove');
  if (moveEl) moveEl.value = '';
});
function addChessMove(t){ 
  const li=document.createElement('li'); 
  li.textContent=t; 
  const movesEl = document.getElementById('chessMoves');
  if (movesEl) movesEl.appendChild(li); 
}
socket.on('message', (payload) => {
  try{
    const m = JSON.parse(payload.split(': ').slice(1).join(': '));
    if(m.type === 'chess:move') addChessMove('Opponent: ' + m.text);
  }catch{/* ignore non-json */}
});

// ---------- CONNECT 4 ----------
const c4BoardEl = document.getElementById('c4Board');
const c4Status = document.getElementById('c4Status');
const c4LobbyId = document.getElementById('c4LobbyId');
let C4_BOARD = Array.from({length:6},()=>Array(7).fill(null));
let C4_TURN = 'red';
function drawC4(){
  c4BoardEl.innerHTML = '';
  for(let r=0;r<6;r++){
    for(let c=0;c<7;c++){
      const cell = document.createElement('div');
      cell.className = 'c4-cell ' + (C4_BOARD[r][c] || '');
      cell.addEventListener('click', ()=> dropC4(c, 'red', true));
      c4BoardEl.appendChild(cell);
    }
  }
}
function dropC4(col, color, emit){
  for(let r=5;r>=0;r--){
    if(!C4_BOARD[r][col]){
      C4_BOARD[r][col]=color;
      break;
    }
  }
  drawC4();
  C4_TURN = (C4_TURN==='red')?'yellow':'red';
  if (c4Status) c4Status.textContent = `Turn: ${C4_TURN}`;
  if(emit && c4LobbyId?.textContent !== '—'){
    socket.emit('sendMessage', { lobbyId: c4LobbyId.textContent, msg: JSON.stringify({ type:'c4:move', col }) });
  }
}
safeAddListener('c4Create', 'click', () => {
  const id = randomCode();
  if (c4LobbyId) c4LobbyId.textContent = id;
  socket.emit('joinLobby', id);
  resetC4();
});
safeAddListener('c4Join', 'click', () => {
  const id = document.getElementById('c4JoinInput')?.value.trim().toUpperCase();
  if(!id) return;
  if (c4LobbyId) c4LobbyId.textContent = id;
  socket.emit('joinLobby', id);
  resetC4();
});
safeAddListener('c4BotEasy', 'click', () => {
  if (c4LobbyId) c4LobbyId.textContent = 'BOT-EASY';
  resetC4();
});
safeAddListener('c4BotMedium', 'click', () => {
  if (c4LobbyId) c4LobbyId.textContent = 'BOT-MED';
  resetC4();
});
function resetC4(){
  C4_BOARD = Array.from({length:6},()=>Array(7).fill(null));
  C4_TURN = 'red';
  if (c4Status) c4Status.textContent = 'Turn: red';
  drawC4();
}
socket.on('message', (payload) => {
  try{
    const m = JSON.parse(payload.split(': ').slice(1).join(': '));
    if(m.type === 'c4:move'){
      dropC4(m.col, 'yellow', false);
    }
  }catch{/* ignore */}
});

drawC4();

// utils
function randomCode(){ return Math.random().toString(36).substring(2,7).toUpperCase(); }
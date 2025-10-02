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

// Wait for DOM to be ready before setting up event listeners
document.addEventListener('DOMContentLoaded', () => {
  // View switcher buttons
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => show(btn.dataset.view));
  });

  // footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ---------- Guest user support ----------
let user = null;

// Create guest user if no auth
function initGuestMode() {
  user = {
    uid: "guest-" + Math.random().toString(36).slice(2),
    displayName: "Guest Player"
  };
  localStorage.setItem("guestUser", JSON.stringify(user));
  console.log("[Guest Mode] Playing as:", user.displayName);
}

// Initialize guest mode on load
initGuestMode();

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
// Home page hub logic

/***** (A) Games grid & search *****/
const GAMES = [
  { id:'riddles', name:'Brain Riddles', desc:'Classic riddles & teasers', href:'./riddles.html' },
  { id:'trivia', name:'Trivia', desc:'Multiple choice trivia', href:'./trivia.html' },
  { id:'emoji', name:'Emoji Guess', desc:'Decode emoji phrases', href:'./emoji.html' },
  { id:'word', name:'Word Game', desc:'Guess the hidden word', href:'./word.html' },
  { id:'chess', name:'Chess', desc:'Play chess (guest mode)', href:'./chess.html' },
  { id:'connect4', name:'Connect 4', desc:'Classic connect four', href:'./connect4.html' },
  { id:'imposter', name:'Imposter', desc:'Chameleon-style multiplayer', href:'./imposter.html' },
  { id:'school', name:'School Trivia', desc:'Educational quick quizzes', href:'./school.html' },
];

const grid = document.getElementById('grid');
const search = document.getElementById('search');

function render(list){
  if (!grid) return;
  grid.innerHTML = '';
  list.forEach(g => {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = g.href;
    card.innerHTML = `
      <div class="thumb"></div>
      <div class="card-body">
        <h4>${g.name}</h4>
        <div class="muted">${g.desc}</div>
      </div>`;
    grid.appendChild(card);
  });
}
render(GAMES);

if (search) {
  search.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    render(GAMES.filter(g => g.name.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q)));
  });
}

/***** (B) Audio playlists *****/
const playlistSel = document.getElementById('playlistSel');
const newPlaylistBtn = document.getElementById('newPlaylistBtn');
const uploadBtn = document.getElementById('uploadBtn');
const linkInput = document.getElementById('linkInput');
const addLinkBtn = document.getElementById('addLinkBtn');
const nowPlaying = document.getElementById('nowPlaying');

let playlists = {};
try { playlists = JSON.parse(localStorage.getItem('evol.playlists') || '{}'); } catch(_) {}
let current = localStorage.getItem('evol.currentPlaylist') || '';

function saveLists(){ localStorage.setItem('evol.playlists', JSON.stringify(playlists)); }
function refreshPlaylists(){
  if (!playlistSel) return;
  playlistSel.innerHTML = '';
  Object.keys(playlists).forEach(name => {
    const o = document.createElement('option');
    o.value = name; o.textContent = name; playlistSel.appendChild(o);
  });
  if (!current && Object.keys(playlists).length) current = Object.keys(playlists)[0];
  if (current) playlistSel.value = current;
}
refreshPlaylists();

playlistSel && (playlistSel.onchange = () => {
  current = playlistSel.value;
  localStorage.setItem('evol.currentPlaylist', current);
});

newPlaylistBtn && (newPlaylistBtn.onclick = () => {
  const name = prompt('Playlist name?')?.trim();
  if (!name) return;
  if (!playlists[name]) playlists[name] = [];
  current = name;
  saveLists(); refreshPlaylists();
});

uploadBtn && (uploadBtn.onclick = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'audio/*';
  input.multiple = true;
  input.onchange = () => {
    const files = [...input.files];
    if (!files.length) return;
    if (!current) { alert('Create a playlist first.'); return; }
    files.forEach(f => {
      const url = URL.createObjectURL(f);
      playlists[current].push({ title: f.name, url, type:'file' });
    });
    saveLists();
    alert(`Added ${files.length} track(s) to "${current}".`);
  };
  input.click();
});

addLinkBtn && (addLinkBtn.onclick = () => {
  const link = linkInput.value.trim();
  if (!link) return;
  if (!current) { alert('Create a playlist first.'); return; }
  const title = link.split('/').pop().slice(0,60) || 'Link';
  playlists[current].push({ title, url: link, type:'link' });
  saveLists(); linkInput.value='';
  alert(`Added link to "${current}".`);
});

const audio = new Audio();
audio.addEventListener('ended', () => nowPlaying && (nowPlaying.textContent = 'Now Playing: None'));

function playFirstLocal(){
  if (!current) { alert('Select or create a playlist.'); return; }
  const list = playlists[current] || [];
  const t = list.find(x => x.type === 'file');
  if (!t) { alert('No uploaded audio in this playlist.'); return; }
  audio.src = t.url; audio.play();
  nowPlaying && (nowPlaying.textContent = `Now Playing: ${t.title}`);
}
nowPlaying && (nowPlaying.onclick = playFirstLocal);

/***** (C) Optional Firebase scaffold *****/
const FIREBASE = { enabled:false, config:{ apiKey:'YOUR_API_KEY', authDomain:'YOUR_AUTH_DOMAIN', projectId:'YOUR_PROJECT_ID', storageBucket:'YOUR_BUCKET', appId:'YOUR_APP_ID' } };
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
let auth, db, user = null;

async function initFirebase(){
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js');
  const { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js');
  const { getFirestore, collection, query, orderBy, limit, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');
  const app = initializeApp(FIREBASE.config);
  auth = getAuth(app); db = getFirestore(app);
  const provider = new GoogleAuthProvider();
  loginBtn && (loginBtn.onclick = () => signInWithPopup(auth, provider));
  logoutBtn && (logoutBtn.onclick = () => signOut(auth));
  onAuthStateChanged(auth, async (u) => {
    user = u || null;
    if (loginBtn) loginBtn.style.display = user ? 'none':'inline-block';
    if (logoutBtn) logoutBtn.style.display = user ? 'inline-block':'none';
    if (db) await loadLeaderboard(db);
  });
  window._evolDb = db; // accessible hook
}

async function loadLeaderboard(db){
  const { collection, query, orderBy, limit, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');
  const q = query(collection(db,'leaderboard'), orderBy('score','desc'), limit(20));
  const snap = await getDocs(q);
  const tbody = document.querySelector('#boardTbl tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (snap.empty) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="3" style="text-align:center;opacity:.6">(Empty)</td>';
    tbody.appendChild(tr);
    return;}
  snap.forEach(doc => {
    const r = doc.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.name||'User'}</td><td>${r.game||'-'}</td><td>${r.score||0}</td>`;
    tbody.appendChild(tr);
  });
}

if (FIREBASE.enabled) initFirebase();

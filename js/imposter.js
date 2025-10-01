import { SOCKET_URL } from './socket.js';

// Connect
const sock = io(SOCKET_URL, { transports: ['websocket'] });
let currentLobbyId = null;
let youId = null;

// DOM helpers
const $ = sel => document.querySelector(sel);
const playersEl = $('#players');
const chatEl = $('#chat');
const accuseSel = $('#accuseSel');

function addChat(msg) {
  const p = document.createElement('div');
  p.textContent = msg;
  chatEl.appendChild(p);
  chatEl.scrollTop = chatEl.scrollHeight;
}

// Buttons / UI actions
$('#createBtn').onclick = () => {
  const lobbyId = $('#lobbyId').value.trim() || 'room1';
  const name = $('#name').value.trim() || 'Player';
  currentLobbyId = lobbyId;
  sock.emit('lobby:create', { lobbyId, name });
};

$('#joinBtn').onclick = () => {
  const lobbyId = $('#lobbyId').value.trim();
  const name = $('#name').value.trim() || 'Player';
  if (!lobbyId) return alert('Enter lobby ID');
  currentLobbyId = lobbyId;
  sock.emit('lobby:join', { lobbyId, name });
};

$('#setCategoryBtn').onclick = () => {
  if (!currentLobbyId) return;
  sock.emit('lobby:setCategory', { lobbyId: currentLobbyId, category: $('#categorySel').value });
};

$('#startRoundBtn').onclick = () => {
  if (!currentLobbyId) return;
  sock.emit('round:start', { lobbyId: currentLobbyId });
};

$('#toVoteBtn').onclick = () => {
  if (!currentLobbyId) return;
  sock.emit('phase:vote', { lobbyId: currentLobbyId });
};

$('#revealBtn').onclick = () => {
  if (!currentLobbyId) return;
  sock.emit('vote:reveal', { lobbyId: currentLobbyId, impostorGuess: $('#impGuess').value.trim() });
};

$('#sendClue').onclick = () => {
  if (!currentLobbyId) return;
  const t = $('#clue').value.trim();
  if (!t) return;
  sock.emit('clue:send', { lobbyId: currentLobbyId, text: t });
  $('#clue').value = '';
};

$('#accuseBtn').onclick = () => {
  if (!currentLobbyId) return;
  const accusedId = accuseSel.value;
  if (!accusedId) return;
  sock.emit('vote:accuse', { lobbyId: currentLobbyId, accusedId });
};

// Socket events
sock.on('connect', () => { youId = sock.id; });

sock.on('lobby:update', (state) => {
  playersEl.innerHTML = '';
  accuseSel.innerHTML = '<option value="">-- pick --</option>';

  state.players.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${p.name} ${p.id === state.hostId ? '<span class="tag">(host)</span>' : ''}</span><b>${p.score}</b>`;
    playersEl.appendChild(li);

    if (p.id !== youId) {
      const opt = document.createElement('option');
      opt.value = p.id; opt.textContent = p.name;
      accuseSel.appendChild(opt);
    }
  });

  $('#roundInfo').textContent = `Round: ${state.round} · Phase: ${state.phase} · Category: ${state.category}`;
});

sock.on('round:start', (info) => {
  const roleText = info.youAreImpostor
    ? 'You are the IMPOSTOR. Bluff wisely.'
    : `Secret Word: ${info.word}`;
  $('#role').textContent = `[Round ${info.round}] Category: ${info.category} · ${roleText}`;
  addChat(`— Round ${info.round} started (${info.category}) —`);
});

sock.on('clue:message', ({ name, text }) => {
  addChat(`${name}: ${text}`);
});

sock.on('phase:changed', ({ phase }) => {
  addChat(`— Phase changed: ${phase.toUpperCase()} —`);
});

sock.on('vote:update', ({ voterId, accusedId }) => {
  addChat(`Vote: ${voterId.slice(0,6)} → ${accusedId.slice(0,6)}`);
});

sock.on('round:reveal', (data) => {
  addChat(`REVEAL → Impostor: ${data.impostorId.slice(0,6)} · Word: ${data.word}`);
  addChat(`Impostor caught: ${data.impostorCaught ? 'YES' : 'NO'} · Impostor guessed correctly: ${data.impostorGuessedCorrect ? 'YES' : 'NO'}`);
  addChat(`Scores: ${data.scores.map(s => s.name+':'+s.score).join(' · ')}`);
});

// Basic reconnect notice
sock.io.on('reconnect_attempt', () => addChat('… reconnecting ...'));

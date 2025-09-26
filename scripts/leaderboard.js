// scripts/leaderboard.js - simple localStorage leaderboard
// Stores top scores per game key: LB::<game>

const LB_PREFIX = 'PBE_LB::';
const GAMES = ['trivia','animal','riddles','puzzles'];

function getUser(){ try { return JSON.parse(localStorage.getItem('pbe.auth.user')||'null'); } catch { return null; } }

export function submitScore(game, score){
  if(!GAMES.includes(game)) return;
  const user = getUser() || { name: 'Guest' };
  const key = LB_PREFIX + game;
  let rows = [];
  try { rows = JSON.parse(localStorage.getItem(key)||'[]'); } catch {}
  rows.push({ name: user.name, score: Number(score)||0, ts: Date.now() });
  rows.sort((a,b)=> b.score - a.score || a.ts - b.ts);
  rows = rows.slice(0,50);
  localStorage.setItem(key, JSON.stringify(rows));
}

function formatRows(rows){
  if(!rows.length) return 'No scores yet';
  let out = 'Rank  Score  Player\n';
  rows.forEach((r,i)=>{ out += `${String(i+1).padStart(2,' ')}.   ${String(r.score).padStart(5,' ')}  ${r.name}\n`; });
  return out.trim();
}

function loadLeaderboard(){
  const sel = document.getElementById('lbGame');
  const rowsEl = document.getElementById('lbRows');
  if(!sel||!rowsEl) return;
  const key = LB_PREFIX + sel.value;
  let rows = [];
  try { rows = JSON.parse(localStorage.getItem(key)||'[]'); } catch {}
  rowsEl.textContent = formatRows(rows);
}

window.addEventListener('DOMContentLoaded',()=>{
  const refresh = document.getElementById('lbRefresh');
  const sel = document.getElementById('lbGame');
  if(refresh) refresh.addEventListener('click', loadLeaderboard);
  if(sel) sel.addEventListener('change', loadLeaderboard);
  loadLeaderboard();
});
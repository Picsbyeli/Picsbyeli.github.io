// scripts/auth.js - minimal placeholder auth logic
// Simulates a simple sign in/out using localStorage without real backend.

const LS_USER_KEY = 'pbe.auth.user';

function loadUser(){
  try { return JSON.parse(localStorage.getItem(LS_USER_KEY)||'null'); } catch { return null; }
}
function saveUser(u){ localStorage.setItem(LS_USER_KEY, JSON.stringify(u)); }
function clearUser(){ localStorage.removeItem(LS_USER_KEY); }

function updateNavUser(){
  const user = loadUser();
  document.getElementById('navUser').textContent = user ? user.name : 'Guest';
  document.getElementById('btnAuth').style.display = user ? 'none':'inline-block';
  document.getElementById('btnSignOut').style.display = user ? 'inline-block':'none';
}

function signIn(){
  const name = prompt('Enter a player name (3-16 chars):','Player');
  if(!name) return;
  const user = { name: name.trim().slice(0,16), ts: Date.now() };
  saveUser(user);
  updateNavUser();
}
function signOut(){
  if(!confirm('Sign out?')) return;
  clearUser();
  updateNavUser();
}

window.addEventListener('DOMContentLoaded',()=>{
  const authBtn = document.getElementById('btnAuth');
  const signOutBtn = document.getElementById('btnSignOut');
  if(authBtn) authBtn.addEventListener('click', signIn);
  if(signOutBtn) signOutBtn.addEventListener('click', signOut);
  updateNavUser();
});

export {};
// ========= Firebase (modular, with Storage) =========
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore, doc, setDoc, addDoc, collection, serverTimestamp,
  runTransaction, query, where, orderBy, limit, getDocs
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

/* ==== REPLACE with your real config ==== */
const firebaseConfig = {
  apiKey: "REPLACE",
  authDomain: "REPLACE.firebaseapp.com",
  projectId: "REPLACE",
  storageBucket: "REPLACE.appspot.com",
  messagingSenderId: "REPLACE",
  appId: "REPLACE"
};

export const app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export const storage = getStorage(app);

/* ===== Tiny toast system ===== */
(function(){ if (document.getElementById("toast-css")) return;
  const s=document.createElement("style"); s.id="toast-css"; s.textContent=`
  .toast{position:fixed;right:16px;bottom:16px;z-index:99999;background:#111a;color:#fff;backdrop-filter:blur(6px);
  border:1px solid #333;border-radius:10px;padding:10px 14px;margin-top:8px;box-shadow:0 6px 18px rgba(0,0,0,.45);
  font:14px system-ui,-apple-system,Segoe UI,Roboto,Arial}
  .toast.ok{border-color:#2ecc71}.toast.err{border-color:#ff6b6b}`;
  document.head.appendChild(s);
})();
function toast(msg,type="ok",ms=2500){const d=document.createElement("div");d.className=`toast ${type}`;d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),ms);}

/* ===== Username validation + Auth helpers ===== */
const BAD_WORDS=["badword","offensive","slur"];
export function validateUsername(name){const u=(name||"").trim();if(u.length<3||u.length>20)return{ok:false,msg:"Username must be 3–20 characters."};if(!/^[A-Za-z0-9_]+$/.test(u))return{ok:false,msg:"Use letters, numbers, underscores only."};if(BAD_WORDS.some(b=>u.toLowerCase().includes(b)))return{ok:false,msg:"Please choose a clean username."};return{ok:true,value:u};}
export async function signUpEmail({email,password,username}){const v=validateUsername(username);if(!v.ok)throw new Error(v.msg);const uname=v.value, lower=uname.toLowerCase();const lock=doc(db,"usernames",lower);
  await runTransaction(db, async tx=>{const taken=await tx.get(lock); if(taken.exists()) throw new Error("Username is taken."); const cred=await createUserWithEmailAndPassword(auth,email,password); await updateProfile(cred.user,{displayName:uname}); tx.set(doc(db,"users",cred.user.uid),{uid:cred.user.uid,email,username:uname,usernameLower:lower,createdAt:serverTimestamp()}); tx.set(lock,{uid:cred.user.uid,createdAt:serverTimestamp()});}); return auth.currentUser;}
export async function signInEmail({email,password}){const {user}=await signInWithEmailAndPassword(auth,email,password);return user;} export async function signOutUser(){await signOut(auth);} 

/* ===== Scores & Leaderboard ===== */
export async function submitScore({gameId,score,timeMs=0,extra={}}){ if(!auth.currentUser) throw new Error("Sign in to submit scores."); await addDoc(collection(db,"scores"),{ uid:auth.currentUser.uid, username:auth.currentUser.displayName||"(anon)", photoURL: auth.currentUser.photoURL || null, gameId:String(gameId), score:Number(score)||0, timeMs:Number(timeMs)||0, extra, createdAt:serverTimestamp() }); }
export async function topScores({gameId,take=50}){ const q=query(collection(db,"scores"),where("gameId","==",String(gameId)),orderBy("score","desc"),orderBy("timeMs","asc"),limit(take)); const snap=await getDocs(q); return snap.docs.map(d=>({id:d.id,...d.data()})); }

/* ===== small watch helper for leaderboard wiring ===== */
export function watchAuth(cb){ return onAuthStateChanged(auth, cb); }

/* ===== Header chip (login/register vs signed-in + sign out) ===== */
function wireHeaderChip(){ const chip=document.getElementById("authChip"); if(!chip) return; onAuthStateChanged(auth,(user)=>{ if(user){ const name=user.displayName||user.email; chip.innerHTML=`Signed in as <strong>${name}</strong> <button id="signOutBtn">Sign out</button>`; const btn=document.getElementById("signOutBtn"); if(btn) btn.onclick=async()=>{ await signOutUser(); toast("Signed out.","ok"); }; } else { chip.innerHTML=`<a href="/auth.html">Sign in / Register</a>`; } }); }

/* ===== Avatar upload & render (Storage) ===== */
async function uploadAvatar(file){ if(!auth.currentUser) throw new Error("Sign in first."); const uid=auth.currentUser.uid; const key=`avatars/${uid}/${Date.now()}-${file.name.replace(/\s+/g,'-').toLowerCase()}`; const r=ref(storage,key); await uploadBytes(r,file,{contentType:file.type}); const url=await getDownloadURL(r); await updateProfile(auth.currentUser,{photoURL:url}); await setDoc(doc(db,"users",uid),{photoURL:url},{merge:true}); return url; }
function wireAvatar(){ const btn=document.getElementById("avatarBtn"); const img=document.getElementById("avatarImg"); const fb=document.getElementById("avatarFallback"); const inp=document.getElementById("avatarFile"); if(!btn||!img||!fb||!inp) return; onAuthStateChanged(auth,(user)=>{ const url=user?.photoURL; if(url){ img.src=url; img.style.display="block"; fb.style.display="none"; } else { img.style.display="none"; fb.style.display="flex"; } }); btn.onclick=()=>inp.click(); inp.onchange=async(e)=>{ const file=e.target.files?.[0]; if(!file) return; try{ const url=await uploadAvatar(file); img.src=url; img.style.display="block"; fb.style.display="none"; toast("Profile picture updated!","ok"); }catch(err){ toast(err.message||"Upload failed","err"); } finally{ inp.value=""; } }; }

/* ===== Settings modal (theme, language, font size) ===== */
const PREF_KEY="site.prefs.v1"; function readPrefs(){ try{ return JSON.parse(localStorage.getItem(PREF_KEY)||"{}"); }catch{return {};}} function writePrefs(p){ localStorage.setItem(PREF_KEY,JSON.stringify(p)); } function applyPrefs(p){ const root=document.documentElement; const theme=p.theme||"system"; if(theme==="dark") root.setAttribute("data-theme","dark"); else if(theme==="light") root.setAttribute("data-theme","light"); else root.removeAttribute("data-theme"); const size=Number(p.font)||16; document.documentElement.style.fontSize=size+"px"; }
function wireSettings(){ const open=document.getElementById("settingsBtn"); const modal=document.getElementById("settingsModal"); if(!open||!modal) return; const close=document.getElementById("settingsClose"); const lang=document.getElementById("setLanguage"); const theme=document.getElementById("setTheme"); const font=document.getElementById("setFont"); const fontVal=document.getElementById("setFontVal"); const prefs={ language:"en", theme:"system", font:16, ...readPrefs() }; lang.value=prefs.language; theme.value=prefs.theme; font.value=prefs.font; fontVal.textContent=prefs.font+"px"; applyPrefs(prefs); open.onclick=()=>{ modal.style.display="flex"; }; close.onclick=()=>{ modal.style.display="none"; }; modal.addEventListener("click",(e)=>{ if(e.target===modal) modal.style.display="none"; }); lang.onchange=()=>{ prefs.language=lang.value; writePrefs(prefs); applyPrefs(prefs); toast("Language saved","ok"); }; theme.onchange=()=>{ prefs.theme=theme.value; writePrefs(prefs); applyPrefs(prefs); toast("Theme saved","ok"); }; font.oninput=()=>{ fontVal.textContent=font.value+"px"; }; font.onchange=()=>{ prefs.font=Number(font.value); writePrefs(prefs); applyPrefs(prefs); toast("Font size saved","ok"); }; }

/* ===== Minimal Help Assistant ===== */
function wireHelpBot(){ const log=document.getElementById("helpLog"); const input=document.getElementById("helpInput"); const send=document.getElementById("helpSend"); if(!log||!input||!send) return; const QA=[ {k:/register|sign\s?up/i,a:"Go to the top-right chip → ‘Sign in / Register’. On success you’ll be redirected to Play."},{k:/leaderboard|scores?/i,a:"Open Leaderboard in the top bar. Scores save when a game ends (you must be signed in)."},{k:/school|trivia|subjects?|math|science|history|english/i,a:"School Trivia lets you pick subject + difficulty (K–4, 5–8, HS, College). Start from Play → School Trivia."},{k:/music|player|sound/i,a:"Use the top bar player to pick tracks, seek, loop one, or add your own MP3s for this session."},{k:/theme|dark|light|font|language/i,a:"Open the ⚙️ settings to change theme, font size, and language preferences."} ]; function add(role,text){ const line=document.createElement("div"); line.style.margin="6px 0"; line.innerHTML = role==="you" ? `<strong>You:</strong> ${text}` : `<strong>Helper:</strong> ${text}`; log.appendChild(line); log.scrollTop=log.scrollHeight; } function answer(q){ const hit = QA.find(x=>x.k.test(q))?.a || "I can help with registration, leaderboards, School Trivia, music player, or settings."; add("bot", hit); } send.onclick=()=>{ const q=input.value.trim(); if(!q) return; add("you", q); answer(q); input.value=""; }; input.addEventListener("keydown",(e)=>{ if(e.key==="Enter") send.click(); }); if(!log.dataset.seeded){ add("bot","Hi! Ask me about registering, leaderboards, School Trivia, music, or settings."); log.dataset.seeded="1"; } }

/* ===== Leaderboard highlight helper ===== */
export function highlightMyLeaderboardRows(tbody){ const me=auth.currentUser?.uid; if(!tbody||!me) return; [...tbody.querySelectorAll("tr")].forEach(tr=>{ const uid=tr.dataset?.uid; if(uid===me) tr.classList.add("me"); }); }

/* ===== Boot ===== */
onAuthStateChanged(auth, ()=>{});
wireHeaderChip();
wireAvatar();
wireSettings();
wireHelpBot();

// small exported helpers
export { submitScore, topScores };

console.log("[Firebase] App wired (auth chip, avatar, settings, help).");

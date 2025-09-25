// ===== Firebase (v9 modular) =====
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, addDoc, collection, serverTimestamp,
  runTransaction, query, where, orderBy, limit, getDocs
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

/* ==== REPLACE with your real config ==== */
const firebaseConfig = {
  apiKey:       "REPLACE",
  authDomain:   "REPLACE.firebaseapp.com",
  projectId:    "REPLACE",
  storageBucket:"REPLACE.appspot.com",
  messagingSenderId:"REPLACE",
  appId:        "REPLACE"
};

/* Guard against double init across pages */
export const app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

/* ===== Tiny toast system ===== */
(function injectToastCSS(){
  if (document.getElementById("toast-css")) return;
  const style = document.createElement("style");
  style.id = "toast-css";
  style.textContent = `
  .toast {
    position: fixed; right: 16px; bottom: 16px; z-index: 99999;
    background: #111a; color: #fff; backdrop-filter: blur(6px);
    border: 1px solid #333; border-radius: 10px; padding: 10px 14px; margin-top: 8px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.45); font: 14px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial;
  }
  .toast.ok { border-color: #2ecc71; }
  .toast.err { border-color: #ff6b6b; }
  `;
  document.head.appendChild(style);
})();
function toast(msg, type="ok", ms=2500){
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(()=>{ el.remove(); }, ms);
}

/* ===== Username validation ===== */
const BAD_WORDS = ["badword","offensive","slur"]; // keep short list; extend if needed
export function validateUsername(name){
  const u = (name||"").trim();
  if (u.length < 3 || u.length > 20) return {ok:false,msg:"Username must be 3–20 characters."};
  if (!/^[A-Za-z0-9_]+$/.test(u))   return {ok:false,msg:"Use letters, numbers, and underscores only."};
  if (BAD_WORDS.some(b => u.toLowerCase().includes(b))) return {ok:false,msg:"Please choose a clean username."};
  return {ok:true, value:u};
}

/* ===== Sign up with unique username (username lock in /usernames/{lower}) ===== */
export async function signUpEmail({ email, password, username }){
  const val = validateUsername(username);
  if (!val.ok) throw new Error(val.msg);
  const uname = val.value;
  const unameLower = uname.toLowerCase();
  const unameRef = doc(db, "usernames", unameLower);

  await runTransaction(db, async (tx)=>{
    const taken = await tx.get(unameRef);
    if (taken.exists()) throw new Error("Username is taken.");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: uname });
    tx.set(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid, email, username: uname, usernameLower: unameLower, createdAt: serverTimestamp()
    });
    tx.set(unameRef, { uid: cred.user.uid, createdAt: serverTimestamp() });
  });
  return auth.currentUser;
}

export async function signInEmail({ email, password }) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}
export async function signOutUser(){ await signOut(auth); }

/* ===== Scores & Leaderboard ===== */
export async function submitScore({ gameId, score, timeMs=0, extra={} }){
  if (!auth.currentUser) throw new Error("Sign in to submit scores.");
  await addDoc(collection(db, "scores"), {
    uid: auth.currentUser.uid,
    username: auth.currentUser.displayName || "(anon)",
    gameId: String(gameId),
    score: Number(score)||0,
    timeMs: Number(timeMs)||0,
    extra,
    createdAt: serverTimestamp()
  });
}

export async function topScores({ gameId, take=50 }){
  const q = query(
    collection(db, "scores"),
    where("gameId","==", String(gameId)),
    orderBy("score","desc"),
    orderBy("timeMs","asc"),
    limit(take)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d=>({ id:d.id, ...d.data() }));
}

/* ===== Auto-wire the demo auth page if form IDs are present ===== */
const $ = (id)=>document.getElementById(id);

function wireAuthDemoIfPresent(){
  const loginForm = $("loginForm");
  const registerForm = $("registerForm");
  if (!loginForm && !registerForm) return; // not on auth.html

  // login
  if (loginForm){
    loginForm.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const email = $("loginEmail").value.trim();
      const pass  = $("loginPass").value;
      $("loginMsg").textContent = "Signing in…";
      try {
        await signInEmail({ email, password: pass });
        toast("Signed in!", "ok");
        $("loginMsg").textContent = "";
        location.href = "/standalone.html";
      } catch (err) {
        $("loginMsg").textContent = err.message;
        toast(err.message, "err");
      }
    });
  }

  // register
  if (registerForm){
    registerForm.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const email = $("regEmail").value.trim();
      const pass  = $("regPass").value;
      const uname = $("regUser").value.trim();
      $("regMsg").textContent = "Creating account…";
      try {
        await signUpEmail({ email, password: pass, username: uname });
        toast("Account created!", "ok");
        $("regMsg").textContent = "";
        location.href = "/standalone.html";
      } catch (err) {
        $("regMsg").textContent = err.message;
        toast(err.message, "err");
      }
    });
  }
}

/* ===== Optional: small header status chip (shows when signed in) ===== */
function wireHeaderChip(){
  const chip = document.getElementById("authChip");
  if (!chip) return;
  onAuthStateChanged(auth, (user)=>{
    if (user) {
      chip.innerHTML = `Signed in as <strong>${user.displayName || user.email}</strong> <button id="signOutBtn">Sign out</button>`;
      const btn = document.getElementById("signOutBtn");
      if (btn) btn.onclick = async ()=>{ await signOutUser(); toast("Signed out.", "ok"); };
    } else {
      chip.innerHTML = `<a href="/auth.html">Sign in / Register</a>`;
    }
  });
}

/* ===== Initialize page wiring ===== */
onAuthStateChanged(auth, ()=>{/* just to ensure auth starts */});
wireAuthDemoIfPresent();
wireHeaderChip();

// Log for Step 1 verification
console.log("[Firebase] Initialized.");
// /js/app.js
// Firebase initialization (ES module). Imported as <script type="module"> in pages.
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsabftqBfwYKT9wZhsINZXXMcy8MX3THg",
  authDomain: "burble-bb533.firebaseapp.com",
  projectId: "burble-bb533",
  storageBucket: "burble-bb533.firebasestorage.app",
  messagingSenderId: "997224317711",
  appId: "1:997224317711:web:80c55ebfceaf23adf4f47a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

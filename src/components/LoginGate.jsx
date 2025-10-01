import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_KEY',
  authDomain: 'YOUR_FIREBASE_DOMAIN',
  projectId: 'YOUR_FIREBASE_PROJECT_ID',
  appId: 'YOUR_FIREBASE_APP_ID'
};

let app; function getApp(){ if(!app) app = initializeApp(firebaseConfig); return app; }

export default function LoginGate({ onLogin }){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function googleLogin(){
    setLoading(true); setError(null);
    try {
      const auth = getAuth(getApp());
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      onLogin(res.user.displayName || 'Player');
    } catch(e){
      console.error(e); setError('Login failed. Try guest.');
    } finally { setLoading(false); }
  }
  function guest(){ onLogin('Guest_'+Math.floor(Math.random()*1000)); }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'linear-gradient(to bottom right,#6a11cb,#2575fc)', color:'#fff', gap:'1rem' }}>
      <h1>🎮 E.Vol</h1>
      <p>Choose how you’d like to enter</p>
      <div style={{ display:'flex', gap:'1rem' }}>
        <button onClick={googleLogin} disabled={loading}>{loading? 'Loading...':'Sign in with Google'}</button>
        <button onClick={guest}>Continue as Guest</button>
      </div>
      {error && <div style={{ color:'#ffb3b3' }}>{error}</div>}
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
  const navigate = useNavigate();
  const handleGuest = () => { localStorage.setItem('userMode','guest'); navigate('/home'); };
  const handleGoogleLogin = () => { alert('Google Login placeholder'); navigate('/home'); };
  return (
    <div className="login-screen">
      <h1>🎮 Welcome to E.Vol Games</h1>
      <p>Choose how you’d like to continue</p>
      <div className="login-actions">
        <button onClick={handleGoogleLogin}>Login with Google</button>
        <button onClick={handleGuest}>Play as Guest</button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginGate from './components/LoginGate.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';
import ChessGame from './games/ChessGame.jsx';
import Connect4 from './games/Connect4.jsx';
import Imposter from './games/Imposter.jsx';
import Riddles from './games/Riddles.jsx';
import Trivia from './games/Trivia.jsx';

function Home(){
  return (
    <div style={{ textAlign:'center', padding:'40px' }}>
      <h1>Welcome to E.Vol Games</h1>
      <p>Select a game above.</p>
    </div>
  );
}

export default function App(){
  const [user, setUser] = useState(null);
  if(!user){
    return <LoginGate onLogin={name => setUser(name)} />;
  }
  return (
    <Router>
      <div style={{ background:'linear-gradient(to bottom right,#4e54c8,#8f94fb)', minHeight:'100vh', color:'#fff' }}>
        <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 16px' }}>
          <h2 style={{ margin:0 }}>🎮 E.Vol</h2>
          <nav style={{ display:'flex', gap:'12px' }}>
            <Link to="/" style={{ color:'#fff' }}>Home</Link>
            <Link to="/chess" style={{ color:'#fff' }}>Chess</Link>
            <Link to="/connect4" style={{ color:'#fff' }}>Connect 4</Link>
            <Link to="/imposter" style={{ color:'#fff' }}>Imposter</Link>
            <Link to="/riddles" style={{ color:'#fff' }}>Riddles</Link>
            <Link to="/trivia" style={{ color:'#fff' }}>Trivia</Link>
          </nav>
          <div style={{ fontSize:'0.85rem' }}>👤 {user}</div>
        </header>
        <MusicPlayer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chess" element={<ChessGame />} />
            <Route path="/connect4" element={<Connect4 />} />
          <Route path="/imposter" element={<Imposter />} />
          <Route path="/riddles" element={<Riddles />} />
          <Route path="/trivia" element={<Trivia />} />
        </Routes>
      </div>
    </Router>
  );
}

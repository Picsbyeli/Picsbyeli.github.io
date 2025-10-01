import React from 'react';
import { useNavigate } from 'react-router-dom';
import MusicPlayer from '../components/MusicPlayer.jsx';

const tiles = [
  { id:'riddles', label:'🌱 Brain Riddles', path:'#' },
  { id:'trivia', label:'📘 Trivia', path:'#' },
  { id:'connect4', label:'⭕ Connect 4', path:'/connect4' },
  { id:'chess', label:'♟️ Chess', path:'/chess' },
  { id:'imposter', label:'🕵️ Imposter', path:'/imposter' }
];

export default function Home(){
  const navigate = useNavigate();
  return (
    <div className="home">
      <header className="home-header">
        <h2>🕹️ E.Vol Games</h2>
        <MusicPlayer />
        <input placeholder="Search games..." aria-label="Search" />
      </header>
      <div className="game-grid">
        {tiles.map(t => (
          <button key={t.id} className="card" onClick={()=> t.path !== '#' && navigate(t.path)}>{t.label}</button>
        ))}
      </div>
    </div>
  );
}

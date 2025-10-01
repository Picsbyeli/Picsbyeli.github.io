import React, { useState } from 'react';
import { categories, generateClue } from '../lib/imposterClues.js';

export default function Imposter(){
  const [category] = useState('Animals');
  const words = categories[category];
  const [word] = useState(words[Math.floor(Math.random()*words.length)]);
  const [impostor] = useState(Math.random()<0.25 ? 'bot' : null);
  const [clues, setClues] = useState([]);

  function botTurn(){
    const clue = generateClue(word, impostor==='bot');
    setClues(c => [...c, { player: 'Bot', clue }]);
  }

  return (
    <div className="card">
      <h2>🕵️ Imposter</h2>
      <p>Category: {category}</p>
      <p>{impostor ? 'A bot is the impostor...' : 'Maybe you are the impostor.'}</p>
      <button onClick={botTurn}>▶ Bot Give Clue</button>
      <ul>
        {clues.map((c,i)=>(<li key={i}><strong>{c.player}:</strong> {c.clue}</li>))}
      </ul>
    </div>
  );
}

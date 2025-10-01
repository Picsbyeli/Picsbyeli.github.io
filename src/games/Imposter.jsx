import React, { useState } from 'react';

function getBotClue(category, isImposter = false) {
  const categories = {
    Animals: ['Has claws','Lives in jungle','Eats plants','Big teeth','Fast runner','Has tail'],
    Foods: ['Sweet','Spicy','Eaten cold','Comes in box','Made with milk','Served hot'],
    Places: ['Crowded','Sunny','Tall buildings','Mountains nearby','Near water','Historic']
  };
  const pool = categories[category] || ['Hard to describe'];
  const clue = pool[Math.floor(Math.random()*pool.length)];
  return isImposter ? clue + ' (maybe)' : clue;
}

export default function Imposter(){
  const [category, setCategory] = useState('Animals');
  const [clues, setClues] = useState([]);
  const [round, setRound] = useState(1);

  function startRound(){
    setRound(r=>r+1);
    const newClues = [
      { player:'Bot1', clue:getBotClue(category, false) },
      { player:'Bot2', clue:getBotClue(category, true) }, // impostor
      { player:'Bot3', clue:getBotClue(category, false) }
    ];
    setClues(newClues);
  }

  return (
    <div style={{ textAlign:'center', padding:'20px' }}>
      <h2>🕵️ Imposter (Round {round})</h2>
      <select value={category} onChange={e=>setCategory(e.target.value)}>
        <option>Animals</option>
        <option>Foods</option>
        <option>Places</option>
      </select>
      <button onClick={startRound} style={{ marginLeft:'8px' }}>Start Round</button>
      <ul style={{ listStyle:'none', padding:0, marginTop:'16px' }}>
        {clues.map((c,i)=>(<li key={i}><strong>{c.player}</strong>: {c.clue}</li>))}
      </ul>
    </div>
  );
}

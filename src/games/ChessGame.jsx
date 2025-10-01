import React, { useState } from 'react';
import { Chess } from 'chess.js';
import Chessboard from 'chessboardjsx';

export default function ChessGame(){
  const [game] = useState(new Chess());
  const [fen, setFen] = useState('start');

  function onDrop({ sourceSquare, targetSquare }){
    const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if(move === null) return;
    setFen(game.fen());
  }

  return (
    <div style={{ textAlign:'center', padding:'20px' }}>
      <h2>♟ Chess</h2>
      <Chessboard width={480} position={fen} onDrop={onDrop} transitionDuration={200} />
    </div>
  );
}

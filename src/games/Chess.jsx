import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

export default function ChessGame(){
  const [game, setGame] = useState(new Chess());
  function safeGameMutate(mod){
    setGame(g => { const updated = new Chess(g.fen()); mod(updated); return updated; });
  }
  function onDrop(source, target){
    safeGameMutate(g => { g.move({ from: source, to: target, promotion: 'q' }); });
    return true;
  }
  return (
    <div className="card">
      <h2>♟ Chess</h2>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
    </div>
  );
}

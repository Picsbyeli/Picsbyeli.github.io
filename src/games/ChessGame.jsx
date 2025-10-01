import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());

  function makeMove(move){
    const next = new Chess(game.fen());
    const result = next.move(move);
    if(result){
      setGame(next);
    }
  }

  return (
    <div style={styles.container}>
      <h2>♟️ Chess</h2>
      <Chessboard
        position={game.fen()}
        onPieceDrop={(sourceSquare, targetSquare) => {
          makeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' });
        }}
      />
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center'
  }
};

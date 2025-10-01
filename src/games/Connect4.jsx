import React, { useState } from 'react';

export default function Connect4(){
  const rows = 6, cols = 7;
  const empty = () => Array(rows).fill(null).map(()=>Array(cols).fill(null));
  const [board, setBoard] = useState(empty());
  const [player, setPlayer] = useState('🔴');
  const [winner, setWinner] = useState(null);

  function drop(col){
    if(winner) return;
    setBoard(prev => {
      const next = prev.map(r=>r.slice());
      for(let r=rows-1; r>=0; r--){
        if(!next[r][col]){ next[r][col]=player; break; }
      }
      checkWin(next);
      return next;
    });
    setPlayer(p=> p==='🔴' ? '🟡' : '🔴');
  }

  function checkWin(b){
    const dirs = [[1,0],[0,1],[1,1],[1,-1]];
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const cell = b[r][c]; if(!cell) continue;
        for(const [dr,dc] of dirs){
          let k=1; while(k<4){
            const nr=r+dr*k, nc=c+dc*k; if(nr<0||nr>=rows||nc<0||nc>=cols) break;
            if(b[nr][nc]!==cell) break; k++; }
          if(k===4){ setWinner(cell); return; }
        }
      }
    }
  }

  function reset(){ setBoard(empty()); setPlayer('🔴'); setWinner(null); }

  return (
    <div style={{ textAlign:'center' }}>
      <h2>⭕ Connect 4</h2>
      {board.map((row,r)=> (
        <div key={r} style={{ display:'flex', justifyContent:'center' }}>
          {row.map((cell,c)=> (
            <div key={c} onClick={()=>drop(c)} style={{ width:56, height:56, margin:2, borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', cursor:'pointer', boxShadow:'0 0 4px #000 inset' }}>
              {cell}
            </div>
          ))}
        </div>
      ))}
      <p>{winner ? `Winner: ${winner}` : `Current Player: ${player}`}</p>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

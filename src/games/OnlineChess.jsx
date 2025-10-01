import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import io from 'socket.io-client';

/*
  OnlineChess component
  Features:
  - Create or join a game by ID
  - Real-time move sync via socket.io (if backend available)
  - Fallback to local play if server unreachable
  - Copy/share game ID
  - Shows player colors and turn status
  Expected backend minimal API (namespace / or /chess):
    connection -> server assigns socket.id
    client emits 'createGame' => server responds { gameId, color }
    client emits 'joinGame', { gameId } => server responds { success, color, fen }
    server broadcasts 'move', { gameId, move, fen }
    client emits 'move', { gameId, move }
*/

const SERVER_URL = import.meta?.env?.VITE_CHESS_SERVER_URL || '';

export default function OnlineChess(){
  const [game] = useState(() => new Chess());
  const [fen, setFen] = useState(() => game.fen());
  const [gameId, setGameId] = useState('');
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [mode, setMode] = useState('menu'); // menu | playing
  const [color, setColor] = useState('white');
  const [serverEnabled, setServerEnabled] = useState(!!SERVER_URL);
  const socketRef = useRef(null);

  // Initialize socket
  useEffect(() => {
    if(!SERVER_URL){
      setStatus('Server URL not configured. Local play only.');
      return;
    }
    const socket = io(SERVER_URL, { transports:['websocket'], autoConnect:true });
    socketRef.current = socket;
    socket.on('connect', () => { setConnected(true); setStatus('Connected.'); });
    socket.on('disconnect', () => { setConnected(false); setStatus('Disconnected'); });
    socket.on('move', payload => {
      if(payload?.fen){
        try {
          game.load(payload.fen);
          setFen(game.fen());
        } catch(e){/* ignore */}
      } else if (payload?.move){
        try {
          game.move(payload.move);
          setFen(game.fen());
        } catch(e){/* ignore */}
      }
    });
    socket.on('gameCreated', data => {
      setGameId(data.gameId);
      setColor(data.color || 'white');
      setMode('playing');
      setStatus(`Game created. You are ${data.color}. Share ID to invite opponent.`);
    });
    socket.on('gameJoined', data => {
      if(!data.success){
        setStatus(data.message || 'Failed to join game');
        return;
      }
      setGameId(data.gameId);
      setColor(data.color || 'black');
      if(data.fen){
        try { game.load(data.fen); setFen(game.fen()); } catch(e){}
      }
      setMode('playing');
      setStatus(`Joined game ${data.gameId}. You are ${data.color}.`);
    });
    socket.on('errorMessage', msg => setStatus(msg));
    return () => { socket.disconnect(); };
  }, []); // eslint-disable-line

  const emitMove = useCallback((moveObj) => {
    if(serverEnabled && socketRef.current && connected && gameId){
      socketRef.current.emit('move', { gameId, move: moveObj });
    }
  }, [serverEnabled, connected, gameId]);

  function handlePieceDrop(source, target){
    const move = { from: source, to: target, promotion: 'q' };
    const result = game.move(move);
    if(result){
      setFen(game.fen());
      emitMove(move);
      return true;
    }
    return false;
  }

  function createGame(){
    if(!serverEnabled || !socketRef.current){
      // Local offline game simply resets board
      game.reset(); setFen(game.fen()); setMode('playing'); setColor('white');
      setStatus('Local game started.');
      return;
    }
    socketRef.current.emit('createGame');
  }

  function joinExisting(id){
    if(!id) return;
    if(!serverEnabled || !socketRef.current){
      setStatus('Server disabled. Cannot join remote game.');
      return;
    }
    socketRef.current.emit('joinGame', { gameId: id.trim() });
  }

  function copyId(){
    if(!gameId) return;
    try { navigator.clipboard.writeText(gameId); setStatus('Game ID copied to clipboard'); } catch(e){ setStatus('Copy failed'); }
  }

  function playerTurn(){
    return game.turn() === 'w' ? 'White to move' : 'Black to move';
  }

  const orientation = color === 'black' ? 'black' : 'white';

  return (
    <div style={styles.wrapper}>
      <h2 style={{ marginTop:0 }}>♟️ Online Chess</h2>
      {mode === 'menu' && (
        <div style={styles.menuBox}>
          <p style={styles.note}>{serverEnabled ? 'Play online or local fallback.' : 'Server not configured: local hot-seat only.'}</p>
          <div style={styles.actions}>
            <button onClick={createGame}>Create Game</button>
            <JoinForm onJoin={joinExisting} />
          </div>
        </div>
      )}
      {mode === 'playing' && (
        <div style={styles.topBar}>
          <div>
            <strong>ID:</strong> {gameId || 'local'} {gameId && <button onClick={copyId}>Copy</button>}
          </div>
          <div><strong>You:</strong> {color}</div>
          <div>{playerTurn()}</div>
          <div style={{ fontSize:'0.75rem', opacity:0.8 }}>{status}</div>
        </div>
      )}
      <div style={styles.boardArea}>
        <Chessboard
          position={fen}
          onPieceDrop={handlePieceDrop}
          boardOrientation={orientation}
          customLightSquareStyle={{ backgroundColor:'#f0d9b5' }}
          customDarkSquareStyle={{ backgroundColor:'#b58863' }}
          animationDuration={150}
        />
      </div>
      {mode === 'playing' && (
        <div style={styles.footer}> <button onClick={() => { game.undo(); setFen(game.fen()); }}>Undo</button> <button onClick={() => { game.reset(); setFen(game.fen()); setStatus('Board reset.'); }}>Reset</button> <button onClick={() => { setMode('menu'); setGameId(''); setStatus('Returned to menu'); }}>Exit</button> </div>
      )}
    </div>
  );
}

function JoinForm({ onJoin }){
  const [id, setId] = useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); onJoin(id); }} style={styles.joinForm}>
      <input placeholder="Game ID" value={id} onChange={e=>setId(e.target.value)} style={styles.input} />
      <button type="submit">Join</button>
    </form>
  );
}

const styles = {
  wrapper: { maxWidth: 700, margin:'0 auto', padding:'16px', textAlign:'center' },
  menuBox: { background:'rgba(255,255,255,0.08)', padding:'12px 16px', borderRadius:8 },
  note: { fontSize:'0.85rem', opacity:0.9 },
  actions: { display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap' },
  boardArea: { marginTop:16, display:'flex', justifyContent:'center' },
  topBar: { display:'flex', flexWrap:'wrap', justifyContent:'space-between', gap:'8px', background:'rgba(0,0,0,0.3)', padding:'8px 12px', borderRadius:6, marginBottom:8, fontSize:'0.85rem' },
  footer: { marginTop:12, display:'flex', gap:'8px', justifyContent:'center' },
  joinForm: { display:'flex', gap:6 },
  input: { padding:'4px 8px', borderRadius:4, border:'1px solid #ccc' }
};

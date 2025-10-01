import React, { useState, useEffect } from 'react';

export default function MusicPlayer(){
  const [show, setShow] = useState(() => localStorage.getItem('music.show') !== 'false');
  const [url, setUrl] = useState(localStorage.getItem('music.embed') || '');

  useEffect(()=>{ localStorage.setItem('music.show', show); },[show]);
  useEffect(()=>{ if(url) localStorage.setItem('music.embed', url); },[url]);

  const playSpotify = (playlistId) => setUrl(`https://open.spotify.com/embed/playlist/${playlistId}`);
  const playYouTube = (videoId) => setUrl(`https://www.youtube.com/embed/${videoId}`);

  return (
    <div className="music-player">
      <button onClick={()=>setShow(s=>!s)}>{show? '🔽 Minimize':'🔼 Show Player'}</button>
      <button onClick={()=>playSpotify('37i9dQZF1DXcBWIGoYBM5M')}>🎵 Spotify Demo</button>
      <button onClick={()=>playYouTube('dQw4w9WgXcQ')}>▶ YT Demo</button>
      {show && url && (
        <iframe title="music" src={url} width="300" height="80" allow="autoplay; clipboard-write; encrypted-media" />
      )}
    </div>
  );
}

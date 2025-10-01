import React, { useState, useEffect } from 'react';

export default function MusicPlayer(){
  const [query, setQuery] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [error, setError] = useState(null);

  async function searchYouTube(){
    setError(null);
    try {
      const key = 'YOUR_YOUTUBE_API_KEY'; // replace with real key
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${key}`);
      const data = await res.json();
      if(data.error){ throw new Error(data.error.message || 'API error'); }
      if(data.items?.length){ setVideoId(data.items[0].id.videoId); }
      else { setError('No results'); }
    } catch(e){ setError(e.message); }
  }

  return (
    <div style={{ background:'#222', color:'#fff', padding:'8px 10px', display:'flex', flexWrap:'wrap', alignItems:'center', gap:'8px' }}>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search YouTube..." style={{ padding:'6px 8px', borderRadius:6, border:'1px solid #444', background:'#111', color:'#fff' }} />
      <button onClick={searchYouTube}>Search</button>
      <button onClick={()=>setMinimized(m=>!m)}>{minimized? 'Show Player':'Minimize'}</button>
      {!minimized && videoId && (
        <iframe
          width="300"
          height="180"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="autoplay; encrypted-media"
          title="YouTube player"
        />
      )}
      {error && <span style={{ color:'#f99' }}>{error}</span>}
    </div>
  );
}

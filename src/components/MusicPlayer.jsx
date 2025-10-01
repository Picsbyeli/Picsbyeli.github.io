import React, { useState, useRef } from 'react';

export default function MusicPlayer() {
  const [search, setSearch] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  const YT_API_KEY = 'YOUR_YOUTUBE_API_KEY'; // Replace with actual key

  async function fetchYouTubeUrl(query){
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${YT_API_KEY}`);
      const data = await res.json();
      if(data.items?.length){
        const videoId = data.items[0].id.videoId;
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    } catch(e){
      console.error('YouTube API error:', e);
    }
    return null;
  }

  const addToPlaylist = async () => {
    if(!search.trim()) return;
    let url = search.trim();
    if(!/^https?:\/\//i.test(url)){
      const found = await fetchYouTubeUrl(url);
      if(!found){
        alert('No results found.');
        return;
      }
      url = found;
    }
    setPlaylist(p => [...p, url]);
    setSearch('');
  };

  function playSong(index){
    setCurrentIndex(index);
    const songUrl = playlist[index];
    if(!songUrl) return;
    if(songUrl.includes('youtube.com/watch')){
      const videoId = new URL(songUrl).searchParams.get('v');
      const iframe = document.getElementById('yt-frame');
      if(iframe){
        iframe.style.display = 'block';
        iframe.style.height = '200px';
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      if(audioRef.current){
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
      }
    } else {
      // Assume direct audio stream
      if(audioRef.current){
        audioRef.current.src = songUrl;
        audioRef.current.play();
      }
      const iframe = document.getElementById('yt-frame');
      if(iframe){
        iframe.style.display = 'none';
        iframe.src = '';
      }
    }
  }

  function nextSong(){
    if(currentIndex < playlist.length - 1) playSong(currentIndex + 1);
  }
  function prevSong(){
    if(currentIndex > 0) playSong(currentIndex - 1);
  }

  return (
    <div style={styles.player}>
      <div style={styles.top}>
        <input
          type="text"
          placeholder="Search YouTube / paste link..."
            value={search}
          onChange={e=>setSearch(e.target.value)}
          style={styles.input}
        />
        <button onClick={addToPlaylist} style={styles.addBtn}>+</button>
      </div>
      <audio ref={audioRef} controls autoPlay onEnded={nextSong} style={styles.audio} />
      <iframe
        id="yt-frame"
        title="YouTube Player"
        width="100%"
        height="0"
        style={{ border:'none', display:'none' }}
        allow="autoplay"
      />
      <div style={styles.playlist}>
        {playlist.map((song,i)=>(
          <div
            key={i}
            style={{
              ...styles.song,
              background: i===currentIndex? '#eee':'transparent'
            }}
            onClick={()=>playSong(i)}
          >
            🎵 {song}
          </div>
        ))}
      </div>
      <div style={styles.controls}>
        <button onClick={prevSong}>⏮️ Prev</button>
        <button onClick={nextSong}>⏭️ Next</button>
      </div>
    </div>
  );
}

const styles = {
  player:{
    background:'rgba(255,255,255,0.8)',
    padding:'12px',
    borderRadius:'10px',
    width:'100%',
    maxWidth:'600px',
    margin:'auto',
    boxShadow:'0 4px 10px rgba(0,0,0,0.1)'
  },
  top:{ display:'flex', marginBottom:'10px' },
  input:{ flex:1, padding:'8px', borderRadius:'5px', border:'1px solid #ccc' },
  addBtn:{ marginLeft:'8px', padding:'8px 12px', background:'#6c63ff', color:'#fff', borderRadius:'5px', border:'none', cursor:'pointer' },
  audio:{ width:'100%', marginBottom:'10px' },
  playlist:{ maxHeight:'150px', overflowY:'auto', borderTop:'1px solid #ddd', paddingTop:'5px' },
  song:{ padding:'5px', cursor:'pointer' },
  controls:{ marginTop:'10px', display:'flex', justifyContent:'space-between' }
};

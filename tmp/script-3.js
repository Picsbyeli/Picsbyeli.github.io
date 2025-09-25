
document.addEventListener('DOMContentLoaded', function(){
    const TP_TRACKS = [
        { title: "Marvel Opening Theme", url: "assets/audio/Marvel Opening Theme.mp3" },
        { title: "Pokémon Theme Song",    url: "assets/audio/Pokémon Theme Song.mp3" },
        { title: "Star Wars Main Theme",  url: "assets/audio/Star Wars Main Theme (Full).mp3" }
    ];

    const $ = (id) => document.getElementById(id);
    const audio = $('tp-audio');
    const songSel = $('tp-song');
    const btnPrev = $('tp-prev');
    const btnPlay = $('tp-play');
    const btnNext = $('tp-next');
    const btnBack = $('tp-back10');
    const btnFwd  = $('tp-fwd10');
    const seek    = $('tp-seek');
    const vol     = $('tp-vol');
    const loopOne = $('tp-loop-one');
    const btnAdd  = $('tp-add');
    const fileInp = $('tp-file');

    const LS_KEY = 'topbarPlayer.v1';
    let state = { i: 0, t: 0, v: 0.8, loop1: false, tracks: TP_TRACKS.slice() };
    try { const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); state = { ...state, ...saved, tracks: (saved.tracks?.length ? saved.tracks : state.tracks) }; } catch {}
    const save = () => localStorage.setItem(LS_KEY, JSON.stringify(state));

    function buildSongList(){ songSel.innerHTML=''; state.tracks.forEach((t, idx)=>{ const opt=document.createElement('option'); opt.value=idx; opt.textContent=t.title; songSel.appendChild(opt); }); songSel.value=String(state.i); }
    function load(idx, resumeTime=false){ if(idx<0) idx=state.tracks.length-1; if(idx>=state.tracks.length) idx=0; state.i=idx; audio.src = state.tracks[state.i].url; audio.load(); if(resumeTime) audio.currentTime=Number(state.t)||0; else state.t=0; buildSongList(); save(); }
    function play(){ audio.play().then(()=>{ state.playing = true; btnPlay.textContent='⏸'; save(); }).catch(()=>{ btnPlay.textContent='▶️'; }); }
    function pause(){ audio.pause(); state.playing=false; btnPlay.textContent='▶️'; save(); }
    function next(){ load(state.i+1,false); play(); }
    function prev(){ load(state.i-1,false); play(); }

    btnPlay?.addEventListener('click', ()=> audio.paused ? play() : pause());
    btnNext?.addEventListener('click', next);
    btnPrev?.addEventListener('click', prev);
    btnBack?.addEventListener('click', ()=>{ audio.currentTime = Math.max(0, audio.currentTime - 10); });
    btnFwd?.addEventListener('click', ()=>{ audio.currentTime = Math.min(audio.duration||0, audio.currentTime + 10); });
    songSel?.addEventListener('change', ()=>{ load(Number(songSel.value), false); play(); });
    vol?.addEventListener('input', e=>{ audio.volume = Number(e.target.value); state.v = audio.volume; save(); });
    seek?.addEventListener('input', e=>{ const pct = Number(e.target.value)/100; audio.currentTime = pct * (audio.duration||0); });
    loopOne?.addEventListener('change', ()=>{ state.loop1 = loopOne.checked; save(); });
    btnAdd?.addEventListener('click', ()=> fileInp.click());
    fileInp?.addEventListener('change', (e)=>{ Array.from(e.target.files||[]).forEach(f=>{ const url = URL.createObjectURL(f); state.tracks.push({ title: f.name.replace(/\.(mp3|mpeg)$/i,''), url }); }); buildSongList(); save(); });
    audio?.addEventListener('timeupdate', ()=>{ if(!audio.duration) return; seek.value = String((audio.currentTime / audio.duration) * 100); state.t = audio.currentTime; save(); });
    audio?.addEventListener('ended', ()=>{ state.loop1 ? (audio.currentTime=0, play()) : next(); });
    audio?.addEventListener('play', ()=>{ btnPlay.textContent='⏸'; state.playing=true; save(); });
    audio?.addEventListener('pause', ()=>{ btnPlay.textContent='▶️'; state.playing=false; save(); });

        (function init(){
            if (!audio) return; // guard if DOM ids not present
            audio.volume = Number(state.v) || 0.8;
            if (vol) vol.value = String(audio.volume);
            if (loopOne) loopOne.checked = !!state.loop1;
            buildSongList(); load(Number(state.i) || 0, true); if(state.playing) play(); const kick = ()=>{ if(audio.paused) play(); window.removeEventListener('click', kick, true); }; window.addEventListener('click', kick, true);
        })();
    });
    
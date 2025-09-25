// Safety stubs for globals that might be referenced before real implementations
(function(){
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.playModeAudio !== 'function') {
      window.playModeAudio = function(){ /* stub */ };
    }
    if (typeof window.setPlayerSrc !== 'function') {
      window.setPlayerSrc = function(){ /* stub */ };
    }
    // Minimal DOM/global stubs for short-hand vars used in inline scripts
    try { if (typeof $next === 'undefined') { $next = { addEventListener: function(){}, onclick: null }; } } catch(e){}
    try { if (typeof $prev === 'undefined') { $prev = { addEventListener: function(){}, onclick: null }; } } catch(e){}
    try { if (typeof $play === 'undefined') { $play = { addEventListener: function(){}, onclick: null }; } } catch(e){}
    try { if (typeof $pause === 'undefined') { $pause = { addEventListener: function(){}, onclick: null }; } } catch(e){}
    try { if (typeof window.audioPlayer === 'undefined') { window.audioPlayer = { play: function(){ return Promise.resolve(); }, pause: function(){}, currentTime: 0, duration: 0 }; } } catch(e){}
    // also ensure unqualified globals exist (some inline scripts reference bare identifiers)
    try { if (typeof playModeAudio === 'undefined') playModeAudio = window.playModeAudio; } catch(e){}
    try { if (typeof setPlayerSrc === 'undefined') setPlayerSrc = window.setPlayerSrc; } catch(e){}
  } catch(e){}
})();
